import * as React from 'react'
import Teacher from "@/_components/PersonIncharge";
import Header from '@/_components/Header';

export default function PersonIncharge(){
    return(
        <>
        <Header title="Listar os Encarregados" visible={true}/>
        <Teacher/>
        </>
    )
}