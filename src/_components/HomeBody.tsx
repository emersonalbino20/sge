import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import * as React from 'react'
export default function HomeBody(){
    return (<div className='flex justify-center h-full items-center '>
       
    <Card className=' bg-gradient-to-b from-slate-500 via-slate-600 to-slate-800 text-white h-64 w-full max-w-2xl border-slate-500 border '>
        <CardHeader>
            <CardTitle>Sistema de Gestão Escolar</CardTitle>
            <CardDescription>servicos a todos momentos</CardDescription>
        </CardHeader>
        <CardContent className='border-t-2 border-gray-400 p-6'><p className='text-center font-bold font-poppins text-wrap'>Seja Livre Pra Fazer O Que Desejar, Liberdade e Espontaneadade</p>
        <p className='text-center text-sm font-lato'>matrícula de estudantes, gerar relatórios, pagamentos...</p>
        </CardContent>
        <CardFooter className='flex items-center justify-center'><button className='active:ring-1 active:ring-blue-300 text-white bg-blue-500 font-bold'>começar</button></CardFooter>
    </Card>
            </div>)
}