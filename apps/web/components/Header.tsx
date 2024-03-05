import React from 'react'

export default function Header() {
  return (
    <header className='sticky top-0 z-40 flex w-full bg-white drop-shadow-1 drop-shadow '>
      <div className='flex flex-col py-4 px-4 shadow-2 md:px-6 2xl:px-11 w-full'>
        <div className={`w-full items-center justify-between`}>
          <div className={`flex-col gap-y-2 w-11/12 lg:w-full text-wrap flex`}>
            <h1 className='self-stretch text-gray-900 text-xl lg:text-3xl font-bold leading-4 lg:leading-[38px]'>
              Everlab
            </h1>
            <p className='self-stretch truncate whitespace-nowrap lg:whitespace-normal text-slate-600 text-xs lg:text-base  '></p>
          </div>

          <div className='flex justify-end w-full items-center gap-3  sm:gap-7'>
           
          </div>
        </div>
      </div>
    </header>
  )
}
