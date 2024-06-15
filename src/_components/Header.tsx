import * as React from "react"
import {MagnifyingGlassIcon as Lupa} from '@heroicons/react/24/solid'
import {HomeIcon as Home} from '@heroicons/react/24/solid'
import {CurrencyDollarIcon as Euro} from '@heroicons/react/24/solid'
import {UsersIcon as Alunos} from '@heroicons/react/24/solid'
import {FolderOpenIcon as Servicos} from '@heroicons/react/24/solid'
import {ArrowDownCircleIcon as Arrow} from '@heroicons/react/24/solid'
import {UserCircleIcon as UserCircle} from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'
import NavigationBar from "./NavigationBar"




export default function Header(){
    const navigate = useNavigate()
    const sair = () =>{
            navigate('/')
    }
    const tempo = new Date()
    return(
        <>
            <div className="flex flex-row items-end justify-end space-x-3 pr-3 pt-2 bg-white p-8 font-medium">
                <p className='flex flex-row space-x-3'>
                    <span>Seja Bem - Vindo Sr. Secretário</span> &nbsp;&nbsp; | 
                    <span>Hora: {tempo.getHours()}h : {tempo.getMinutes()}m</span>
                </p>
               <button className="buttonRed" onClick={sair}>Sair</button>
            </div>
            <div className="top-0 sticky flex items-end justify-end pt-5  pr-12 shadow-2xl bg-cinzaColor">
                <ul className="flex flex-row space-x-8  cursor-pointer text-white items-baseline font-merriweather text-md group">
                    <li className='flex flex-col items-center justify-center h-4'>
                        <span>   
                             <Lupa className='h-6 w-6'/>
                        </span>
                        <span>
                            Pesquisar
                        </span>
                    </li>
                    <li className='flex flex-col items-center justify-center pr-3 pl-3 border-b-4 border-greenAcesaColor pb-2'>
                        <span>   
                             <Home className='h-6 w-6'/>
                        </span>
                        <span>
                            Home
                        </span>
                    </li>
                    <li className='flex flex-col items-center justify-center h-4 pb-2'>
                        <span>   
                             <Euro className='h-6 w-6'/>
                        </span>
                        <span>
                            Pagamentos
                        </span>
                    </li>
                    <li className='flex flex-col items-center justify-center pb-2'>
                        <span>   
                             <Alunos className='h-6 w-6'/>
                        </span>
                        <span>
                            Alunos
                        </span>
                    </li>
                    <li className='menuServicos flex flex-col items-center justify-center  pb-2'>
                        <span>   
                             <Servicos className='h-6 w-6'/>
                        </span>
                        <span>
                            Serviços
                        </span>
                        <ul className="dropdownServicos absolute top-20  flex-col bg-gray-700">
                            <li className=" px-4 py-2 hover:bg-slate-400">
                                <a href="#" >Classes</a>
                            </li>
                            <li className="px-4 py-2 hover:bg-slate-400"><a href="#" >Turma</a></li>
                        </ul>
                        
                    </li>
                    <li className='menuPerfil flex flex-col items-center justify-center  pb-2'>
                    <span><UserCircle className='h-6 w-6'/></span>
                    <span  className='flex flex-row'>
                    <span >Eu</span>
                        <span><Arrow className='h-5 w-5 mt-2'/></span>
                    
                    </span>
                        <ul className="dropdownPerfil absolute top-20  flex-col bg-gray-700">
                            <li className=" px-4 py-2 hover:bg-slate-400">
                                <a href="#" >Detalhe</a>
                            </li>
                            <li className="px-4 py-2 hover:bg-slate-400"><a href="#" >Sair</a></li>
                        </ul>
                    </li>
                </ul>
             
            </div>
        </>
    );

}