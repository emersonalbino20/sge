import * as React from "react"
import { useState } from "react"
import imagemLogin from '../assets/_images/fundo-estudante.jpg'
import { PhoneIcon } from '@heroicons/react/24/outline'
import { AtSymbolIcon } from '@heroicons/react/24/outline'
import { MapPinIcon as LocalIcon } from '@heroicons/react/24/outline'
import {Input, Button, Icon, schema} from './StudentStyle'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"




//Criando tipagem com TypeScript
type FormProps =  z.infer<typeof schema>;

export default function StudentForm(){

    const {register, handleSubmit,
         formState: {errors} = useForm<FormProps>} = useForm({
         mode: 'all', 
         resolver: zodResolver(schema)
        })

    return (
        <div className=" flex flex-col justify-center  items-center bg-form text-white space-y-20 ">
            <div className="h-40 top-0 w-full bg-center bg-no-repeat sticky" style={{backgroundImage: `url(${imagemLogin})`, backgroundSize:'110% 100%'}}></div>
            
            <div className="w-5/6 ">
            <h1 className="text-h1  ">Formulário de Matrícula</h1>
            <form >
                <div className="text-left">
                    <label htmlFor="bi">Enviar o BI em PDF</label>
                    <input className="h-28 w-full rounded-form outline border-3 border-form bg-input shadow-none mb-6" type="file" id="bi" />
                </div>
                <div className="text-left">
                    <label>Nome Completo do Aluno</label>
                    <div className="flex flex-row space-x-2">
                        <input className="py-6 w-full rounded-form outline border-3 border-form bg-input shadow-none mb-6 pl-10" type = "text" placeholder="Primeiro nome" {...register('firstName')}/>
                        
                        <input className="py-6 w-full rounded-form outline border-3 border-form bg-input shadow-none mb-6 pl-10" type = "text" placeholder="Último nome" {...register('lastName')}/>
                        {errors.firstName?.message && (
                                    <p className="text-xs  text-red-600">{errors.firstName.message}</p>
                                )}
                            
                    </div>
                </div>
                <div className="text-left">
                    <label htmlFor="endereco">Endereço do Aluno</label>
                    <div className="relative flex items-center">
                        <Icon icon={LocalIcon}/>
                        <input className="py-6 w-full rounded-form outline border-3 border-form bg-input shadow-none mb-6 pl-10" type = "text" placeholder="Endereço" {...register('address')} />
                    </div>
                </div>
              
                        <div className="text-left">
                        <label htmlFor="telefone">Telefone do Aluno</label>
                        <div className="relative flex items-center">
                        <Icon icon={PhoneIcon}/>
                        <input className="py-6 w-full rounded-form outline border-3 border-form bg-input shadow-none mb-6 pl-10" type = "text"  {...register('phone')}/>
                        </div>
                        {errors.phone?.message && (
                                    <p className="text-xs  text-red-600">{errors.phone.message}</p>
                                )}
                    </div>
                    <div className="text-left">
                        <label htmlFor="email">Email do Aluno</label>
                        <div className="relative flex items-center">
                            <Icon icon={AtSymbolIcon}/>
                            <input className="py-6 w-full rounded-form outline border-3 border-form bg-input shadow-none mb-6 pl-10" type = "email" {...register('email')}/>
                        </div>
                    </div>

                <div className="text-left flex flex-col">
                        <label htmlFor="">Gênero</label>
                        <div className="flex flex-row space-x-2">
                    
                    <label className="border-3 border-form py-2 w-full rounded-form bg-input flex items-center justify-start text-left" >
                        <input className="relative right-24 border-3 border-form rounded-xl bg-white outline-none shadow-none" type="radio" name="genero" checked/>
                        <p className="text-input relative right-48 font-semibold">Masculino</p>

                    </label>

                    <label className="border-3 border-form py-2 w-full rounded-form bg-input flex items-center justify-end">
                        <input className=" relative left-40 border-3 border-form rounded-xl outline-none shadow-none " type="radio" id="" name="genero"/>
                        <p className="text-input relative right-16 font-semibold">Feminino</p>

                    </label>
                        
                        
                        </div>
                        
                </div>
                
                <Button/>
            </form>
           </div>
        </div>
    )   

}