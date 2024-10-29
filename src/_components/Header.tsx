import * as React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import IPPUImage from './../assets/images/IPPU.png'
import {Link, useNavigate} from 'react-router-dom'
import { removeCookies } from '@/_cookies/Cookies';

export default function Header({title}){

  const nav = useNavigate();
    const Logout = () =>{
        removeCookies('user')
        nav('/');
    }
   

    const [openPessoal, setOpenPessoal] = React.useState(false);
    const [openAcade, setOpenAcade] = React.useState(false);
    const [openTurma, setOpenTurma] = React.useState(false);

    
    
    

  
    const [openSubMenuI, setOpenSubMenuI] = React.useState(false);
    const [openSubMenuII, setOpenSubMenuII] = React.useState(false);
    const [openSubMenuIII, setOpenSubMenuIII] = React.useState(false);
    
    return (
        <div className='w-screen z-20 flex flex-col h-32 sm:h-28 md:h-28 lg:h-36 xl:h-48 mb-3'>
            <nav className='w-full bg-white  text-white font-semibold flex flex-col space-y-4 items-center p-2 shadow-2xl'>
                <div className='animate-flip-down animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-in flex flex-row space-x-2 items-start w-full sm:h-10 md:h-14 lg:h-14 xl:h-24'>
                    <img src={IPPUImage} title='Ulumbo LOGO' alt="None" className='w-[70px] sm:w-[50px] md:w-[54px] lg:w-[55] xl:w-[60px] '/>
                    <div className="text-5xl font-extrabold ...">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-red-500 font-playfair text-xl sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl ">
                      IPPU
                    </span>
                  </div>
                </div>
                <div className='w-full text-right'>
                  <ul className='w-full flex flex-row-reverse space-x-3    text-orange-500 text-base sm:text-xs md:text-[14px] lg:text-[16px] xl:text-lg cursor-pointer'>
                  <li className='pl-4 font-semibold text-orange-500'  onClick={Logout}>Sair </li>
                  <Link to="/PaymentPage"><li className='font-semibold text-orange-500'>Finanças </li></Link>
                    
                    <li onClick={()=>{setOpenSubMenuIII(!openSubMenuIII)
                    setOpenSubMenuI(false)
                    setOpenSubMenuII(false)
                    }}
                    
                    className='font-semibold text-orange-500'><span className='flex space-x-1 line-clamp-2'><p className='font-semibold text-orange-500'>Gestão de Turma</p> {openSubMenuIII ? <ChevronUp className='w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7'/> : <ChevronDown className='w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7'/>}</span>
                      {openSubMenuIII &&(
                    <ul className='animate-jump-in animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-out show z-20 absolute mt-2 bg-white text-left text-orange-500 text-base sm:text-xs md:text-[14px] lg:text-[16px] xl:text-lg p-2 rounded-bl-md rounded-br-md w-56' 
                    
                    >
                        <Link to={'/PeriodPage'}><li className='p-2 hover:font-bold'>Turnos</li></Link>
                        <Link to={'/ClassRoomPage'}><li className='p-2 hover:font-bold'>Salas</li></Link>
                        <Link to={'/GradePage'}><li className='p-2 hover:font-bold'>Classes</li></Link>
                        <Link to="/BulletinPage"><li className='p-2 hover:font-bold'>Registro de Notas</li></Link>
                      </ul>
                      )}
                    </li>
                    <li onClick={()=>{setOpenSubMenuII(!openSubMenuII)
                    setOpenSubMenuI(false)
                    setOpenSubMenuIII(false)
                    }} 
                   
                    className='font-semibold text-orange-500'>
                      <span className='flex space-x-1 line-clamp-2'><p className='font-semibold text-orange-500'>Gestão Ácademica</p> {openSubMenuII  ? <ChevronUp className='w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7'/> : <ChevronDown className='w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7'/>}</span>
                      {openSubMenuII  &&(
                    <ul className='animate-jump-in animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-out show z-20 absolute mt-2 bg-white text-left text-orange-500 text-base sm:text-xs md:text-[14px] lg:text-[16px] xl:text-lg p-2 rounded-bl-md rounded-br-md w-56' 
                    >
                        <Link to={'/CursePage'}><li className='p-2 hover:font-bold'>Cursos</li></Link>
                        <Link to={'/SubjectPage'}><li className='p-2 hover:font-bold'>Disciplinas</li></Link>
                        <Link to={'/AcademicYearPage'}><li className='p-2 hover:font-bold'>Ano Ácademico</li></Link>
                        <Link to={'/StudentInsertPage'}><li className='p-2 hover:font-bold'>Matrícula</li></Link>
                      </ul>
                      )}
                    </li>
                    <li onClick={()=>{setOpenSubMenuI(!openSubMenuI)
                    setOpenSubMenuII(false)
                    setOpenSubMenuIII(false)
                    }} className='font-semibold text,-orange-500'
                                   
                    ><span className='flex space-x-2 sm:space-x-0 md:space-x-1 lg:space-x-1 line-clamp-2'><p className='font-semibold text-orange-500'>Pessoal</p> {openSubMenuI ? <ChevronUp className='w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7'/> : <ChevronDown className='w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7'/>}</span>
                    {openSubMenuI &&(
                      <ul className='animate-jump-in animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-out z-20 absolute mt-2 text-left text-orange-500 bg-white text-base sm:text-xs md:text-[14px] lg:text-[16px] xl:text-lg p-2 rounded-bl-md rounded-br-md w-56' >
                        <Link to={'/StudentListPage'}><li className='p-2 hover:font-bold'>Estudantes</li></Link>
                        <Link to={'/TeacherPage'}><li className='p-2 hover:font-bold'>Professores</li></Link>
                        <Link to={'/ParentsPage'}><li className='p-2 hover:font-bold'>Criar Parentescos</li></Link>
                      </ul>)
                      }
                    </li>
                    <Link to={'/Home'}><li className='font-semibold text-orange-500'>Home</li></Link>
                  </ul>
                </div>
                
            </nav>
            {(title && false) && 
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
        );
}