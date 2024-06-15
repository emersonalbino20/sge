import * as React from "react"
import imagemLogin from '../assets/_images/fundo-estudante.jpg'

import { MapPinIcon as LocalIcon, AtSymbolIcon, PhoneIcon} from '@heroicons/react/24/outline'
import { CalendarIcon } from '@heroicons/react/24/outline'
import {schema, FormProps} from '../_validate/Forms'
import {Button, Icon} from './Forms'
import {useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"


export default function StudentForm(){

    const [close, setClose] = React.useState(false)
  
    const {register, handleSubmit,
        formState: {errors} } = useForm<FormProps>({
        mode: 'all', 
        resolver: zodResolver(schema)
       })

       const handle = (data: FormProps)=>{ 
        const dados = [
            {
            firstname: data.firstname,
            lastname: data.lastname,
            address: data.address,
            phone: data.phone,
            email: data.email,
            }
        ]
        console.log(JSON.stringify(dados))
    }
   

    return (
        <div className=" flex flex-col justify-center  items-center bg-form text-white space-y-20 ">
            <div className="h-40 top-0 w-full bg-center bg-no-repeat sticky" style={{backgroundImage: `url(${imagemLogin})`, backgroundSize:'110% 100%'}}></div>
            
            <div className="w-5/6 ">
            <h1 className="text-h1 -mt-5 ">Formulário de Matrícula</h1>
            <form onSubmit={handleSubmit(handle)}>
                <div className="text-left">
                    <label htmlFor="bi">Enviar o BI em PDF</label>
                    <input className="h-28 w-full rounded-form outline border-3 border-form bg-input shadow-none mb-6" type="file" id="bi" />
                </div>
                <div className="text-left">
                    <label>Nome Completo do Aluno</label>
                    <div className="flex flex-row space-x-2">
                        <input className="input-form-text" type = "text" id="firstname" {...register('firstname')} />
                        
                        <input className="py-6 w-full rounded-form outline border-3 border-form bg-input shadow-none mb-6 pl-10" type = "text"  id="lastname" placeholder="Sobrenome" {...register('lastname')} />
                       
                    </div>
                    <div className="flex flex-row -mt-4 mb-3 justify-between">
                        {errors.firstname && (
                                    <p className="text-xs text-red-600">Nome: {errors.firstname.message}</p>
                                )}
                        {errors.lastname && (
                                    <p className="text-xs text-red-600">Sobrenome:  {errors.lastname.message}</p>
                                )}
                        </div>

                </div>

                <div className="text-left">
                    <label htmlFor="endereco">Data de Nascimento</label>
                    <div className="relative flex items-center">
                        <Icon icon={CalendarIcon}/>
                        <input className="input-form-text" type = "date"  onChange={()=>setClose(true)}/>
                    </div>
                    
                </div>
              {
                close  && (

                <div className="text-left">
                    <label htmlFor="endereco">Endereço do Aluno</label>
                    <div className="relative flex items-center">
                        <Icon icon={LocalIcon}/>
                        <input className="input-form-text" type = "text" placeholder="Endereço" {...register('address')} />
                    </div>
                    <div className="-mt-4 mb-3">
                        {errors.address && (
                                    <p className="text-xs text-red-600">{errors.address.message}</p>
                                )}
                        </div>
                </div>)}
              {
                close && (
                        <div className="text-left">
                        <label htmlFor="telefone">Telefone do Aluno</label>
                        <div className="relative flex items-center">
                        <Icon icon={PhoneIcon}/>
                        <input className="input-form-text" type = "text" id="phone"  {...register('phone')}/>
                        </div>
                        <div className="-mt-4 mb-3">
                        {errors.phone && (
                                    <p className="text-xs text-red-600">{errors.phone.message}</p>
                                )}
                        </div>
                    </div>
                    )
                }
                {
                    close && (
                    <div className="text-left">
                        <label htmlFor="email">Email do Aluno</label>
                        <div className="relative flex items-center">
                            <Icon icon={AtSymbolIcon}/>
                            <input className="input-form-text" type = "email" id="email" {...register('email')}/>
                        </div>
                        <div className="-mt-4 mb-3">
                        {errors.email && (
                                    <p className="text-xs text-red-600">{errors.email.message}</p>
                                )}
                        </div>
                    </div>
                    )
                }
                {close &&(
                <div className="text-left flex flex-col">
                        <label htmlFor="">Gênero</label>
                        <div className="flex flex-col space-x-2 space-y-3 items-end md:flex-row lg:flex-row">
                    
                    <label className="border-3 border-form py-2 w-full rounded-form bg-input flex items-center justify-start text-left" >
                        <input className="relative right-24 border-3 border-form rounded-xl bg-white outline-none shadow-none" type="radio" name="genero" checked/>
                        <p className="text-input relative right-48 font-semibold">Masculino</p>

                    </label>

                    <label className="border-3 border-form py-2 w-full rounded-form bg-input flex items-center justify-end">
                        <input className=" relative left-40 border-3 border-form rounded-xl outline-none shadow-none " type="radio" id="" name="genero"/>
                        <p className="text-input relative right-16 font-semibold">Feminino</p>

                    </label>
                        
                        
                        </div>
                        
                </div> )}
                
                
                <Button/>
            </form>
           </div>
        </div>
    )   

}