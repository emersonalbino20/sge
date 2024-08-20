import Class from '@/_components/Class'
import Header from '@/_components/Header'
import * as React from 'react'
export default function ClassPage(){
    return( 
    <>
        <Header title="Lista das Turmas" visible={true}/>
        <Class/>
    </>)
}