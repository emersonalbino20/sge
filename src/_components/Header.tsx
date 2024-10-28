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

    
    
    

  
    const [openSubMenu, setOpenSubMenu] = React.useState(null);

    const handleMouseEnter = (menu) => {
      setOpenSubMenu(menu);
    };
  
    const handleMouseLeave = () => {
      setOpenSubMenu(null);
    };
  
    
    return (
        <div className='w-screen z-20 flex flex-col h-44 '>
            <nav className='w-full bg-white  text-white font-semibold flex flex-col space-y-4 items-center p-4  shadow-2xl'>
                <div className='animate-flip-down animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-in flex flex-row space-x-2 items-start w-full'>
                    <img src={IPPUImage} title='Ulumbo LOGO' alt="None" className='w-[70px] '/>
                    <div className="text-5xl font-extrabold ...">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-red-500 font-playfair md:text-3xl lg:text-4xl xl:text-5xl ">
                      IPPU
                    </span>
                  </div>
                </div>
                {/*!openMenu &&
                <span className='text-3xl text-gray-500 font-bold  cursor-pointer' onClick={()=>{setOpenMenu(!openMenu)}}>&#9776;</span>}
                {openMenu &&
                <span className='text-3xl text-gray-500 font-normal  cursor-pointer' onClick={()=>{setOpenMenu(!openMenu)}}>
                &Chi;
                </span>
                */}
                <div className='w-full text-right'>
                  <ul className='w-full flex flex-row-reverse space-x-3 xl:space-x-5   text-orange-500 md:text-md lg:text-lg xl:text-2xl cursor-pointer'>
                  <li className='pl-4 font-semibold text-orange-500'  onClick={Logout}>Sair </li>
                  <Link to="/PaymentPage"><li className='font-semibold text-orange-500'>Finanças </li></Link>
                    
                    <li onClick={()=>{setOpenTurma(!openTurma)
                    setOpenAcade(false)
                    setOpenPessoal(false)
                    }}
                    onMouseEnter={() => {return handleMouseEnter(3)}} 
                    className='font-semibold text-orange-500'><span className='flex space-x-1 line-clamp-2'><p>Gestão de Turma</p> {openSubMenu === 3 ? <ChevronUp className='w-6 h-8'/> : <ChevronDown className='w-6 h-8'/>}</span>
                      {openSubMenu === 3 &&(
                    <ul className='animate-jump-in animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-out show z-20 absolute mt-4 bg-white text-orange-500 md md:text-md lg:text-lg xl:text-xl text-left p-4 rounded-bl-md rounded-br-md w-56' onMouseLeave={handleMouseLeave}>
                        <Link to={'/PeriodPage'}><li className='p-2 hover:font-bold'>Turnos</li></Link>
                        <Link to={'/ClassRoomPage'}><li className='p-2 hover:font-bold'>Salas</li></Link>
                        <Link to={'/GradePage'}><li className='p-2 hover:font-bold'>Classes</li></Link>
                        <Link to="/BulletinPage"><li className='p-2 hover:font-bold'>Registro de Notas</li></Link>
                      </ul>
                      )}
                    </li>
                    <li onClick={()=>{setOpenAcade(!openAcade)
                    setOpenPessoal(false)
                    setOpenTurma(false)
                    }} 
                    onMouseEnter={() => {return handleMouseEnter(2)}}
                    className='font-semibold text-orange-500'>
                      <span className='flex space-x-1 line-clamp-2'><p>Gestão Ácademica</p> {openSubMenu === 2 ? <ChevronUp className='w-6 h-8'/> : <ChevronDown className='w-6 h-8'/>}</span>
                      {openSubMenu === 2 &&(
                    <ul className='animate-jump-in animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-out show z-20 absolute mt-4 bg-white text-orange-500 md md:text-md lg:text-lg xl:text-xl text-left p-4 rounded-bl-md rounded-br-md w-56' onMouseLeave={handleMouseLeave}>
                        <Link to={'/CursePage'}><li className='p-2 hover:font-bold'>Cursos</li></Link>
                        <Link to={'/SubjectPage'}><li className='p-2 hover:font-bold'>Disciplinas</li></Link>
                        <Link to={'/AcademicYearPage'}><li className='p-2 hover:font-bold'>Ano Ácademico</li></Link>
                        <Link to={'/StudentInsertPage'}><li className='p-2 hover:font-bold'>Matrícula</li></Link>
                      </ul>
                      )}
                    </li>
                    <li onClick={()=>{setOpenPessoal(!openPessoal)
                    setOpenAcade(false)
                    setOpenTurma(false)
                    }} className='font-semibold text,-orange-500'
                    onMouseEnter={() => {return handleMouseEnter(1)}} 
                    
                    ><span className='flex space-x-2 line-clamp-2'><p>Pessoal</p> {openSubMenu === 1 ? <ChevronUp className='w-6 h-8'/> : <ChevronDown className='w-6 h-8'/>}</span>
                    {openSubMenu === 1 &&(
                      <ul className='animate-jump-in animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-out z-20 absolute mt-4 text-orange-500 bg-white md md:text-md lg:text-lg xl:text-xl text-left p-4 rounded-bl-md rounded-br-md w-56' onMouseLeave={handleMouseLeave}>
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