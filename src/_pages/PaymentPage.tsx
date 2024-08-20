import * as React from 'react'
import Payment from "@/_components/Payment";
import Header from '@/_components/Header';

export default function PaymentPage(){
    return(
        <>
        <Header title="Gestão Financeira" visible={true}/>
        <Payment/>
        </>
    )
}