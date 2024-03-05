'use client'
import Header from '../components/Header'
import ParseORU from './ParseORU'
import UploadFile from './UploadFile'

export default function Page(): JSX.Element {
  return (
    <>
      <Header />
      <div className='wrapper'>
        <UploadFile />
        <ParseORU />
      </div>
    </>
  )
}
