import Parents from '@/_components/Parents'
import Header from '@/_components/Header'
import * as React from 'react'
export default function ParentsPage(){
    return( 
    <>
        <Header title="Lista dos Parentescos" visible={true}/>
        <Parents/>
    </>)
}