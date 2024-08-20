import * as React from 'react'
import IPPUImage from '../assets /_images/IPPU.jpg'
import { useState, useEffect } from 'react';
import { HomeIcon as Home } from 'lucide-react';
import {UsersIcon as Alunos} from '@heroicons/react/24/outline'
import { Eye, LayoutDashboard } from 'lucide-react';
import { EuroIcon as Pagamentos } from 'lucide-react';
import { UserCheck as Professor } from 'lucide-react';
import { LucideLibrary as Classe } from 'lucide-react';
import { GraduationCap as Cursos } from 'lucide-react';
import {FolderOpenIcon as Relatorios} from '@heroicons/react/24/outline';
import {Link, useNavigate} from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

export default function Header(props){
    const lista = ['Home', 'Estudante', 'Pagamento','Professores','Curso','Classe','Relatórios Financeiro'];
    const [visivel, setVisivel] = useState(false)

    const handleVisivel = () => {setVisivel(!visivel)}

    
    const horario = (date: Date)=>{return new 
    Intl.DateTimeFormat("pt-pt",{
        dateStyle:"medium"
    }).format(date)}
    
    const periodo = (date: Date)=>{return new 
        Intl.DateTimeFormat("pt-pt",{
            dayPeriod:"long"
        }).format(date)}
        
   

    const [time, setTime] = useState(new Date())
    
    useEffect(() =>{

      const intervalId = setInterval(()=>{
        setTime(new Date())
      },1000);

      return ()=>{
        clearInterval(intervalId)
      }

    }, [])

    function formatDate() {
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      let turno = ''
      if (hours < 12) {
        turno = ' da manhã'
      }else if(hours < 18){
        turno = ' da tarde'
      }else{
        turno = 'da noite'
      }
      return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)} ${turno}`
    }

    function padZero(number) {
     
      return (number < 10 ? '0' : '') + number
      
    }
    return( 
        
    <div className='absolute top-0 w-full'>
        
        <div className='flex flex-row space-x-3 py-4 pr-3 items-end justify-end  bg-gradient-to-r from-slate-800 via-slate-400 to-white font-playfair' style={{backgroundImage: ''}}>
        
            <p>Bem-Vindo Hora:{formatDate()}</ p>
            <img src={IPPUImage} title='Instituto Politécnico Privado Ulumbo' alt="None" className='w-[50px] '/>
            
        </div>
        <div className='sticky top-0 flex py-5 bg-slate-800 items-center justify-center'>
            <ul className='flex flex-row space-x-5 text-white shadow-2xl mr-10'>
            <Link to={'/'}><li className='relative flex flex-col items-center justify-center  cursor-pointer pr-3 pl-3'> <span>   
                             <Home className='w-5 h-5 '/>
                </span>
                Home</li></Link>
            <li className='relative flex flex-col items-center justify-center  cursor-pointer pr-3 pl-3' onClick={handleVisivel}> <span>   
                 <Alunos className='h-5 w-5'/>
            </span>
                        Estudantes
            {visivel &&
                <ul className="absolute flex-col bg-slate-800 cursor-pointer z-50 top-[52px]">
                    <Link to={'/StudentInsertPage'}><li  className=" px-4 py-2 hover:bg-slate-400">Matricular</li></Link>
                    <Link to={'/StudentListPage'}><li  className=" px-4 py-2 hover:bg-slate-400">Estudantes</li></Link>
                    <Link to={'/PersonInchargePage'}><li  className=" px-4 py-2 hover:bg-slate-400">Encarregado</li></Link>
                </ul>
                }
            </li>
            <Link to="/PaymentPage">
            <li className='relative flex flex-col items-center justify-center  cursor-pointer pr-3 pl-3'>
                <span>
                    <Pagamentos className='w-6 h-5'/>
                </span>
                Pagamentos</li>
              </Link>
            <Link to="/TeacherPage"><li className='relative flex flex-col items-center justify-center  cursor-pointer pr-3 pl-3'>
                <span>
                    <Professor className="w-5 h-5"/>
                </span>
                Professores</li>
                </Link>
            <Link to="/CursePage"><li className='relative flex flex-col items-center justify-center  cursor-pointer pr-3 pl-3'><span>
                <Cursos className='w-5 h-5'/>
            </span>
                Cursos</li></Link>
                <Link to="/SubjectPage"><li className='relative flex flex-col items-center justify-center  cursor-pointer pr-3 pl-3'> 
            <span>
                <Classe className='w-5 h-5'/>
                </span>Disciplinas</li></Link>
            <li className='relative flex flex-col items-center justify-center  cursor-pointer pr-3 pl-3'><span>
                <Relatorios className='w-5 h-5'/>
            </span>
                Relatórios Financeiro</li>
            </ul>
            <Sheet>
      <SheetTrigger asChild>
      <div className='relative flex justify-center items-center'>
           <span className=' absolute text-white font-extrabold cursor-pointer'>&#9776;</span>
        <Button className='px-5 h-8 text-white font-semibold rounded-md'></Button>
        </div>
      </SheetTrigger>
      <SheetContent className='bg-slate-700 w-full'>
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription>
           
          </SheetDescription>
        </SheetHeader>
        <ul className='flex flex-col space-y-3 w-full text-white'>
        <Link to={'/AcademicYearPage'}><li>ANO ACADÉMICO</li></Link>
        <Link to={'/GradePage'}><li>CLASSES</li></Link>
        <Link to={'/PeriodPage'}><li>TURNOS</li></Link>
        <Link to={'/ClassRoomPage'}><li>SALAS</li></Link>
        <Link to={'/ClassPage'}><li>TURMAS</li></Link>
        </ul>
        <SheetFooter>
          <SheetClose asChild>
           
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
        </div>
        
        <div className='w-full px-4'>
    {    props.visible &&(
        <div className='flex flex-col justify-center  bg-slate-700 md:bg-gray-300 rounded-md h-16 '>
         <h1 className='font-poppins text-h1 text-center font-bold text-white md:text-slate-700'>{props.title}</h1>
    </div>)
    }</div>
    </div>); 
}

Header.defaultProps = {
  visible: false,
}
