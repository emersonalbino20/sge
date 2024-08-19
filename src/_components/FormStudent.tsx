'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusIcon, User } from 'lucide-react'
import { number, string } from 'prop-types'
import * as React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'


type TForm = {
    nomeCompleto: string,
    nomeCompletoPai: string,
    nomeCompletoMae: string,
    numeroBI: string,
    dataNascimento: string,
    genero: string,
    bairro: string,
    rua: string,
    numeroCasa: number,
    telefone: number,
    email: string,
    responsavel: 
        {
            nomeCompleto: string,
            parentescoId: number,
            bairro: string,
            rua: string,
            numeroCasa: number,
            telefone: number,
            email: string,
    }[]
    
}
export default function FormStudent(){
    const form = useForm<TForm>({
        defaultValues: {
            nomeCompleto: '',
            nomeCompletoPai: '',
            nomeCompletoMae: '',
            numeroBI: '',
            dataNascimento: '',
            genero: '',
            bairro: '',
            rua: '',
            numeroCasa: null,
            telefone: null,
            email: '',
            responsavel: [
                {
                    nomeCompleto: '',
                    parentescoId: null,
                    bairro:'',
                    rua: '',
                    numeroCasa: null,
                    telefone: null,
                    email: '',
            }
        ]
            
        }
    })
    const {control} = form;
    const { fields, append, remove } = useFieldArray({
        name: 'responsavel',
        control
    })
    const handleSubmitCreate = async (data: TForm) => {
            await fetch('http://localhost:8000/api/alunos/1',{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    mode: "no-cors",
                    referrerPolicy: "strict-origin-when-cross-origin",
                    body: JSON.stringify(data)
                })
                .then((resp => resp.json()))
                .then((resp) => console.log(resp))
                .catch((error) => console.log(`error: ${error}`))
                console.log(data)
            }
    
        return(
        <Form {...form} >
            <form onSubmit={form.handleSubmit(handleSubmitCreate)} className='flex flex-col h-screen w-full p-3 pt-36'>
                 
            <fieldset className='flex flex-col justify-center  bg-slate-700 md:bg-gray-300'>
                    <h1 className='font-poppins text-h1 text-center font-bold text-white md:text-slate-700'>Matrícula de Estudante</h1>
            </fieldset>
            <div className='flex flex-col '>
            <fieldset >
            <legend>Informações Pessoais</legend>
                <div className='flex flex-col space-y-3 mb-5'>
                <div className='flex flex-col'>
                    <FormField
                control={form.control}
                name="nomeCompleto"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                        <Input type='text' {...field} />
                        </FormControl>
                    </FormItem>
                    
                )}
                />
                    </div>
                    <div className='flex flex-col'>
                    <FormField
                control={form.control}
                name="numeroBI"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Número do BI</FormLabel>
                        <FormControl>
                        <Input type='text' {...field} />
                        </FormControl>
                    </FormItem>)
                }
                />
                    </div>
                </div>
                <div className='flex flex-row space-x-3 mb-5'>
                    <div className='flex flex-col w-full'>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                <Input type='email' {...field} />
                                </FormControl>
                            </FormItem>)
                            }
                        />
                    </div>
                    <div className='flex flex-col w-full'>
                        <FormField
                            control={form.control}
                            name="telefone"
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                <Input type='text'  placeholder='+244 993-222-111' {...field} />
                                </FormControl>
                            </FormItem>)
                            }
                            />

                    </div>
                </div>
                
                <div className='flex flex-col mb-5'>
                        <FormField
                            control={form.control}
                            name="dataNascimento"
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Data de Nascimento</FormLabel>
                                <FormControl>
                                <Input type='date' {...field} />
                                </FormControl>
                            </FormItem>)
                            }
                            />
                            


                </div>
                <div className='flex flex-col mb-5'>
                    <FormField
                       control={form.control}
                       name="genero"
                       render={({field})=>(
                       <FormItem>
                           <FormLabel>Gênero</FormLabel>
                           <FormControl>
                           
                           <div className='w-full flex flex-row space-x-2'>
                            <label htmlFor='masc' className="py-2 border border-gray-300 rounded-sm w-full pl-5 text-gray-400 items-center">
                           <input type='radio' id="masc" className='h-4 w-4 mr-2' {...field}  value="M"/>Masculino</label>
                           <label htmlFor='fem' className="py-2 border border-gray-300 rounded-sm w-full flex justify-end text-gray-400 pr-5 items-center">Feminino<input type='radio' id="fem"  className='h-4 w-4 ml-2'{...field} value="F" /></label>
                           </div>
                           </FormControl>
                       </FormItem>)
                       }
                    />
                </div>
               <div className='flex flex-col mb-5'>
                

               </div>
                <div className='flex flex-row space-x-3 mb-5'>
                    <div className='flex flex-col w-full'>
                        <FormField
                            control={form.control}
                            name="numeroCasa"
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Numero de Casa</FormLabel>
                                <FormControl>
                                <Input type='text' {...field} />
                                </FormControl>
                            </FormItem>)
                            }
                            />

                    </div>
                    <div className='flex flex-col w-full'>
                        <FormField
                            control={form.control}
                            name="bairro"
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Bairro</FormLabel>
                                <FormControl>
                                <Input type='text' {...field} />
                                </FormControl>
                            </FormItem>)
                            }
                            />
                    </div>
                    <div className='flex flex-col w-full'>
                        <FormField
                            control={form.control}
                            name="rua"
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Rua</FormLabel>
                                <FormControl>
                                <Input type='text' {...field} />
                                </FormControl>
                            </FormItem>)
                            }
                            />
                    </div>
                </div>
                <div className='flex flex-row space-x-3 mb-5'>
                    <div className='flex flex-col w-full'>
                           <FormField
                            control={form.control}
                            name="nomeCompletoPai"
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Nome do Pai</FormLabel>
                                <FormControl>
                                <Input type='text' {...field} />
                                </FormControl>
                            </FormItem>)
                            }
                            />

                    </div>
                    <div className='flex flex-col w-full'>
                        <FormField
                            control={form.control}
                            name="nomeCompletoMae"
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Nome da Mãe</FormLabel>
                                <FormControl>
                                <Input type='text' {...field} />
                                </FormControl>
                            </FormItem>)
                            }
                            />
                    </div>
                </div>
                </fieldset>
                
                    {
                    fields.map((field, index) => {
                     return <fieldset key={field.id}>
                    <legend>Dados do Encarregado</legend>
                    <div className='flex flex-row space-x-3'>
                        <div className='flex flex-col w-full'>
                            <FormField
                            control={form.control}
                            name={`responsavel.${index}.nomeCompleto`}
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Nome Completo </FormLabel>
                                <FormControl>
                                <Input type='text' {...field} />
                                </FormControl>
                            </FormItem>)
                            }
                            />
                        </div>
                        <div className='flex flex-col w-full'>
                            
                            <FormField
                            control={form.control}
                            name={`responsavel.${index}.parentescoId`}
                            
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Parentesco</FormLabel>
                                <FormControl>
                                <Select >
                                <SelectTrigger className='text-black bg-white mt-0 border-gray-300 rounded-sm'>
                                    <SelectValue {...field}placeholder="Seleciona o grau"/>
                                </SelectTrigger>
                                <SelectContent className='bg-white'>
                                    <SelectItem value='1'>Pai</SelectItem>
                                    <SelectItem value='2'>Mãe</SelectItem>
                                    <SelectItem value='3'>Tio</SelectItem>
                                    <SelectItem value='4'>Irmão</SelectItem>
                                </SelectContent>
                            </Select>
                                </FormControl>
                            </FormItem>)
                            }
                            />
                        </div>
                    </div>
                    <fieldset >
                        <legend>Contacto</legend>
                    
                    <div className='flex flex-row space-x-3 mb-5'>
                    <div className='flex flex-col w-full'>
                        <FormField
                            control={form.control}
                            name={`responsavel.${index}.telefone`}
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                <Input type='text' {...field} />
                                </FormControl>
                            </FormItem>)
                            }
                            />
                    </div>
                    <div className='flex flex-col w-full'>
                        <FormField
                            control={form.control}
                            name={`responsavel.${index}.email`}
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                <Input type='text' {...field} />
                                </FormControl>
                            </FormItem>)
                            }
                            />
                    </div>
                </div>
                </fieldset>
                <fieldset >
                        <legend>Endereço</legend>
                
                           <div className='flex flex-row space-x-3 mb-5' >
                           <div className='flex flex-col w-full'>
                        <FormField
                            control={form.control}
                            name={`responsavel.${index}.numeroCasa`}
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Número de Casa</FormLabel>
                                <FormControl>
                                <Input type='text' {...field} />
                                </FormControl>
                            </FormItem>)
                            }
                            />

                    </div>
                    <div className='flex flex-col w-full'>
                        <FormField
                            control={form.control}
                            name={`responsavel.${index}.bairro`}
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Bairro</FormLabel>
                                <FormControl>
                                <Input type='text' {...field} />
                                </FormControl>
                            </FormItem>)
                            }
                            />
                    </div>
                    <div className='flex flex-col w-full'>
                        <FormField
                            control={form.control}
                            name={`responsavel.${index}.rua`}
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Rua</FormLabel>
                                <FormControl>
                                <Input type='text' {...field} />
                                </FormControl>
                            </FormItem>)
                            }
                            />
                    </div>
                </div>
                {
                    index > 0 && (
                 <p className='text-red-600 cursor-pointer text-center' onClick={()=>{ remove( index )}}>remove</p>
                    )
                }
                </fieldset>
              
                </fieldset>})
                  
                    }       
                
                  {fields.length < 3 &&(
                    <div className='w-full flex items-center justify-center'>
                  
                  <div className=' flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 cursor-pointer hover:bg-blue-800' onClick={()=>{ append({rua:''})}}>
                    <PlusIcon className='text-white h-6 w-6'/>
                    </div>
                  </div>
                )
                    }
                    
                    
                   
                
                <button type='submit' className='w-24 py-1 mb-4 bg-blue-600 text-white font-semibold'>Matricular</button>    
            </div>
          </form>  
          
        </Form>
                
        )
}