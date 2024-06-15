import * as React from "react"
import imagemLogin from '../assets/_images/imagem_register800y.jpg'
import imagemFundoLogin from '../assets/_images/imagem_fundo_login1500x.jpg'
import { LockClosedIcon } from '@heroicons/react/24/solid'
import { UserIcon } from '@heroicons/react/24/solid'
import { UserPlusIcon } from '@heroicons/react/24/solid'
import { AtSymbolIcon } from '@heroicons/react/24/solid'
import {Link} from 'react-router-dom'


export default function LoginPage(){
    return (
        <div className="w-screen h-screen flex flex-row justify-center items-center bg-slate-500 bg-cover " style={{backgroundImage:`url(${imagemFundoLogin})`, backgroundSize:'120% 110%'}}>
      
       

        <div className="flex flex-col justify-center items-center bg-slate-50 w-3/4h-96  rounded-br-md rounded-bl-md shadow-gray-900 shadow-2xl">
            
            <div className='h-80 w-96 bg-cover bg-no-repeat m-0' style={{backgroundImage:`url(${imagemLogin})`, backgroundSize:'100% 60%'}}>
            <h1 className='pl-3 w-56 text-wrap text-left text-white  text-2xl font-poppins font-bold '>Educação É A Chave Do Sucesso Na Vida!</h1>
        
            </div>

            <div className='relative -top-20'>
            <div className='flex flex-col justify-center items-center'>
                            <UserPlusIcon className="h-7 w-7 text-red-500"/>  
                            <h1 className='uppercase text-blueColorLoginParagraf font-semibold  font-playfair '>Olá!, Registre-se
                    </h1>
                         </div> 
                    

                    <form >
                                          
                        <div className="flex flex-col">
                           

                        <div className='relative flex items-center focus-within:text-gray-600'>
                               
                               <UserIcon className='h-4 w-4 text-gray-500 absolute pointer-events-none ml-2'/>
                              
                               <input className="h-8 pr-2 pl-10 py-2 text-sm" type="text" name="" id="" placeholder='Nome'/>
                           </div>

                            <div className='relative flex items-center focus-within:text-gray-600'>
                               
                                <AtSymbolIcon className='h-4 w-4 text-gray-500 absolute pointer-events-none ml-2'/>
                               
                                <input className="h-8 pr-2 pl-10 py-2 text-sm" type="email" name="" id="" placeholder='Email'/>
                            </div>
                            <div className='relative flex items-center focus-within:text-gray-600'>
                               
                                <LockClosedIcon className='h-4 w-4 text-gray-500 absolute pointer-events-none ml-2'/>
                               
                                <input className="h-8 pr-2 pl-10 py-2 text-sm" type="password" name="" id="" placeholder='Senha'/>
                            </div>
                            <p>{/*Aqui vai aparecer a mensagem de validação dos campos*/}</p>
                            <button className="buttonGreen w-64 rounded-sm font-robotoslab font-normal uppercase">Registrar</button>
                        </div>
                        <div className="mt-2 flex flex-row justify-between font-latofont-light text-font-sem text-blueColorLoginParagraf  cursor-pointer decoration-blueColorLoginParagraf">
                            <p><Link to="/">Fazer Login!</Link></p>
                        </div>
                    </form>
                 </div>
            </div>
        </div>
    );
}