import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import IPPUImage from '../assets /_images/IPPU.png'
import IPPULOGO from '../assets /_images/IPPU.jpg'

export default function HomeBody(){
   
    const navigate = useNavigate()
    const insertStudent = () => {
        navigate('/StudentInsertPage')
    }
    return (
        <div className='flex flex-col justify-center h-screen items-center mt-20 w-screen '>
<section className="bg-gradient-to-r from-blue-700 via-blue-700 to-blue-600 bg-center bg-no-repeat bg-gray-700 bg-blend-multiply w-full h-full">
    <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
        <div className='flex flex-col justify-center items-center w-full'>
        <img src={IPPUImage}  className="h-40 w-40" alt="IPPU Logo" />
        <h1 className="mb-4 text-h1 capitalize font-extrabold tracking-tight leading-none text-white md:text-h2 lg:text-h1">
          Acreditamos no potencial dos nossos alunos
        </h1>
        </div>
        <p className="mb-8 text-lg font-normal text-gray-300 lg:text-font-h2 sm:px-16 lg:px-48">
            Aqui na IPPU focamo-nos em melhorar, ensinar e orientar nossos estudantes, com mais alto escalão de ensino, com nossos profissais vamos longe!
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
          <Link to={'/StudentInsertPAge'}>
            <a href="#" className="inline-flex justify-center items-center py-2 px-3 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                Dar ínicio
                <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </a>
            </Link>
            <a href="#" className="inline-flex justify-center hover:text-gray-900 items-center py-2 px-3 sm:ms-4 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400">
                Saber mais
            </a>  
        </div>
    </div>
</section>
<footer className="bg-gray-900 rounded-none shadow dark:bg-gray-900 w-full">
        <div className="w-full max-w-screen-xl mx-auto p-2 md:py-2">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a href="#" className="flex items-center mb-4 sm:mb-0 space-x-1 rtl:space-x-reverse">
              <img src={IPPUImage} className="h-8" alt="Ulumbo Logo" />
              <span className="self-center text-xl font-semibold whitespace-nowrap text-white">Instituto Politecnico Privado Ulumbo</span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0 text-gray-400">
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">Sobre</a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">Política de Privacidade</a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">Licensa</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Contacto</a>
              </li>
            </ul>
          </div>
          <hr className="my-3 border-gray-700 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024 <a href="https://flowbite.com/" className="hover:underline">IPPU™</a>. Todos Direitos Reservados.
          </span>
        </div>
      </footer>

</div>

  )
}

/*  <div classNameName='flex flex-col justify-center h-full items-center mt-20'>

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

            </div>*/