import * as React from 'react'
import Teacher from "@/_components/PersonIncharge";
import Header from '@/_components/Header';
import { getCookies } from '@/_cookies/Cookies';
export default function PersonIncharge(){
    return(
        <>
            {!getCookies('idAluno') ? <Header title={false}/>: <Header title="Listar os Encarregados" />}
            <Teacher/>
        </>
    )
}