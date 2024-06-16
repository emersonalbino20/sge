import * as PropTypes from 'prop-types'
import * as React from 'react'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"


const usernameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/
const capitalizeWords = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

const phoneNumberSchema = z.string().regex(/^\d+$/, {message: 'O número de telefone deve conter apenas dígitos'}).transform((val)=>{
    const onlydigits = val.replace(/\D/g,'');
    const formatterNumber = onlydigits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return formatterNumber
})
export const schema = z.object({
    firstName: z.string().nonempty('Primeiro nome do aluno é obrigatório').min(4,'O nome não pode conter menos de 4 letras').regex(usernameRegex, 'O campo só pode conter letras').transform(capitalizeWords),
    lastName: z.string().nonempty('Primeiro nome do aluno é obrigatório').min(4,'O nome não pode conter menos de 4 letras').regex(usernameRegex, 'O campo só pode conter letras').transform(capitalizeWords),
    address: z.string().min(8, 'O campo não pode conter menos de 8 caracteres'),
    phonee: phoneNumberSchema
})

//Criando tipagem com TypeScript
type FormProps =  z.infer<typeof schema>;

export function Input(props){


 
 return (<input  type={props.type} className="py-6
 w-full
 rounded-form
 outline
 border-3
 border-form
 bg-input
 shadow-none
 mb-6
 pl-10
 " placeholder={props.place}/>);
}

export function Button(){
    return (
        <button className='border-none bg-green-500 text-white rounded-lg w-28 h-10 m-6'>Enviar</button>
    );
}

export function Icon (props){
    return <props.icon className="absolute h-5 w-5 text-icone mb-4 ml-4"/>
}
Input.defaultProps = {
    type : "text",
    place: "",
    pl: "0"
}
Input.prototype = {
    type : PropTypes.string,
    place : PropTypes.string,
    pl : PropTypes.string
}
Icon.defaultProps = {
    icon : ""
} 
