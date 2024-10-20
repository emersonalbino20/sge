import * as React from 'react';
import { ArrowDown, ArrowRight, Clock, HomeIcon } from 'lucide-react';
import IPPUImage from '../assets /_images/IPPU.png'
import {Link, useNavigate} from 'react-router-dom'
import { getCookies, removeCookies } from '@/_cookies/Cookies';
import { Navigate } from "react-router-dom";

export default function Header({title}){

  const nav = useNavigate();
    const Logout = () =>{
        removeCookies('user')
        nav('/');
    }
    const listMarked = "relative flex flex-flex items-center  cursor-pointer pr-3 pl-3  bg-[#1c64f2] hover:bg-[#2e6fee] p-2 rounded-md font-semibold capitalize text-base md:text-lg text-xl hover:underline ";
    const list = "bg-transparent p-2 rounded-md font-medium cursor-pointer hover:bg-[#293a52] text-base md:text-lg text-xl";
    const subList = "bg-transparent p-2 rounded-md font-medium cursor-pointer hover:bg-[#424e5f] text-base md:text-lg text-xl";
    const dropdown = "bg-transparent p-2 rounded-md font-medium flex flex-row justify-between pr-2 cursor-pointer hover:bg-[#293a52] text-base md:text-lg text-xl";

    const [openPessoal, setOpenPessoal] = React.useState(false);
    const [openAcade, setOpenAcade] = React.useState(false);
    const [openTurma, setOpenTurma] = React.useState(false);
    const [openMenu, setOpenMenu] = React.useState(false);

    const [time, setTime] = React.useState(new Date())
    
    React.useEffect(() =>{

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
      /*if (hours < 12) {
        turno = ' da manhã'
      }else if(hours < 18){
        turno = ' da tarde'
      }else{
        turno = 'da noite'
      }*/
      return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)} ${turno}`
    }

    function padZero(number) {
      return (number < 10 ? '0' : '') + number
    }
    
    return (
        <>
        <div className='absolute top-0 w-screen z-20 flex flex-col'>
            <nav className='w-full  h-20 bg-gray-200   text-white font-semibold flex justify-between items-center p-4  shadow-2xl'>
                <div className='flex flex-row space-x-2 items-center'>
                    <img src={IPPUImage} title='Ulumbo LOGO' alt="None" className='w-[70px] '/>
                    <div className="text-5xl font-extrabold ...">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-red-500 font-playfair">
                      IPPU
                    </span>
                  </div>
                </div>
                {!openMenu &&
                <span className='text-3xl text-gray-500 font-bold  cursor-pointer' onClick={()=>{setOpenMenu(!openMenu)}}>&#9776;</span>}
                {openMenu &&
                <span className='text-3xl text-gray-500 font-normal  cursor-pointer' onClick={()=>{setOpenMenu(!openMenu)}}>
                &Chi;
                </span>
                }
            </nav>
            {openMenu &&
            <div className='bg-slate-900 w-[70%] rounded-br-md p-4 '>
            <ul className='w-full text-border text-lg'>
                    <Link to={'/Home'}><li className={listMarked}> <HomeIcon className='w-7 h-6 font mr-2'/> HOME</li></Link>
                    <li className={dropdown} onClick={()=>{setOpenPessoal(!openPessoal)
                    setOpenAcade(false)
                    setOpenTurma(false)
                    }}>Pessoal {openPessoal && <ArrowDown/>}{!openPessoal && <ArrowRight/>}</li>
                    {openPessoal &&
                    <ul className='indent-4 bg-[#2f3742] rounded-md bg-opacity-30'>
                        <Link to={'/StudentListPage'}><li className={subList}>Estudantes</li></Link>
                        <Link to={'/TeacherPage'}><li className={subList}>Professores</li></Link>
                        <Link to={'/ParentsPage'}>
                        <li className={subList}>Criar Parentescos</li></Link>
                    </ul>
                    }
                    <li className={dropdown} onClick={()=>{setOpenAcade(!openAcade)
                    setOpenPessoal(false)
                    setOpenTurma(false)
                    }}>Gestão Académica {openAcade && <ArrowDown/>}{!openAcade && <ArrowRight/>}</li>
                    {openAcade &&
                    <ul className='indent-4 bg-[#2f3742] bg-opacity-30 rounded-md'>
                        <Link to={'/CursePage'}><li className={subList}>Cursos</li></Link>
                        <Link to={'/SubjectPage'}><li className={subList}>Disciplinas</li></Link>
                        <Link to={'/AcademicYearPage'}><li className={subList}>Ano Académico</li></Link>
                        <Link to={'/StudentInsertPage'}><li className={subList}>Fazer Matrícula</li></Link>
                    </ul>
                    }
                    <li className={dropdown} onClick={()=>{setOpenTurma(!openTurma)
                    setOpenAcade(false)
                    setOpenPessoal(false)
                    }}>Gestão Turma {openTurma && <ArrowDown/>}{!openTurma && <ArrowRight/>}</li>
                    {openTurma &&
                    <ul className='indent-4 bg-[#2f3742] rounded-md bg-opacity-30'>
                        <Link to={'/PeriodPage'}><li className={subList}>Turnos</li></Link>
                        <Link to={'/ClassRoomPage'}><li className={subList}>Salas</li></Link>
                        <Link to={'/GradePage'}><li className={subList}>Classes</li></Link>
                    </ul>
                    }
                    <Link to="/BulletinPage"><li className={list}>Boletim de Notas</li></Link>
                    <Link to="/PaymentPage"><li className={list}>Finanças</li></Link>
                    <li className={list}>Relatórios Financeiros</li>
                    <button className='border-red-500 bg-red-500 text-white mt-2' onClick={Logout}>Sair</button>
                </ul>
                <div className='w-full flex justify-end items-center'>
                    <Clock className='text-red-700 text-xl'/>
                    <p className='text-red-700 text-xl text-right'>: {formatDate()}</p>
                </div>
            </div>
            }
            {title && !openMenu && 
            <div className='w-full flex justify-center'>
            <div className='w-[90%] bg-slate-700 md:bg-gray-300 rounded-b-lg h-10
            md:pt-4 lg:pt-4 md:h-14 lg:h-14'>
                <h1 className=' font-poppins text-xl
                md:text-h1
                lg:text-h1
                text-center font-bold text-white md:text-slate-700'>
                {title}
                </h1>
            </div>
        </div>}
        </div>
        
        </>
        );
}