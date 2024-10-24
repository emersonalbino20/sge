'use client'
import * as React from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircleIcon, CheckCircleIcon,  PlusIcon, SaveIcon } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver} from '@hookform/resolvers/zod'
import {nomeCompletoZod,  dataNascimentoZod, generoZod, numeroBiZod, bairroZod, ruaZod, numeroCasaZod, telefoneZod, emailZod} from '../_zodValidations/validations'
import { MyDialog, MyDialogContent } from './my_dialog'
import { Button } from '@/components/ui/button'
import InputMask from 'react-input-mask'
import IPPUImage from '../assets /_images/IPPU.png'
import {Link, useNavigate} from 'react-router-dom'
import { getCookies, removeCookies } from '@/_cookies/Cookies';
import './stepper.css';
import { Check } from 'lucide-react';
import Header from './Header'
import { useHookFormMask, withMask } from 'use-mask-input'
//define the data that will send for the server to be insert on database

const TFormCreate =  z.object({
    nomeCompleto: nomeCompletoZod,
    nomeCompletoPai: nomeCompletoZod,
    nomeCompletoMae: nomeCompletoZod,
    numeroBi: numeroBiZod,
    dataNascimento: dataNascimentoZod,
    genero: generoZod,
    bairro: bairroZod,//o bairro não pode começar com um número
    rua: ruaZod,
    numeroCasa: z.number(),
    telefone: telefoneZod,
    email: emailZod,
    classeId: z.number(),
    metodoId: z.number(),
    turmaId: z.number(),
    turnoId: z.number(),
    responsaveis: z.array(
        z.object(
            {
                nomeCompleto: nomeCompletoZod,
                parentescoId: z.number(),
                endereco: z.object({
                    bairro: bairroZod,
                    rua: ruaZod,
                    numeroCasa: z.number(),
                }),
                contacto: z.object({
                    telefone: telefoneZod,
                    email: emailZod
                })
            }
        )
    )
})

export default function FormStudent(){
const form  = useForm<z.infer<typeof TFormCreate>>
({ mode: 'all', resolver: zodResolver(TFormCreate),
defaultValues:{
    responsaveis:
        [{
        nomeCompleto: '',
        parentescoId: 0,
        endereco: {
                bairro: '',
                rua: '',
        },
        contacto: {
            telefone: '',
        }        
    }]
}
})
const {control, setError, formState:{ errors }, register} = form;
//use of useFieldArray to create dynamic fields
const { fields, append, remove } =
    useFieldArray({
        name: 'responsaveis',
        control
    })

/*Área q implementa o código pra pesquisar cursos*/
const [metodo, setMetodo] = React.useState([]);
const [ano, setAno] = React.useState();
const [classe, setClasse] = React.useState([]);
const [turma, setTurma] = React.useState([]);
const [turno, setTurno] = React.useState([]);
const [idCurso, setIdCurso] = React.useState(0);
const [idClasse, setIdClasse] = React.useState(0);
const [dataApiCursos, setDataApiCursos] = React.useState([]);

React.useEffect( () => {
    const respFetchCursos = async () => {
          const resp = await fetch ("http://localhost:8000/api/cursos");
          const respJson = await resp.json();
          setDataApiCursos(respJson.data)

          const resppay = await fetch ("http://localhost:8000/api/metodos-pagamento");
          const resppayJson = await resppay.json();
          setMetodo(resppayJson.data);

          const resplectivo = await fetch ("http://localhost:8000/api/ano-lectivos");
          const resplectivoJson = await resplectivo.json();
          var meuarray = resplectivoJson.data.find((c)=>{
            return c.activo === true
          })
          setAno(meuarray.nome)
          if (idCurso > 0)
          {
            const respclasse = await fetch (`http://localhost:8000/api/cursos/${idCurso}/classes`);
            const respclasseJson = await respclasse.json();
            setClasse(respclasseJson.data)
          }
          if (idClasse > 0)
          {
            const respturma = await fetch (`http://localhost:8000/api/classes/${idClasse}/turmas`);
            const respturmaJson = await respturma.json();
            setTurma(respturmaJson.data)
          }
          const respturno = await fetch ("http://localhost:8000/api/turnos/");
          const respturnoJson = await respturno.json();
          setTurno(respturnoJson.data)
    } 
     respFetchCursos()
},[idCurso, idClasse])


/*Buscar dados do parentetesco*/
const[parentesco, setParentesco] = React.useState([]);
React.useEffect(()=>{
    const search = async () => {
        const resp = await fetch(`http://localhost:8000/api/parentescos/`);
        const respJson = await resp.json()
        const conv1 = JSON.stringify(respJson.data)
        const conv2 = JSON.parse(conv1)
        setParentesco(conv2)
    }
    search()
},[])


const [showModal, setShowModal] = React.useState(false);
const [modalMessage, setModalMessage] = React.useState('');         

//Funcao de matricula
const handleSubmitCreate = async (dados: z.infer<typeof TFormCreate>) => {
    const data = {
        classeId: dados.classeId,
        cursoId: idCurso,
        turmaId: dados.turmaId,
        turnoId: dados.turnoId,
        metodoPagamentoId: dados.metodoId,
        aluno: {
          nomeCompleto: dados.nomeCompleto,
          nomeCompletoPai: dados.nomeCompletoPai,
          nomeCompletoMae: dados.nomeCompletoMae,
          numeroBi: dados.numeroBi,
          dataNascimento: dados.dataNascimento,
          genero: dados.genero,
          endereco: {
            bairro: dados.bairro,
            rua: dados.rua,
            numeroCasa: dados.numeroCasa
          },
          contacto: {
            telefone: dados.telefone,
            email: dados.email
          },
          responsaveis: dados.responsaveis
        }
      }
      try {
    const response = await fetch('http://localhost:8000/api/matriculas/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        setShowModal(true);
        if (response.ok) {
            const blob = await response.blob(); 
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'matricula.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            setModalMessage(null);
        } else {
            const errorData = await response.json();
            console.error('Erro ao gerar PDF:', response.statusText, errorData);
            let index = Object.values(errorData.errors.aluno)
            let conv = parseInt(String(Object.keys(index)))
            if (Object.keys(errorData.errors.aluno)[0] == "numeroBi")
            {
                setModalMessage("Erro Nos dados do Aluno, "+Object.values(errorData.errors.aluno)[0][0])
            }
            if (Object.keys(errorData.errors.aluno)[0] == "contacto")
            {
                setModalMessage("Erro Nos dados do Aluno, "+Object.values(Object.values(errorData.errors.aluno)[0])[0][0])
            }
            if (Object.keys(errorData.errors.aluno)[0] == "responsaveis")
            {
                setModalMessage("Erro Nos dados do Responsavel, "+Object.values(Object.values(Object.values(Object.values(errorData.errors.aluno)[0])[0])[0])[0][0])
            }
            if (Object.values(Object.values(errorData.errors.aluno)[0])[0] == "responsaveis não podem conter contactos duplicados.")
            {
                setModalMessage("responsaveis não podem conter contactos duplicados.")
            }

        }
    }catch(error){
        console.error('Erro na requisição:', error);
    }
        
    }

    const step = ['Info. Aluno', 'Info. Encarregado', 'Último Passo'];
    const[ currentStep, setCurrentStep ] = React.useState<number>(1);
    const[ complete, setComplete ] = React.useState<boolean>(false);
    const registerWithMask = useHookFormMask(register);
return(
    <div className='w-screen h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300  grid-flow-col grid-cols-3'>
          <Header title={false} />
          
         <div className='w-full flex items-center justify-center'>
        <div className='flex flex-col space-y-2 justify-center w-[866px] sm:[666px] md:w-[700px] xl:w-[1200px]'>
        <div className='flex justify-center items-center '>
        <div className='flex justify-between'>{
        step?.map((step, i) => 
            (
                <div key={i} className={`step-item ${currentStep === i + 1 ? 'active' : '' } ${ (i + 1 < currentStep || complete) && 'complete'}`}>
                    <div className='step'>{ 
                    (i + 1 < currentStep || complete) ?
                    <Check/> : i + 1 }</div>
                    <p className='text-gray-500'>{step}</p>
                </div>
                
            )
            )}
    </div>
       </div>
        <div>
        <Form {...form} >
        <form onSubmit={form.handleSubmit(handleSubmitCreate)} >
    
        <div className='flex flex-col'>
        {currentStep === 1 && (<fieldset >
            <div className='bg-gradient-to-r from-yellow-500 to-red-500 mb-3  w-full h-9 pl-2 mr-2 text-white font-semibold flex items-center text-2xl tracking-wider'><p>Informações do Aluno</p></div>
            <div className='flex flex-row space-x-3 mb-5'>
                <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name="nomeCompleto"
                    render={({field})=>(
                    <FormItem>
                        <label className='text-sky-700 text-xl font-semibold'>Nome Completo*</label>
                        <FormControl>
                       
                        <Input type='text' {...field} 
                        
                        className={errors.nomeCompleto?.message ? 'text-xl border-2 border-red-300 text-red-700 font-semibold focus:border-red-500 py-6':
                        'text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-6'}/>
                        
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                        
                    )}
                    />
                </div>
                <div className='flex flex-col mb-5'>
                <FormField
                control={form.control}
                name="genero"
                render={({field})=>(
                <FormItem>
                     <label className='text-sky-700 text-xl font-semibold'>Gênero*</label>
                    
                    <FormControl>
                    
                     <select {...field} className={errors.genero?.message ? 'w-72 text-xl border-2 border-red-300 text-red-700 font-semibold focus:border-red-500 py-3':
                        'w-72 text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-3'}>
                        <option>Selecione o gênero</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                    </select>
                        
                    
                    </FormControl>
                    <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
                )}
                />
            </div>
                </div>
                <div className='flex flex-row space-x-3 mb-5'>
                <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name="numeroBi"
                    render={({field})=>(
                    <FormItem>
                        <label className='text-sky-700 text-xl font-semibold'>Número do BI*</label>
                        <FormControl>
                        <Input type='text' {...field} 
                        
                        className={errors.numeroBi?.message ? 'text-xl border-2 border-red-300 text-red-700 font-semibold focus:border-red-500 py-6':
                        'text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-6'}/>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                    )}
                    />
                </div>
                <div className='flex flex-col mb-5 w-full'>
                <FormField
                control={form.control}
                name="dataNascimento"
                render={({field})=>(
                <FormItem>
                     <label className='text-sky-700 text-xl font-semibold'>Data de Nasc.*</label>
                    
                    <FormControl>
                    
                    {errors.dataNascimento?.message ?
                        <Input type='date' className='text-xl border-2 border-red-300 text-red-700 font-semibold focus:border-red-500 py-6' {...field} max="2010-01-01" min="1960-01-01"/>
                        :
                        <Input  type='date' max="2010-01-01" min="1960-01-01" {...field} className='text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-6'/>
                        }
                    </FormControl>
                    <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
                )}
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
                         <label className='text-sky-700 text-xl font-semibold'>Email</label>
                        
                        <FormControl>
                        <Input type='email' {...field} 
                        
                        className={errors.email?.message ? 'text-xl border-2 border-red-300 text-red-700 font-semibold focus:border-red-500 py-6':
                        'text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-6'}/>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                    )}
                    />
                </div>
                <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name="telefone"
                    render={({field})=>(
                    <FormItem>
                         <label className='text-sky-700 text-xl font-semibold'>Telefone*</label>
                        <FormControl>
                        <Input {...registerWithMask('telefone',['999999999'], {required: true})}  className={errors.telefone?.message ? 'text-xl border-2 border-red-300 text-red-700 font-semibold focus:border-red-500 py-6':
                                'text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-6'}/>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                    )}
                    />
                </div>
            </div>
            
           
            <div className='flex flex-row space-x-3 mb-5'>
                <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name="numeroCasa"
                    render={({field})=>(
                    <FormItem>
                         <label className='text-sky-700 text-xl font-semibold'>Número da Casa*</label>
                       
                        <FormControl>

                        <Input type='number' {...field} 
                        
                        className={errors.numeroCasa?.message ? 'text-xl border-2 border-red-300 text-red-700 font-semibold focus:border-red-500 py-6':
                        'text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-6'} min={0} {...field} onChange={(e)=>{ field.onChange(parseInt(e.target.value))}}/>
                        
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                    )}
                    />
                </div>
                <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name="bairro"
                    render={({field})=>(
                    <FormItem>
                         <label className='text-sky-700 text-xl font-semibold'>Bairro*</label>
                        
                        <FormControl>
                        <Input type='text' {...field} 
                        
                        className={errors.bairro?.message ? 'text-xl border-2 border-red-300 text-red-700 font-semibold focus:border-red-500 py-6':
                        'text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-6'} />
                        
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                    )}
                    />
                </div>
                <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name="rua"
                    render={({field})=>(
                    <FormItem>
                         <label className='text-sky-700 text-xl font-semibold'>Rua*</label>
                        <FormControl>
                        <Input type='text' {...field} 
                        
                        className={errors.rua?.message ? 'text-xl border-2 border-red-300 text-red-700 font-semibold focus:border-red-500 py-6':
                        'text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-6'} />
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                    )}
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
                         <label className='text-sky-700 text-xl font-semibold'>Nome do Pai*</label>
                        
                        <FormControl>
                        <Input type='text' {...field} 
                        
                        className={errors.nomeCompletoPai?.message ? 'text-xl border-2 border-red-300 text-red-700 font-semibold focus:border-red-500 py-6':
                        'text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-6'} />
                        
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                    )}
                    />
                </div>
                <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name="nomeCompletoMae"
                    render={({field})=>(
                    <FormItem>
                         <label className='text-sky-700 text-xl font-semibold'>Nome da Mãe*</label>
                        
                        <FormControl>
                        <Input type='text' {...field} 
                        
                        className={errors.nomeCompletoMae?.message ? 'text-xl border-2 border-red-300 text-red-700 font-semibold focus:border-red-500 py-6':
                        'text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-6'} />
                        
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                    )}
                    />
                </div>
            </div>
            </fieldset>)}
            
                { currentStep === 2 &&
                fields.map((field, index) => {
                    return (<fieldset key={field.id}>
                        <div className='
                        bg-gradient-to-r from-yellow-500 to-red-500  w-full h-9 pl-2 mr-2 text-white font-semibold mb-3 flex items-center text-xl tracking-wider
                        '><p>Informações do Encarregado</p></div>
                        {
                        (index != 0)  && (
                        <div className='w-full'>
                            <h2 className='text-green-500 uppercase text-center bg-green-200 text-wrap'>Certifique-se que os encarregados não possuem mesmo contacto!</h2>
                        </div>
                        )
                    }
                        <div className='flex flex-row space-x-3'>
                            <div className='flex flex-col w-full'>
                                <FormField
                                control={form.control}
                                name={`responsaveis.${index}.nomeCompleto`} 
                                render={({field})=>(
                                    
                                <FormItem>
                                    <label className='text-sky-700 text-xl font-semibold'>Nome Completo*</label>
                                    
                                    <FormControl>
                                    <Input type='text' {...field} 
                        
                                     className={
                                    'text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-6'} />
                                    </FormControl>
                                    <FormMessage className='text-red-500 text-xs'/>
                                </FormItem>
                                )}
                                />
                            </div>
                        <div className='flex flex-col w-full'>
                            <FormField
                            control={form.control}
                            name={`responsaveis.${index}.parentescoId`}
                            
                            render={({field})=>(
                            <FormItem>
                                <label className='text-sky-700 text-xl font-semibold'>Parentescos*</label>
                                
                                <FormControl>
                                <select {...field} className='w-full text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))
                            
                        }}>
                      <option >Selecione o grau</option>
                      {
                            parentesco.map((field)=>{
                                return <option value={`${field.id}`}>{field.nome}</option>
                            })
                      }
                      </select>
                                </FormControl>
                                <FormMessage className='text-red-500 text-xs'/>
                            </FormItem>)
                            }
                            />
                        </div>
                    </div>
                    
                        <div className='flex flex-row space-x-3 mb-5'>
                            <div className='flex flex-col w-full'>
                            <FormField
                            control={form.control}
                            name={`responsaveis.${index}.contacto.telefone`}
                            render={({field})=>(
                            <FormItem>
                                <label className='text-sky-700 text-xl font-semibold'>Telefone*</label>
                                
                                <FormControl>
                                <Input {...registerWithMask(`responsaveis.${index}.contacto.telefone`,['999999999'], {required: true})}  className={errors.telefone?.message ? 'text-xl border-2 border-red-300 text-red-700 font-semibold focus:border-red-500 py-6':
                                'text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-6'}/>
                                </FormControl>
                                <FormMessage className='text-red-500 text-xs'/>
                            </FormItem>
                            )}
                            />
                            </div>
                            <div className='flex flex-col w-full'>
                                <FormField
                                control={form.control}
                                name={`responsaveis.${index}.contacto.email`}
                                render={({field})=>(
                                <FormItem>
                                    <label className='text-sky-700 text-xl font-semibold'>Email</label>
                                    
                                    <FormControl>
                                    <Input type='text' {...field} className='text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-6'/>
                                    </FormControl>
                                    <FormMessage className='text-red-500 text-xs'/>
                                </FormItem>
                                )}
                                />
                            </div>
                    </div>
                    
                        <div className='flex flex-row space-x-3 mb-5' >
                        <div className='flex flex-col w-full'>
                            <FormField
                            control={form.control}
                            name={`responsaveis.${index}.endereco.numeroCasa`}
                            render={({field})=>(
                            <FormItem>
                                <label className='text-sky-700 text-xl font-semibold'>Número da Casa*</label>
                                
                                <FormControl>
                                <Input type='number' min={1} {...field}  onChange={(e)=>{ field.onChange(parseInt(e.target.value))}} className='text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-6'/>
                                </FormControl>
                                <FormMessage className='text-red-500 text-xs'/>
                            </FormItem>
                            )}
                            />
                        </div>
                        <div className='flex flex-col w-full'>
                        <FormField
                        control={form.control}
                        name={`responsaveis.${index}.endereco.bairro`}
                        render={({field})=>(
                        <FormItem>
                            <label className='text-sky-700 text-xl font-semibold'>Bairro*</label>
                            <FormControl>
                            <Input type='text' {...field} className='text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-6' />
                            </FormControl>
                            <FormMessage className='text-red-500 text-xs'/>
                        </FormItem>
                        )}
                        />
                </div>
                <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name={`responsaveis.${index}.endereco.rua`}
                    render={({field})=>(
                    <FormItem>
                        <label className='text-sky-700 text-xl font-semibold'>Rua*</label>
                        <FormControl>
                        <Input type='text' {...field} className='text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-6'/>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                    )}
                    />
                </div>
                </div>
                    {
                        (index > 0)  && (
                        <p className='text-red-600 cursor-pointer text-center' onClick={()=>{ remove( index )}}>remove</p>
                        )
                    }       
                    
                </fieldset>)
            
                    })
                    }  
                    { currentStep === 2 && fields.length < 2 &&(
                    <div className='w-full flex items-center justify-center mb-4'>
                        <div className=' flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 cursor-pointer hover:bg-blue-800' onClick={()=>{ append({
                            nomeCompleto: '',
                        })}}>
                        <PlusIcon className='text-white h-6 w-6'/>
                        </div>
                    </div>
                )   }   
          </div>
            {currentStep === 3 &&
            <fieldset>
            <div className='bg-gradient-to-r from-yellow-500 to-red-500  w-full h-9 pl-2 mr-2 text-white font-semibold mb-3 flex items-center text-xl tracking-wider '><p>Informações Essenciais</p></div>
            <div className='flex flex-col space-y-3 mb-5'>
                <div className='flex flex-row space-x-3 mb-5'>
                <div className='flex flex-col w-full'>
                    <FormField
                    name=''
                    render={({field})=>(
                    <FormItem>
                        <label className='text-sky-700 text-xl font-semibold'>Cursos*</label>
                        <FormControl>
                    <select {...field} onChange={(e) => {
                        field.onChange(
                            parseInt(e.target.value, 10),
                            setIdCurso(parseInt(e.target.value, 10) || 0))
                        }
                                } className={
                    'w-full text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-3'}>
                        <option>Selecione o curso</option>
                        {
                            
                        dataApiCursos.map((field)=>{
                            return (<option value={`${field.id}`}>{field.nome}
                            </option>
                            )
                        })
                                    
                        }
                    </select>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>)
                    }
                    />
                </div>
                <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name='classeId'
                    render={({field})=>(
                    <FormItem>
                        <label className='text-sky-700 text-xl font-semibold'>Classes*</label>
                        <FormControl>
                        <select {...field} className='w-full text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))
                            setIdClasse(parseInt(e.target.value, 10) || 0)
                          }}>
                        <option >Selecione a classe</option>
                        {
                              classe.map((field)=>{
                                  return <option value={`${field.id}`}>{field.nome}</option>
                              })
                        }
                    </select>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>)
                    }
                    />
                    </div>
                    </div>
                    <div className='flex flex-row space-x-3 mb-5'>
                    <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name='turmaId'
                    render={({field})=>(
                    <FormItem>
                        <label className='text-sky-700 text-xl font-semibold'>Turmas*</label>
                        <FormControl>
                        <select {...field} className='w-full text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))
                          }}>
                        <option >Selecione a turma</option>
                        {
                              turma.map((field)=>{
                                  return <option value={`${field.id}`}>{field.nome}</option>
                              })
                        }
                    </select>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>)
                    }
                    />
                    </div>
                    <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name='turnoId'
                    render={({field})=>(
                    <FormItem>
                        <label className='text-sky-700 text-xl font-semibold'>Turnos*</label>
                        <FormControl>
                        <select {...field} className='w-full text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))
                            
                          }}>
                        <option >Selecione a turno</option>
                        {
                              turno.map((field)=>{
                                  return <option value={`${field.id}`}>{field.nome}</option>
                              })
                        }
                    </select>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>)
                    }
                    />
                    </div>
                    </div>
                <div className='flex flex-col'>
                    <FormField
                    control={form.control}
                    name='metodoId'
                    render={({field})=>(
                    <FormItem>
                        
                        <FormControl>
                        <select {...field} className='w-72 text-xl border-2 border-gray-300 text-sky-700 font-semibold focus:border-sky-500 py-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))
                            setIdClasse(parseInt(e.target.value, 10) || 0)
                          }}>
                        <option >Pagar Em*</option>
                        {
                              metodo.map((field)=>{
                                  return <option value={`${field.id}`}>{field.nome}</option>
                              })
                        }
                    </select>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>)
                    }
                    />
                    </div>
                   
                </div>
                </fieldset>}
        <div className='w-full flex items-center justify-between'>
        
        {currentStep > 1 && 
    <button type='button' onClick={()=>{
        currentStep === step.length && setComplete(false);
        
        currentStep > 1 && setCurrentStep(prev => prev - 1);
    }} className='bg-gray-700 hover:bg-gray-600 text-white font-semibold text-xl px-7 py-2 border-gray-700'>Voltar</button>
    }
    
    {currentStep === step.length ? 
    <button type={(currentStep===step.length && complete) ? 'submit' : 'button'} onClick={()=>{
        currentStep === step.length ?
        setComplete(true) :
        setCurrentStep(prev => prev + 1);
    }} className={`${currentStep === 3 && complete ? 'bg-green-700 hover:bg-green-600 border-green-700': 'bg-sky-700 hover:bg-sky-600 border-sky-700'} text-white font-semibold text-xl px-7 py-2 `}>Cadastrar</button> : 
    <button type='button' onClick={()=>{
        currentStep === step.length ?
        setComplete(true) :
        setCurrentStep(prev => prev + 1);
    }} className='bg-sky-700 hover:bg-sky-600 text-white font-semibold text-xl px-7 py-2 border-sky-700'>Próximo</button>}

    
        </div>
           </form>
      </Form>
      
      </div>       
      </div>
      
      </div>
      {showModal &&
  <MyDialog open={showModal} onOpenChange={setShowModal}>
  
    <MyDialogContent className="sm:max-w-[425px] bg-white p-0 m-0">
    {modalMessage == null &&
        <div role="alert" className='w-full'>
      <div className="bg-green-500 text-white font-bold rounded-t px-4 py-2 flex justify-between">
        <div>
            <p>Sucesso</p>
        </div>
        <div className='cursor-pointer' onClick={() => setShowModal(false)}>
            <p>X</p>
          </div>
      </div>
      <div className="border border-t-0 border-green-400 rounded-b bg-green-100 px-4 py-3 text-green-700 flex flex-col items-center justify-center space-y-2">
      <CheckCircleIcon className='w-28 h-20 text-green-400'/>
      
      <p className='font-poppins uppercase'>Operação foi bem sucedida!</p>
      <div className=' bottom-0 py-2 flex flex-col items-end justify-end font-lato border-t w-full border-green-400'>
        <Button className='bg-green-400 hover:bg-green-500
        hover:font-medium font-poppins text-md border-green-400 font-medium h-9 w-20' onClick={() => setShowModal(false)}>Fechar</Button>
    </div>
    </div>
    
      </div>
  }
   {modalMessage != null &&
        <div role="alert" className='w-full'>
      <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2 flex justify-between">
        <div>
            <p>Falhou</p>
        </div>
        <div className='cursor-pointer' onClick={() => setShowModal(false)}>
            <p>X</p>
          </div>
      </div>
      <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700 flex flex-col items-center justify-center space-y-2">
      <AlertCircleIcon className='w-28 h-20 text-red-400'/>
      <p className='font-poppins uppercase'>{modalMessage}</p>
      <div className='bottom-0 py-2 flex flex-col items-end justify-end font-lato border-t w-full border-red-400'>
        <Button className='hover:bg-red-500 bg-red-400 hover:font-medium font-poppins text-md border-red-400 font-medium h-9 w-20' onClick={() => setShowModal(false)}>Fechar</Button>
    </div>
    </div>
    
      </div>
  }
         </MyDialogContent>
        </MyDialog>
   }
     </div>
     
)
}