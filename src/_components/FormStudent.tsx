'use client'
import * as React from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AlertCircleIcon, AlertTriangle, CheckCircleIcon,  PlusIcon } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver} from '@hookform/resolvers/zod'
import {nomeCompletoZod,  dataNascimentoZod, generoZod, numeroBiZod, bairroZod, ruaZod, numeroCasaZod, telefoneZod, emailZod} from '../_zodValidations/validations'
import { MyDialog, MyDialogContent } from './my_dialog'
import { Button } from '@/components/ui/button'
import './stepper.css';
import { Check } from 'lucide-react';
import Header from './Header'
import { useHookFormMask, withMask } from 'use-mask-input'
import { error } from 'console'
import { animateBounce, animateFadeLeft, animatePing, animateShake } from '@/AnimationPackage/Animates'
import { Link } from 'react-router-dom'
import MostrarDialog from './MostrarDialog';
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
const {control, watch, formState:{ errors, isValid }, register} = form;
//use of useFieldArray to create dynamic fields
const { fields, append, remove } =
    useFieldArray({
        name: 'responsaveis',
        control
    })

const [fieldNome, fieldBi, fieldGenero, fieldTelefone, fieldDataNascimento, fieldNumeroCasa, fieldBairro, fieldRua, fieldNomeCompleMae, fieldNomeCompletoPai, fieldRespNome, fieldRespParentescoId, fieldRespBairro, fieldRespRua, fieldRespNumeroCasa, fieldRespTelefone, fieldClasseId, fieldTurmaId, fieldTurnoId, fieldMetodoId] = watch(["nomeCompleto", "genero", "numeroBi", "dataNascimento", "telefone", "numeroCasa", "bairro", "rua", "nomeCompletoMae", "nomeCompletoPai", "responsaveis.0.nomeCompleto", "responsaveis.0.parentescoId", "responsaveis.0.endereco.bairro", "responsaveis.0.endereco.rua",
"responsaveis.0.endereco.numeroCasa",
"responsaveis.0.contacto.telefone", "classeId", "turmaId", "turnoId", "metodoId"]);  
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
          let meuarray = resplectivoJson.data.find((c)=>{
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
        setParentesco(respJson.data)
    }
    search()
},[])


const [showModal, setShowModal] = React.useState(false);
const [modalMessage, setModalMessage] = React.useState('');         

//Funcao de matricula
    const [showDialog, setShowDialog] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState<string | null>(null);
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
        
        if (response.ok) {
            const blob = await response.blob(); 
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'matricula.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            setDialogMessage(null);
            setShowDialog(true);
        } else {
            const errorData = await response.json();
            
            setShowDialog(true);
            console.error('Erro ao gerar PDF:', response.statusText, errorData);
            let index = Object.values(errorData.errors.aluno)
            let conv = parseInt(String(Object.keys(index)))
            if (Object.keys(errorData.errors.aluno)[0] == "numeroBi")
            {
                setDialogMessage("Erro Nos dados do Aluno, "+Object.values(errorData.errors.aluno)[0][0])
            }
            if (Object.keys(errorData.errors.aluno)[0] == "contacto")
            {
                setDialogMessage("Erro Nos dados do Aluno, "+Object.values(Object.values(errorData.errors.aluno)[0])[0][0])
            }
            if (Object.keys(errorData.errors.aluno)[0] == "responsaveis")
            {
                setDialogMessage("Erro Nos dados do Responsavel, "+Object.values(Object.values(Object.values(Object.values(errorData.errors.aluno)[0])[0])[0])[0][0])
            }
            if (Object.values(Object.values(errorData.errors.aluno)[0])[0] == "responsaveis não podem conter contactos duplicados.")
            {
                setDialogMessage("responsaveis não podem conter contactos duplicados.")
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
    const [idAno, setIdAno] = React.useState<number>(0);
    React.useEffect(() => {
      const search = async () => {
        const resp = await fetch(`http://localhost:8000/api/ano-lectivos/`);
          const receve = await resp.json()
          var meuarray = receve.data.find((c)=>{
            return c.activo === true
          })
          setIdAno(meuarray.id)
      };
      search();
    }, []);
return(
    <>  { idAno == 0 ? <div className='w-screen min-h-screen bg-scroll bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300 flex items-center justify-center'>
    <div className='w-full text-center text-4xl text-red-600 md:text-2xl lg:text-2xl'>
        <div >
        <AlertTriangle className={`${animateBounce} inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12`}/>
            <p className='text-red-500'>SELECIONE O ANO LECTIVO</p>
            <p className='text-red-500 italic font-semibold text-sm cursor-pointer'><Link to={'/AcademicYearPage'}>Selecionar agora</Link></p>
        </div>
    </div>
      </div> : (
    <div className='w-screen h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300  grid-flow-col grid-cols-3'>
          <Header title={false} />
          
         <div className='w-full flex items-center justify-center'>
        <div className='flex flex-col space-y-2 justify-center sm:[376px] md:w-[550px] lg:w-[600px]'>
        <div className='flex justify-center items-center '>
        <div className='flex justify-between text-sm'>{
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
    
        <div >
        {currentStep === 1 && (<fieldset className='animate-fade-left animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-inflex flex-col' >
            <div className='legend-div'><h1>Informações do Aluno</h1></div>
            <div className='flex flex-row space-x-3 mb-2'>
                <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name="nomeCompleto"
                    render={({field})=>(
                    <FormItem>
                        <label>Nome Completo<span className='text-red-500'>*</span></label>
                        <FormControl>
                       
                        <Input type='text' {...field} 
                        
                        className={errors.nomeCompleto?.message && 
                        `input-error ${animateShake}`}/>
                        
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                        
                    )}
                    />
                </div>
                <div className='flex flex-col w-full mb-2'>
                <FormField
                control={form.control}
                name="genero"
                render={({field})=>(
                <FormItem>
                     <label >Gênero<span className='text-red-500'>*</span></label>
                    <FormControl>
                    
                     <select {...field} className={errors.genero?.message && 
                        `${animateShake} select-error`}>
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
                <div className='flex flex-row space-x-3 mb-2'>
                <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name="numeroBi"
                    render={({field})=>(
                    <FormItem>
                        <label >Número do BI<span className='text-red-500'>*</span></label>
                        <FormControl>
                        <Input type='text' maxLength={14} {...field} 
                        className={errors.numeroBi?.message && `input-error ${animateShake}`}/>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                    )}
                    />
                </div>
                <div className='flex flex-col mb-2 w-full'>
                <FormField
                control={form.control}
                name="dataNascimento"
                render={({field})=>(
                <FormItem>
                     <label >Data de Nasc.<span className='text-red-500'>*</span></label>
                    <FormControl>
                        <Input type='date' className={errors.dataNascimento?.message && `input-error ${animateShake}`} {...field} />
                    </FormControl>
                    <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
                )}
                />
            </div>
            </div>
            <div className='flex flex-row space-x-3 mb-2'>
                <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name="email"
                    render={({field})=>(
                    <FormItem>
                         <label >Email</label>
                        <FormControl>
                        <Input type='email' {...field} 
                        
                        className={errors.email?.message && `input-error ${animateShake}`}/>
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
                         <label >Telefone<span className='text-red-500'>*</span></label>
                        <FormControl>
                        <Input {...registerWithMask('telefone',['999999999'], {required: true})}  className={errors.telefone?.message && `input-error ${animateShake}`}/>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                    )}
                    />
                </div>
            </div>
            <div className='flex flex-row space-x-3 mb-2'>
                <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name="numeroCasa"
                    render={({field})=>(
                    <FormItem>
                         <label >Número da Residência<span className='text-red-500'>*</span></label>
                        <FormControl>
                        <Input type='number' {...field} 
                        
                        className={errors.numeroCasa?.message && `input-error ${animateShake}`} min={0} {...field} onChange={(e)=>{ field.onChange(parseInt(e.target.value))}}/>
                        
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
                         <label >Bairro<span className='text-red-500'>*</span></label>
                        
                        <FormControl>
                        <Input type='text' {...field} 
                        className={errors.bairro?.message &&  `input-error ${animateShake}`} />
                        
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
                         <label >Rua<span className='text-red-500'>*</span></label>
                        <FormControl>
                        <Input type='text' {...field} 
                        
                        className={errors.rua?.message && `input-error ${animateShake}`} />
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                    )}
                    />
                </div>
            </div>
            <div className='flex flex-row space-x-3 mb-2'>
                <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name="nomeCompletoPai"
                    render={({field})=>(
                    <FormItem>
                         <label >Nome do Pai<span className='text-red-500'>*</span></label>
                        
                        <FormControl>
                        <Input type='text' {...field} 
                        
                        className={errors.nomeCompletoPai?.message && `input-error ${animateShake}`} />
                        
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
                         <label>Nome da Mãe<span className='text-red-500'>*</span></label>
                        
                        <FormControl>
                        <Input type='text' {...field} 
                        
                        className={errors.nomeCompletoMae?.message && `input-error ${animateShake}`} />
                        
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                    )}
                    />
                </div>
            </div>
            </fieldset>)}
            
                { (currentStep === 2 ) &&
                fields.map((field, index) => {
                    return (<fieldset className='animate-fade-left animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-in' key={field.id}>
                    <div className='legend-div'>Informações do Encarregado</div>
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
                                    <label >Nome Completo<span className='text-red-500'>*</span></label>
                                    
                                    <FormControl>
                                    <Input type='text' {...field} 
                        
                                     className={
                                errors.responsaveis?.[index]?.nomeCompleto?.message && `input-error ${animateShake}`} />
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
                                <label >Parentescos<span className='text-red-500'>*</span></label>
                                
                                <FormControl>
                                <select {...field} 
                                className={errors.responsaveis?.[index]?.parentescoId?.message && `${animateShake} select-error`}
                                onChange={(e)=>{field.onChange(parseInt(e.target.value))
                            
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
                    
                        <div className='flex flex-row space-x-3 mb-2'>
                            <div className='flex flex-col w-full'>
                            <FormField
                            control={form.control}
                            name={`responsaveis.${index}.contacto.telefone`}
                            render={({field})=>(
                            <FormItem>
                                <label >Telefone<span className='text-red-500'>*</span></label>
                                
                                <FormControl>
                                <Input {...registerWithMask(`responsaveis.${index}.contacto.telefone`,['999999999'], {required: true})}  className={errors.responsaveis?.[index]?.contacto?.telefone?.message && `input-error ${animateShake}`}
                                />
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
                                    <label >Email</label>
                                    <FormControl>
                                    <Input type='text' {...field} className={errors.responsaveis?.[index]?.contacto?.email?.message && `input-error ${animateShake}`}/>
                                    </FormControl>
                                    <FormMessage className='text-red-500 text-xs'/>
                                </FormItem>
                                )}
                                />
                            </div>
                    </div>
                    
                        <div className='flex flex-row space-x-3 mb-2' >
                        <div className='flex flex-col w-full'>
                            <FormField
                            control={form.control}
                            name={`responsaveis.${index}.endereco.numeroCasa`}
                            render={({field})=>(
                            <FormItem>
                                <label >Número da Residência<span className='text-red-500'>*</span></label>
                                
                                <FormControl>
                                <Input type='number' min={1} {...field}  onChange={(e)=>{ field.onChange(parseInt(e.target.value))}} className={errors.responsaveis?.[index]?.endereco?.numeroCasa?.message && `input-error ${animateShake}`}/>
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
                            <label >Bairro<span className='text-red-500'>*</span></label>
                            <FormControl>
                            <Input type='text' {...field} className={errors.responsaveis?.[index]?.endereco?.bairro?.message && `input-error ${animateShake}`} />
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
                        <label >Rua<span className='text-red-500'>*</span></label>
                        <FormControl>
                        <Input type='text' {...field} className={errors.responsaveis?.[index]?.endereco?.rua?.message && `input-error ${animateShake}`}/>
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
            <fieldset className='animate-fade-left animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-in'>
            <div className='legend-div'>Informações Essenciais</div>
            <div className='flex flex-col space-y-3 mb-2'>
                <div className='flex flex-row space-x-3 mb-2'>
                <div className='flex flex-col w-full'>
                    <FormField
                    name=''
                    render={({field})=>(
                    <FormItem>
                        <label >Cursos<span className='text-red-500'>*</span></label>
                        <FormControl>
                    <select {...field} onChange={(e) => {
                        field.onChange(
                            parseInt(e.target.value, 10),
                            setIdCurso(parseInt(e.target.value, 10) || 0))
                        }}>
                        <option >Selecione o curso</option>
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
                        <label>Classes<span className='text-red-500'>*</span></label>
                        <FormControl>
                        <select {...field} className={errors.classeId?.message && `${animateShake} select-error`}onChange={(e)=>{field.onChange(parseInt(e.target.value))
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
                    <div className='flex flex-row space-x-3 mb-2'>
                    <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name='turmaId'
                    render={({field})=>(
                    <FormItem>
                        <label >Turmas<span className='text-red-500'>*</span></label>
                        <FormControl>
                        <select {...field} className={errors.turmaId?.message && `${animateShake} select-error`}onChange={(e)=>{field.onChange(parseInt(e.target.value))
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
                        <label >Turnos<span className='text-red-500'>*</span></label>
                        <FormControl>
                        <select {...field} className={errors.turmaId?.message && `${animateShake} select-error`}onChange={(e)=>{field.onChange(parseInt(e.target.value))
                            
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
                    <div className="grid grid-cols-2 gap-4 w-full">
                <div className='col-span-1'>
                    <FormField
                    control={form.control}
                    name='metodoId'
                    render={({field})=>(
                    <FormItem>
                        
                        <FormControl>
                        <select {...field} className={errors.metodoId?.message && `${animateShake} select-error`}onChange={(e)=>{field.onChange(parseInt(e.target.value))
                            setIdClasse(parseInt(e.target.value, 10) || 0)
                          }}>
                        <option >Pagar Em<span className='text-red-500'>*</span></option>
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
                </div>
                </fieldset>}
        <div className='w-full flex items-center justify-between'>
        
        {currentStep > 1 && 
    <button type='button' onClick={()=>{
        currentStep === step.length && setComplete(false);
        
        currentStep > 1 && setCurrentStep(prev => prev - 1);
    }} className={`${animatePing} responsive-button bg-gray-700 hover:bg-gray-600 text-white font-semibold border-gray-700`}>Voltar</button>
    }
    
    {(currentStep === step.length) ? <div>{ (!errors.classeId && !errors.turmaId && !errors.turnoId && !errors.metodoId && fieldClasseId && fieldTurmaId && fieldTurnoId && fieldMetodoId) &&
    <button type={(currentStep===step.length && complete) ? 'submit' : 'button'} onClick={()=>{
        currentStep === step.length ?
        setComplete(true) :
        setCurrentStep(prev => prev + 1);
    }} className={`${currentStep === 3 && complete ? `${animateFadeLeft} bg-green-700 hover:bg-green-600 border-green-700`: `${animateFadeLeft}  bg-sky-700 hover:bg-sky-600 border-sky-700`} text-white font-semibold sm:text-sm md:text-[10px] lg:text-[12px] xl:text-[16px]
    py-1 sm:py-[2px] lg:py-1 xl:py-2 `} disabled={!isValid}>{!isValid}Cadastrar</button> }</div>: 
    <button type='button' onClick={()=>{
    const isStep1Valid = !errors.nomeCompleto && !errors.numeroBi && !errors.genero &&
    !errors.telefone && !errors.dataNascimento && !errors.numeroCasa &&
    !errors.bairro && !errors.rua && !errors.nomeCompletoMae && !errors.nomeCompletoPai &&
    fieldNome && fieldBi && fieldGenero && fieldTelefone && fieldDataNascimento &&
    fieldNumeroCasa && fieldBairro && fieldRua && fieldNomeCompleMae && fieldNomeCompletoPai;

  const isResponsavelValid = !Object.values(errors.responsaveis?.[0] || {}).some(Boolean) &&
    fieldRespNome &&
    fieldRespBairro &&
    fieldRespNumeroCasa &&
    fieldRespParentescoId && fieldRespRua &&
    fieldRespTelefone;

  if (isStep1Valid) {
    // Se Step 1 estiver válido, tente ir para Step 2
    if (currentStep === 1) {
      setCurrentStep(2);
    } 
    // Se o Step 2 estiver válido (responsável validado), vá para o Step 3
    else if (currentStep === 2 && isResponsavelValid) {
      setCurrentStep(3);
    }
    // Caso contrário, finalize o formulário se estiver no último Step
    else if (currentStep === step.length) {
      setComplete(true);
    }
  } else {
    // Retorne ao Step 1 caso as condições de validação não estejam atendidas
    setCurrentStep(1);
  }
    }} className={`${animatePing} responsive-button bg-sky-700 hover:bg-sky-600 text-white font-semibold border-sky-700`} >Próximo</button>}

    
        </div>
           </form>
      </Form>
      
      </div>       
      </div>
      
      </div>
      <MostrarDialog show={showDialog} message={dialogMessage} onClose={() => setShowDialog(false)} />

     </div>
 )}</>    
)
}