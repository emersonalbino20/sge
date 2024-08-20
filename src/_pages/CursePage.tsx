import Curse from '@/_components/Curse'
import Header from '@/_components/Header'
import * as React from 'react'
export default function CursePage(){
    return( 
    <>
        <Header title="Lista dos Cursos" visible={true}/>
        <Curse/>
    </>)
}