import * as React from "react"
import { useState } from "react"
import imagemLogin from '../assets/_images/fundo-estudante.jpg'
import { PhoneIcon } from '@heroicons/react/24/outline'
import { AtSymbolIcon } from '@heroicons/react/24/outline'
import { MapPinIcon as LocalIcon } from '@heroicons/react/24/outline'
import {Input, Button, Icon} from './StudentStyle'
import { useSelector, useDispatch } from 'react-redux';
import rootReducer from '../_redux/root-reducer';
import {modify} from '../_redux/User/slice';

export default function StudentForm(){
    const { currentUser } = useSelector((rootReducer) => rootReducer.modify)

    const dispatch = useDispatch()
    function handleDispatch (valor) {dispatch(
        modify(valor)
    ) 
}
console.log(currentUser.selector)
    
    return (
        <div className=" flex flex-col justify-center  items-center bg-form text-white space-y-20">
            <div className="h-40 top-0 w-full bg-center bg-no-repeat" style={{backgroundImage: `url(${imagemLogin})`, backgroundSize:'110% 100%'}}></div>
            
            <div className="w-5/6 ">
            <h1 className="text-h1 mb-8 top-0 sticky">Formulário de Matrícula</h1>
            <form >
                <div className="text-left">
                    <label htmlFor="bi">Enviar o BI em PDF</label>
                    <input className="h-28 w-full rounded-form outline border-3 border-form bg-input shadow-none mb-6" type="file" id="bi" />
                </div>
                <div className="text-left">
                    <label>Nome Completo do Aluno</label>
                    <div className="flex flex-row space-x-2">
                        <Input type = "text" place="Primeiro nome"/>
                        <Input type = "text" place="Último nome"/>
                    </div>
                </div>
                <div className="text-left">
                    <label htmlFor="endereco">Endereço do Aluno</label>
                    <div className="relative flex items-center">
                        <Icon icon={LocalIcon}/>
                        <input className="py-6 w-full rounded-form outline border-3 border-form bg-input shadow-none mb-6 pl-10" type = "text" placeholder="Endereço" onChange={e =>{if(e.target.value){
                            handleDispatch('visivel')
                        }}}/>
                    </div>
                </div>
                {
                    currentUser && (
                        <div className="text-left">
                        <label htmlFor="telefone">Telefone do Aluno</label>
                        <div className="relative flex items-center">
                        <Icon icon={PhoneIcon}/>
                        <Input type = "text" />
                        </div>
                    </div>
                )
                }
                {
                    currentUser && (
                    <div className="text-left">
                        <label htmlFor="email">Email do Aluno</label>
                        <div className="relative flex items-center">
                            <Icon icon={AtSymbolIcon}/>
                            <Input type = "email"/>
                        </div>
                    </div>
                    )
                }
                
                <Button/>
            </form>
           </div>
        </div>
    )   

}