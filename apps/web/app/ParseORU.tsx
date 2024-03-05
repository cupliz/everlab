import React, { useEffect } from 'react'
import { useGetParsing } from '../services'
import { Observation } from '../types/observation'

export default function ParseORU() {
  const { data: parsingData } = useGetParsing()

  return (
    <div>
      <h1 className='mt-10 py-4 font-bold text-2xl'>Parsing ORU:</h1>
      <div className='flex flex-col gap-10 font-normal text-gray-500 dark:text-gray-400 mb-40'>
        {!!parsingData?.length &&
          parsingData.map((row: any, index: number) => {
            const pid = Object.keys(row.PatientInformation)
            return (
              <div
                key={index}
                className='grid grid-cols-3 block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
              >
                <div>
                  <h5 className='mb-2 text-2xl tracking-tight text-gray-900 dark:text-white'>
                    Patient Information
                  </h5>
                  {pid.map((key: string, i: number) => {
                    return (
                      <div key={i} className='grid grid-cols-2'>
                        <div>{key}</div>
                        <div>{row.PatientInformation[key]}</div>
                      </div>
                    )
                  })}
                </div>

                <div className='col-span-2'>
                  <h5 className='mb-2 text-2xl tracking-tight text-gray-900 dark:text-white'>
                    Visit Information
                  </h5>
                  <div className='grid grid-cols-2'>
                    <div>ReferringDoctor:</div>
                    <div>
                      <div>{row.VisitInformation.ReferringDoctor.Name}</div>
                      <div>{row.VisitInformation.ReferringDoctor.License}</div>
                    </div>
                  </div>
                  <h5 className='mb-2 text-2xl tracking-tight text-gray-900 dark:text-white'>
                    Additional Information
                  </h5>
                  <ol>
                    {!!row.AdditionalInformation &&
                      row.AdditionalInformation.map((row3: any, i3: number) => {
                        const isObj = row3.includes(':')
                        const [data1, data2] = isObj ? row3.split(/(?=:)/g) : []
                        return (
                          <li key={i3} className='w-full my-2'>
                            {isObj ? (
                              <>
                                <span className='font-semibold'>{data1}</span>
                                <span>{data2}</span>
                              </>
                            ) : (
                              row3
                            )}
                          </li>
                        )
                      })}
                  </ol>
                </div>

                <div className='col-span-3 w-full'>
                  <h5 className='mb-2 text-2xl tracking-tight text-gray-900 dark:text-white'>
                    Observation Results
                  </h5>
                  <div className='grid grid-cols-4 gap-4 overflow-auto'>
                    {!!row.ObservationResults &&
                      row.ObservationResults.map((row2: any, i: number) => {
                        const obx = Object.keys(row2)
                        return (
                          <div
                            key={i}
                            className='my-4 border border-gray-200 rounded-xl p-4'
                          >
                            {obx.map((key: string, i: number) => {
                              return (
                                <div key={i} className='grid grid-cols-2'>
                                  <div>{key}</div>
                                  <div>{row2[key]}</div>
                                </div>
                              )
                            })}
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
