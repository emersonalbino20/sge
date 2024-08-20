import Grade from '@/_components/Grade'
import Header from '@/_components/Header'
import * as React from 'react'
export default function AcademicYearPage(){
    return( 
    <>
        <Header title="Lista das Classe" visible={true}/>
        <Grade/>
    </>)
}