import * as React from 'react';
import { ArrowDown, ArrowRight, Clock, HomeIcon } from 'lucide-react';
import IPPUImage from '../assets /_images/IPPU.png'
import {Link} from 'react-router-dom'

export default function cabecalho(){
    const listMarked = "relative flex flex-flex items-center  cursor-pointer pr-3 pl-3  bg-[#1c64f2] hover:bg-[#2e6fee] p-2 rounded-md font-semibold capitalize text-[20px] hover:underline ";
    const list = "bg-transparent p-2 rounded-md font-medium cursor-pointer hover:bg-[#293a52]";
    const subList = "bg-transparent p-2 rounded-md font-medium cursor-pointer hover:bg-[#424e5f]";
    const dropdown = "bg-transparent p-2 rounded-md font-medium flex flex-row justify-between pr-2 cursor-pointer hover:bg-[#293a52]";

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
        <div className='absolute top-0 w-full'>
            <nav className='w-full h-20 bg-[#1f2937] text-white font-semibold flex justify-between items-center p-4 '>
                <div className='flex flex-row space-x-2 items-center'>
                    <img src={IPPUImage} title='Ulumbo LOGO' alt="None" className='w-[70px] '/>
                    <h1 className='text-h1'>SGE</h1>
                </div>
                {!openMenu &&
                <span className='text-3xl text-white font-bold  cursor-pointer' onClick={()=>{setOpenMenu(!openMenu)}}>&#9776;</span>}
                {openMenu &&
                <span className='text-3xl text-white font-normal  cursor-pointer' onClick={()=>{setOpenMenu(!openMenu)}}>
                &Chi;
                </span>
                }
            </nav>
            {openMenu &&
            <div className='bg-[#1f2937] w-[70%] rounded-br-md p-4'>
            <ul className='w-full text-border text-lg'>
                    <Link to={'/Home'}><li className={listMarked}> <HomeIcon className='w-7 h-6 font mr-2'/> HOME</li></Link>
                    <li className={dropdown} onClick={()=>{setOpenPessoal(!openPessoal)
                    setOpenAcade(false)
                    setOpenTurma(false)
                    }}>Pessoal {openPessoal && <ArrowDown/>}{!openPessoal && <ArrowRight/>}</li>
                    {openPessoal &&
                    <ul className='indent-4 bg-[#2f3742] rounded-md bg-opacity-30'>
                        <Link to={'/StudentListPage'}><li className={subList}>Estudantes</li></Link>
                        <Link to={'/PersonInchargePage'}><li className={subList}>Educadores</li></Link>
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
                        <Link to={'/GradePage'}><li className={subList}>Classes</li></Link>
                        <Link to={'/PeriodPage'}><li className={subList}>Turnos</li></Link>
                        <Link to={'/ClassRoomPage'}><li className={subList}>Salas</li></Link>
                        <Link to={'/ClassPage'}><li className={subList}>Turmas</li></Link>
                    </ul>
                    }
                    <Link to="/PaymentPage"><li className={list}>Finanças</li></Link>
                    <li className={list}>Relatórios Financeiros</li>
                </ul>
                <div className='w-full flex justify-end items-center'>
                    <Clock className='text-red-700 text-xl'/>
                    <p className='text-red-700 text-xl text-right'>: {formatDate()}</p>
                </div>
            </div>
            }
        </div>
        </>
        );
}