'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { HiOutlineDocumentReport, HiOutlineUpload } from 'react-icons/hi'
import { useGetFiles, useUpload } from '../services'

export default function UploadFile() {
  const [data, setData] = useState([])
  const { mutate: upload } = useUpload()
  const { data: filesData } = useGetFiles()

  useEffect(() => {
    if (filesData?.length) {
      setData(filesData)
    }
  }, [filesData])

  const onDrop = useCallback((files: any) => {
    console.log('onDrop', files)
    const payload = new FormData()
    for (const file of files) {
      payload.append('files', file)
    }
    upload(payload)
    // setData((p) => p.concat(files.map((x: any) => x.name)))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div>
      <h1 className='mt-10 py-4 font-bold text-2xl'>ORU Files:</h1>
      <div
        {...getRootProps()}
        className={`${isDragActive ? '' : ' '} w-full group h-40 border-dashed border-gray-300 border-suplementary relative cursor-pointer rounded-lg border  hover:border-suplementary flex items-center justify-center  gap-2 p-2.5`}
      >
        <input {...getInputProps()} type='file' accept='.csv,*.txt' />
        <HiOutlineUpload
          className={`w-5 h-5 group-hover:stroke-suplementary cursor-pointer`}
        />
        <span
          className={`${isDragActive ? 'text-suplementary' : 'text-neutral-800'}  group-hover:text-suplementary`}
        >
          {isDragActive ? 'Drop Disini Untuk ' : ''} Upload ORU file (.txt)
        </span>
      </div>
      <div className='flex gap-10 my-10'>
        {!!data?.length &&
          data.map((file: any, index: number) => {
            return (
              <div
                key={index}
                className='flex flex-col items-center justify-center gap-4'
              >
                <div className='border p-5 rounded-xl w-20'>
                  <HiOutlineDocumentReport className='text-4xl' />
                </div>
                <span>{file.original}</span>
              </div>
            )
          })}
      </div>
    </div>
  )
}
