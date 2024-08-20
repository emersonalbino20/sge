import Period from '@/_components/Period'
import Header from '@/_components/Header'
import * as React from 'react'
export default function PeriodPage(){
    return( 
    <>
        <Header title="Lista dos Turnos" visible={true}/>
        <Period/>
    </>)
}