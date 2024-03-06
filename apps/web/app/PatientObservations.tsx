import React, { useEffect } from 'react'
import { useGetParsing } from '../services'
import { Observation } from '../types/observation'

export default function PatientObservations() {
  const { data: parsingData } = useGetParsing()

  return (
    <div>
      <h1 className='mt-10 py-4 font-bold text-2xl'>Parsing ORU:</h1>
      <div className='flex flex-col gap-10 font-normal text-gray-500 dark:text-gray-400 mb-40'>
        {!!parsingData?.length &&
          parsingData.map((row: Observation, index: number) => {
            const pi: any = row?.PatientInformation
            const pid = Object.keys(pi)
            return (
              <div
                key={index}
                className='grid grid-cols-2 gap-5 block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
              >
                <div>
                  <h5 className='mb-2 text-2xl tracking-tight text-gray-900 dark:text-white'>
                    Patient Information
                  </h5>
                  {pid.map((key: string, i: number) => {
                    return (
                      <div key={i} className='grid grid-cols-2'>
                        <div>{key}</div>
                        <div>{pi[key]}</div>
                      </div>
                    )
                  })}

                  <h5 className='border-t pt-3 my-3 text-2xl tracking-tight text-gray-900 dark:text-white'>
                    Visit Information
                  </h5>
                  <div className='grid grid-cols-2'>
                    <div>ReferringDoctor:</div>
                    <div>
                      <div>{row.VisitInformation.ReferringDoctor.Name}</div>
                      <div>{row.VisitInformation.ReferringDoctor.License}</div>
                    </div>
                  </div>

                  <h5 className='border-t pt-3 my-3 text-2xl tracking-tight text-gray-900 dark:text-white'>
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

                <div className='w-full'>
                  <h5 className='mb-2 text-2xl tracking-tight text-gray-900 dark:text-white'>
                    Observation Results
                  </h5>
                  <div className=' h-[40rem] overflow-auto'>
                    <div className='grid grid-cols-2 gap-4'>
                      {!!row.ObservationResults &&
                        row.ObservationResults.map((row2: any, i: number) => {
                          const obx = Object.keys(row2)
                          return (
                            <div
                              key={i}
                              className='border border-gray-200 rounded-xl p-4'
                            >
                              {obx.map((key: string, i: number) => {
                                const value = row2[key]
                                let className = ''
                                if (key === 'Status') {
                                  className =
                                    value == 'Normal'
                                      ? 'text-green-500'
                                      : 'text-red-500'
                                }
                                if (key === 'Category') {
                                  if (value == 'Low') {
                                    className = 'text-green-500'
                                  } else if (value == 'Medium') {
                                    className = 'text-yellow-500'
                                  } else {
                                    className = 'text-red-500'
                                  }
                                }
                                return (
                                  <div key={i} className='grid grid-cols-2'>
                                    <div>{key}</div>
                                    <div className={className}>{value}</div>
                                  </div>
                                )
                              })}
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
