import * as React from 'react'
import IPPUImage from '../assets /_images/IPPU.png'
import { useState, useEffect } from 'react';
import { HomeIcon as Home } from 'lucide-react';
import {UsersIcon as Alunos} from '@heroicons/react/24/outline'
import { Eye, LayoutDashboard } from 'lucide-react';
import { CreditCard as Pagamentos } from 'lucide-react';
import { UserCheck as Professor } from 'lucide-react';
import { LucideLibrary as Turma } from 'lucide-react';
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
    const [visivel, setVisivel] = useState(false)
    const [visivelSub, setVisivelSub] = useState(false)
    const [vGaca, setVGaca] = useState(false);
    const [vGTurma, setVGTurma] = useState(false);
    
    const handleVisivel = () => {setVisivel(!visivel)}
    const handleVisivelSub = () => {setVisivelSub(!visivelSub)}
    const handleVGaca = () => {setVGaca(!vGaca)}
    const handleVTurma= () => {setVGTurma(!vGTurma)}
    
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
                    <Link to={'/StudentInsertPage'}><li  className="px-4 py-2 hover:bg-slate-400">Matricular</li></Link>
                    <Link to={'/StudentListPage'}><li  className=" px-4 py-2 hover:bg-slate-400">Estudantes
                    </li>
                    </Link>
                    <Link to={'/PersonInchargePage'}><li  className=" px-4 py-2 hover:bg-slate-400" onMouseEnter={handleVisivelSub}>Encarregado
                    {visivelSub && <ul className="absolute flex-col bg-slate-800 cursor-pointer top-[80px] left-[132px] h-10 items-center text-center">
                    <Link to={'/ParentsPage'}><li  className=" px-4 py-2 hover:bg-slate-400">Parentescos</li></Link>
                      </ul>
                      }
                    </li>
                    </Link>
                </ul>
                }
            </li>
            <li className='relative flex flex-col items-center justify-center  cursor-pointer pr-3 pl-3' onClick={handleVGaca}>
            <span>   
                 <Cursos className='h-5 w-5'/>
            </span>
                  Gestão Acadêmica
                  {vGaca &&
                    <ul className="absolute flex-col bg-slate-800 cursor-pointer z-50 top-[52px] w-36">
                        <Link to="/CursePage">
                          <li className='className="px-4 py-2 hover:bg-slate-400 pl-2'>
                          Cursos</li>
                        </Link>
                        <Link to="/SubjectPage">
                          <li className='className="px-4 py-2 hover:bg-slate-400 pl-2'> 
                         Disciplinas
                          </li>
                        </Link>
                        <Link to="/AcademicYearPage">
                          <li className='className="px-4 py-2 hover:bg-slate-400 pl-2'> 
                         Ano Académico
                          </li>
                        </Link>
                    </ul>
                  }
            </li>
            <li className='relative flex flex-col items-center justify-center  cursor-pointer pr-3 pl-3' onClick={handleVTurma}>
            <span>   
                 <Turma className='h-5 w-5'/>
            </span>
                  Gestão de Turmas
                  {vGTurma &&
                    <ul className="absolute flex-col bg-slate-800 cursor-pointer z-50 top-[52px] w-28">
                        <Link to="/GradePage">
                          <li className='className="px-4 py-2 hover:bg-slate-400 pl-2'>
                          Classe</li>
                        </Link>
                        <Link to="/PeriodPage">
                          <li className='className="px-4 py-2 hover:bg-slate-400 pl-2'> 
                          Turno
                          </li>
                        </Link>
                        <Link to="/ClassRoomPage">
                          <li className='className="px-4 py-2 hover:bg-slate-400 pl-2'> 
                          Sala
                          </li>
                        </Link>
                        <Link to="/ClassPage">
                          <li className='className="px-4 py-2 hover:bg-slate-400 pl-2'> 
                          Turma
                          </li>
                        </Link>
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
            
                
            <li className='relative flex flex-col items-center justify-center  cursor-pointer pr-3 pl-3'><span>
                <Relatorios className='w-5 h-5'/>
            </span>
                Relatórios Financeiro</li>
            </ul>
            
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
/*<Sheet>
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
           AQUI TERÁ UM POSSIVEL BOTAO DE LOGOUT
          </SheetDescription>
        </SheetHeader>
       
        <SheetFooter>
          <SheetClose asChild>
           
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
*/