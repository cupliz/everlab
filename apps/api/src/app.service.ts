import * as path from 'path';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import OpenAI from 'openai';
import {
  categorizeByEverlab,
  categorizeValue,
  getDate,
  getDateTime,
  getDetailDoctor,
  getNatureOfAbnormalTest,
  getObservationIdentifier,
  getObservationResultStatus,
} from '@/helper';
import { env } from './config';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async upload(files: any[]) {
    try {
      const createData = [];
      for (const file of files) {
        const mimetype = file.mimetype;
        const mime = mimetype.split('/');
        const exist = await this.prisma.files.findFirst({
          where: { original: file.originalname },
        });
        if (exist) {
          console.log('delete same file', exist.key);
          const oldFile = `./files/${exist.key}`;
          if (fs.existsSync(oldFile)) {
            await fs.unlinkSync(oldFile);
            await this.prisma.files.delete({ where: { key: exist.key } });
          }
        }
        const key = `${randomUUID()}.${file.originalname.split('.').pop() || mime[1]}`;
        await fs.writeFile(`./files/${key}`, file.buffer, () => null);
        createData.push({
          key,
          original: file.originalname,
          type: mimetype,
        });
      }
      if (createData?.length) {
        return await this.prisma.files.createMany({
          data: createData,
        });
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async getFiles() {
    return await this.prisma.files.findMany();
  }

  async getParsing() {
    const files = await this.prisma.files.findMany({
      select: { key: true, original: true },
    });
    const filtered = files.filter((x) => x.original.includes('oru.txt'));
    let oruFiles = [];
    const result = [];
    for (const file of filtered) {
      const fileData = fs.readFileSync(
        path.join(__dirname, '../../files/', file.key),
        'utf8',
      );
      oruFiles = fileData.split(/(?=MSH)/g);
    }
    for (const [i, ORUstring] of oruFiles.entries()) {
      const ORUparsed = this.parseHL7(ORUstring);
      const obj1 = await this.getSummary(ORUparsed);
      result.push(obj1);
      // const obj2 = await this.getSummaryGPT(ORUstring);
      // const obj3 = {
      //   MessageHeader: this.getMessageHeader(ORUparsed),
      //   PatientIdentification: this.getPatientIdentification(ORUparsed),
      //   PatientVisit: this.getPatientVisit(ORUparsed),
      //   CommonOrder: this.getCommonOrder(ORUparsed),
      //   ObservationRequest: this.getObservationRequest(ORUparsed),
      //   ObservationResult: this.getObservationResult(ORUparsed),
      // };
    }
    // console.log(result[0].ObservationResults.map((x) => x.Test));
    return result;
  }

  async getSummaryGPT(ORUstring) {
    const prompt = `Based on the provided data, let's get patient and doctor data and also analyze the observation results and identify any abnormalities based on the specified reference ranges. Write output in a JSON format \n\n ${ORUstring}`;
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      temperature: 0.2,
      max_tokens: 300,
    });
    const result = JSON.parse(response.choices[0].message.content);
    console.log(prompt);
    console.log(result);
    return result;
  }

  parseHL7(hl7Data: string) {
    const segments = hl7Data.split('\r');
    const result = {};
    segments.forEach((segment) => {
      const fields = segment.split('|');
      const segmentName = fields[0].replace('\n', '');
      if (!result[segmentName]) {
        result[segmentName] = [];
      }
      const segmentObject = {};
      fields.slice(1).forEach((field, index) => {
        const fieldName = `Field${index + 1}`;
        segmentObject[fieldName] = field.split('^');
      });
      result[segmentName].push(segmentObject);
    });
    return result;
  }

  async getSummary(parsedData) {
    const PID = parsedData['PID'][0];
    const PV1 = parsedData['PV1'][0];
    const ORC = parsedData['ORC'][0];
    const OBX = parsedData['OBX'];
    const ObservationResults = [];
    const OrderInformation = {
      OrderControl: ORC.Field1[0],
      FillerOrderNumber: ORC.Field3.join[0],
      ResultsReportedBy: getDetailDoctor(ORC.Field12),
    };
    const AdditionalInformation = [];
    for (const [index, data] of OBX.entries()) {
      // if (index === 0) {
      if (data.Field2[0] === 'NM') {
        const metric = await this.prisma.diagnosticMetrics.findFirst({
          select: { everlab_lower: true, everlab_higher: true },
          where: { oru_sonic_codes: { contains: data.Field3[1] } },
        });
        if (data.Field3[1] === 'S C-Reactive Protein:') {
          console.log(data.Field3[1], data.Field5[0]);
        }
        // const { Status, Category } = categorizeValue(
        //   data.Field5[0],
        //   data.Field7[0],
        // );
        const { Status, Category } = categorizeByEverlab(
          data.Field5[0],
          metric?.everlab_lower,
          metric?.everlab_higher,
        );

        const obsResult = {
          Test: data.Field3[1],
          Result: `${data.Field5[0]} ${data.Field6[0]}`,
          NormalRange: `${data.Field7[0]} ${data.Field6[0]}`,
          TestDate: getDate(data.Field14[0]),
          Status,
          Category,
        };
        ObservationResults.push(obsResult);
      }

      if (data.Field2[0] === 'FT') {
        OrderInformation['Test Requested'] = data.Field3[1];
        if (!!data.Field5[0]) AdditionalInformation.push(data.Field5[0]);
      }
      // }
    }
    return {
      PatientInformation: {
        PatientName: `${PID.Field5[4]} ${PID.Field5[1]} ${PID.Field5[0]}`,
        DateOfBirth: dayjs(PID.Field7[0]).format('MMMM DD, YYYY'),
        Gender: PID.Field8[0] === 'M' ? 'Male' : 'Female',
        Address: PID.Field11.join(', '),
        Phone: PID.Field13[PID.Field13.length - 1],
        PatientID: PID.Field3[0],
      },
      VisitInformation: {
        VisitNumber: PV1.Field1[0],
        AttendingDoctor: getDetailDoctor(PV1.Field7),
        ReferringDoctor: getDetailDoctor(PV1.Field8),
        ConsultingDoctor: getDetailDoctor(PV1.Field9),
      },
      OrderInformation,
      ObservationResults,
      AdditionalInformation,
      // potentialAbnormalities:
      //   "The results for S Iron, Transferrin, Transferrin Saturation, and Ferritin are within normal ranges, so there don't appear to be significant abnormalities in the iron studies. The text mentions completed and pending tests, but all tests seem to be completed, and there are no pending samples.",
    };
  }

  getMessageHeader(parsedData) {
    const data = parsedData['MSH'][0];
    return {
      SendingApplication: data.Field2[0],
      SendingFacility: data.Field3.join(','),
      DateTime: getDateTime(data.Field6[0]),
      MessageType: data.Field8.join(','),
      MessageControlID: data.Field9[0],
      ProcessingID: data.Field10[0],
      VersionID: data.Field11[0],
      SequenceNumber: data.Field12[0],
      AcceptAcknowledgmentType: data.Field14[0],
      ApplicationAcknowledgmentType: data.Field15[0],
      CountryCode: data.Field16[0],
    };
  }

  getPatientIdentification(parsedData) {
    const data = parsedData['PID'][0];
    return {
      SetID: data.Field1[0],
      PatientID: data.Field3.join(','),
      PatientName: `${data.Field5[4]} ${data.Field5[1]} ${data.Field5[0]}`,
      DateOfBirth: dayjs(data.Field7[0]).format('MMMM DD, YYYY'),
      Gender: data.Field8[0],
      Address: data.Field11.join(', '),
      PhoneNumberHome: data.Field13[data.Field13.length - 1],
      PhoneNumberBusiness: data.Field14[data.Field14.length - 1],
      PrimaryLanguage: data.Field15[0],
      MaritalStatus: data.Field16[0],
      Religion: data.Field17[0],
      PatientAccountNumber: data.Field18[0],
      SSNNumber: data.Field19[0],
      DriverLicenseNumber: data.Field20[0],
      MotherIdentifier: data.Field21[0],
      EthnicGroup: data.Field22[0],
      Citizenship: data.Field26[0],
    };
  }

  getPatientVisit(parsedData) {
    const data = parsedData['PV1'][0];
    return {
      SetID: data.Field1[0],
      PatientClass: data.Field2[0],
      AssignedPatientLocation: data.Field3[0],
      AdmissionType: '',
      PreadmitNumber: '',
      PriorPatientLocation: '',
      AttendingDoctor: getDetailDoctor(data.Field7),
      ReferringDoctor: getDetailDoctor(data.Field8),
      ConsultingDoctor: getDetailDoctor(data.Field9),
      HospitalService: data.Field10[0],
      TemporaryLocation: data.Field11[0],
      PreadmitTestIndicator: data.Field12[0],
      ReAdmissionIndicator: data.Field13[0],
      AdmitSource: data.Field14[0],
      AmbulatoryStatus: data.Field15[0],
      VIPIndicator: data.Field16[0],
      AdmittingDoctor: getDetailDoctor(data.Field17),
      PatientType: data.Field18[0],
    };
  }

  getCommonOrder(parsedData) {
    const data = parsedData['ORC'][0];
    return {
      OrderControl: data.Field1[0],
      PlacerOrderNumber: data.Field2[0],
      FillerOrderNumber: data.Field3.join(','),
      PlacerGroupNumber: data.Field4[0],
      OrderStatus: data.Field5[0],
      ResponseFlag: data.Field6[0],
      QuantityTiming: getDate(data.Field7[3]),
      ParentOrder: data.Field8[0],
      OrderingProvider: getDetailDoctor(data.Field12),
    };
  }

  getObservationRequest(parsedData) {
    const data = parsedData['OBR'][0];
    return {
      SetID: data.Field1[0],
      PlacerOrderNumber: data.Field2.join(','),
      FillerOrderNumber: data.Field2.join(','),
      UniversalServiceID: data.Field4[0],
      Priority: data.Field5[0],
      RequestedDateTime: getDateTime(data.Field6[0]),
      ObservationDateTime: getDateTime(data.Field7[0]),
      ObservationEndDateTime: getDateTime(data.Field8[0]),
      CollectionVolume: data.Field9[0],
      CollectorIdentifier: data.Field10[0],
      SpecimenActionCode: data.Field11[0],
      DangerCode: data.Field12[0],
      RelevantClinicalInformation: data.Field13[0],
      SpecimenReceivedDateTime: getDateTime(data.Field14[0]),
      SpecimenSource: data.Field15[0],
      OrderingProvider: getDetailDoctor(data.Field16),
      OrderCallbackPhoneNumber: '',
      PlacerField1: data.Field18[0],
      PlacerField2: '',
      FillerField1: data.Field20[0],
      FillerField2: data.Field21[0],
      ResultsRptStatusChngDateTime: getDateTime(data.Field22[0]),
      ChargeToPractice: data.Field23[0],
      DiagnosticServSectID: data.Field24[0],
      ResultStatus: data.Field25[0],
      ParentResult: '',
      QuantityTiming: getDate(data.Field27[3]),
      ResultCopiesTo: '',
      ParentNumber: '',
      TransportationMode: '',
      ReasonForStudy: '',
      PrincipalResultInterpreter: '',
      AssistantResultInterpreter: '',
      Technician: '',
      Transcriptionist: '',
      ScheduledDateTime: '',
      NumberOfSampleContainers: '',
    };
  }

  getObservationResult(parsedData) {
    const obxData = parsedData['OBX'];
    const result = [];
    for (const [index, data] of obxData.entries()) {
      const obj = {
        SetID: data.Field1[0],
        ValueType: data.Field2[0],
        ObservationIdentifier: getObservationIdentifier(data.Field3),
        ObservationSubID: data.Field4[0],
        ObservationValue: data.Field5[0],
        Units: data.Field6[0],
        ReferencesRange: data.Field7[0],
        AbnormalFlags: data.Field8[0],
        Probability: data.Field9[0],
        NatureOfAbnormalTest: getNatureOfAbnormalTest(data.Field10[0]),
        ObservationResultStatus: getObservationResultStatus(data.Field11[0]),
        DateTimeObservation: getDate(data.Field14[0]),
      };
      result.push(obj);
    }
    return result;
  }
}
