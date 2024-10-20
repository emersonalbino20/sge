import * as React from 'react'
import Teacher from "@/_components/Teacher";
import Header from '@/_components/Header';
import Footer from '@/_components/Footer';

export default function TeacherPage(){
    return(
        <>
        <Header  title="Lista dos Professores"/>
        <Teacher />
        </>
    )
}