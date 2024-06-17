import { current } from '@reduxjs/toolkit';
import {z} from 'zod'


export const usernameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/
const capitalizeWords = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

export const phoneNumberSchema = z.string().nonempty('campo obrigatório').regex(/^\d+$/, {message: 'O número de telefone deve conter apenas dígitos'}).transform((val)=>{
    const onlydigits = val.replace(/\D/g,'');
    const formatterNumber = onlydigits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return formatterNumber
})
const currentYear = new Date().getFullYear()
const isYearValid = (date: Date) => {
    const year = date.getFullYear();
    return year >= 1980 && year <= currentYear 
}
export const schema = z.object({
    firstname: z.string().nonempty("Campo obrigatório").min(4, {message:'O campo não pode conter menos de 4 letras'}).regex(usernameRegex, {message:'O campo só pode conter letras'}),
    lastname: z.string().nonempty('Campo obrigatório').min(4,'O campo não pode conter menos de 4 letras').regex(usernameRegex, 'O campo só pode conter letras'),
    address: z.string().min(8, 'O campo não pode conter menos de 8 caracteres'),
    phone: phoneNumberSchema,
    email: z.string().nonempty('campo opcional').optional(),
   
    
})

//Criando tipagem com TypeScript
export  type FormProps =  z.infer<typeof schema>;
