'use client'
import Header from '../components/Header'
import PatientObservations from './PatientObservations'
import UploadFile from './UploadFile'

export default function Page(): JSX.Element {
  return (
    <>
      <Header />
      <div className='wrapper'>
        <UploadFile />
        <PatientObservations />
      </div>
    </>
  )
}
