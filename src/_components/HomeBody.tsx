import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import IPPUImage from '../assets /_images/IPPU.png'

export default function HomeBody(){
   
    const navigate = useNavigate()
    const insertStudent = () => {
        navigate('/StudentInsertPage')
    }
    return (
    <div className='flex flex-col justify-center h-full items-center mt-20'>
      <img src={IPPUImage} alt="None" className='w-[140px]'/>
    <Card className='bg-gradient-to-b from-slate-500 via-slate-600 to-slate-800 text-white h-60 max-w-2xl border-slate-500 border '>
        <CardHeader>
            <CardTitle>Sistema de Gestão Escolar</CardTitle>
            <CardDescription>serviços a todos momentos</CardDescription>
        </CardHeader>
        <CardContent className='border-t-2 border-gray-400 p-6'><p className='text-center text-sm font-bold font-poppins text-wrap'>Seja Livre Pra Fazer O Que Desejar, Liberdade e Espontaneadade</p>
        <p className='text-center text-sm font-lato font-thin'>matrícula de estudantes, geração de relatórios, pagamentos...</p>
        </CardContent>
        <CardFooter className='flex items-center justify-center '><button className='py-1  text-white bg-blue-500 font-bold' onClick={()=>{insertStudent()}}>começar</button></CardFooter>
    </Card>
            </div>)
}