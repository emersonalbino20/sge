import Academic from '@/_components/AcademicYear'
import Header from '@/_components/Header'
import * as React from 'react'
export default function AcademicYearPage(){
    return( 
    <>
        <Header title="Lista dos Anos Académicos" visible={true}/>
        <Academic/>
    </>)
}