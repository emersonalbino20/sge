import * as React from "react"
import Style from './Style'
import imagemLogin from '../assets/_images/imagem_register650x.jpg'
import imagemFundoLogin from '../assets/_images/imagem_fundo_login1500x.jpg'
import { LockClosedIcon } from '@heroicons/react/24/solid'
import { UserIcon } from '@heroicons/react/24/solid'
import { Link, useNavigate } from 'react-router-dom'
import {z} from 'zod';
import { useForm } from "react-hook-form"
import { zodResolver} from '@hookform/resolvers/zod'


const usernameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/
const capitalizeWords = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

const schema = z.object({
    nome: z.string().nonempty("Nome de usuário é obrigatório").regex(usernameRegex,'O campo só pode conter letrar e espaços').min(8,'O nome do usuário deve conter pelo menos 8 letras').transform(capitalizeWords),
    senha: z.coerce.string().nonempty("Senha de usuário é obrigatória").min(8,'A senha precisa conter pelo menos 8 letras'),
})
//Criando tipagem com TypeScript
type FormProps =  z.infer<typeof schema>;

export default function LoginPage(){

    const {register, handleSubmit, formState: {errors} = useForm<FormProps>} = useForm({mode: 'all', 
    resolver: zodResolver(schema)})

    const navigate = useNavigate()
    const handleForm = (data: FormProps) => {
        navigate('/HomePage')
    }
    
    return (
        
        <div className="w-screen h-screen flex flex-row justify-center items-center bg-slate-500 bg-cover " style={{backgroundImage:`url(${imagemFundoLogin})`, backgroundSize:'120% 110%'}}>
      
       

        <div className="flex flex-row justify-center items-center bg-slate-50 w-4/6 h-80  rounded-tr-2xl  shadow-gray-900 shadow-2xl ">
            
            <div className='h-80 w-full bg-left bg-cover bg-no-repeat' style={{backgroundImage:`url(${imagemLogin})`, backgroundSize:'90% 108%'}}>
            <h1 className='ml-4 w-56 text-wrap text-left text-white  text-2xl font-poppins font-bold '>Educação É A Chave Do Sucesso Na Vida!</h1>
        
            </div>

            <div className=' w-96 flex items-center flex-col justify-center md:mr-10'>

                    <h1 className='uppercase text-blueColorLoginParagraf font-semibold mb-5 font-playfair '>Faça O Seu Login No Sistema
                    </h1>

                    <form onSubmit={handleSubmit(handleForm)}>
                        <div className='flex justify-center '>
                            <LockClosedIcon className="h-7 w-7 text-red-500"/>  
                         </div>                   
                        <div className="flex flex-col text-left">
                            <div className='relative flex items-center focus-within:text-gray-600'>
                               
                                <UserIcon className='h-4 w-4 text-gray-500 absolute pointer-events-none ml-2'/>
                               
                                <input className="h-8 pr-2 pl-10 py-2 text-sm" type="text" {...register('nome')} placeholder='Nome'/>
                                
                            </div>
                            {errors.nome?.message && (
                                    <p className="text-xs  text-red-600">{errors.nome.message}</p>
                                )}
                            

                            <div className='relative flex items-center focus-within:text-gray-600'>
                               
                                <LockClosedIcon className='h-4 w-4 text-gray-500 absolute pointer-events-none ml-2'/>
                               
                                <input className="h-8 pr-2 pl-10 py-2 text-sm" type="password" {...register('senha')} placeholder='Senha'/>
                               
                            </div>
                            {errors.senha?.message && (
                                    <p className="text-xs  text-red-600">{errors.senha.message}</p>
                                )}
                            <button type='submit' className="buttonGreen w-64 rounded-sm font-robotoslab font-normal uppercase" >Entrar</button>
                        </div>
                        <div className="mt-2 flex flex-row justify-between font-lato font-light text-font-sem text-blueColorLoginParagraf cursor-pointer decoration-blueColorLoginParagraf">
                            <p>Esqueceu Palavra-Passe?</p>
                            <p><Link to="/RegisterPage">Registrar-se?</Link></p>
                        </div>
                        
                    </form>
                 </div>
            </div>
        </div>
    );
}