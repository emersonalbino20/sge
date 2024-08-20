import * as React from 'react'
import Teacher from "@/_components/Teacher";
import Header from '@/_components/Header';

export default function TeacherPage(){
    return(
        <>
        <Header title="Lista dos Professores" visible={true}/>
        <Teacher/>
        </>
    )
}