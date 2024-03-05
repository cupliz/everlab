export interface Observation {
  PatientInformation: PatientInformation
  VisitInformation: VisitInformation
  OrderInformation: OrderInformation
  ObservationResults: ObservationResult[]
  AdditionalInformation: string[]
}

export interface PatientInformation {
  PatientName: string
  DateOfBirth: string
  Gender: string
  Address: string
  PhoneNumberHome: string
  PatientID: string
}

export interface VisitInformation {
  VisitNumber: string
  AttendingDoctor: AttendingDoctor
  ReferringDoctor: ReferringDoctor
  ConsultingDoctor: ConsultingDoctor
}

export interface AttendingDoctor {
  License: string
  Name: string
}

export interface ReferringDoctor {
  License: string
  Name: string
}

export interface ConsultingDoctor {
  License: string
  Name: string
}

export interface OrderInformation {
  OrderControl: string
  ResultsReportedBy: ResultsReportedBy
  'Test Requested': string
}

export interface ResultsReportedBy {
  License: string
  Name: string
}

export interface ObservationResult {
  Test: string
  Result: string
  NormalRange: string
  TestDate: string
  Status: string
  Category: string
}
