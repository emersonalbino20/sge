'use client'
import * as React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusIcon } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver} from '@hookform/resolvers/zod'
import {nomeCompletoZod,  dataNascimentoZod, generoZod, numeroBiZod, bairroZod, ruaZod, numeroCasaZod, telefoneZod, emailZod, idZod} from '../_zodValidations/validations'

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
    anoId: z.number(),
    metodoId: z.number(),
    turmaId: z.number(),
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
    numeroCasa: 1,
    responsaveis:
        [{
        nomeCompleto: '',
        parentescoId: 0,
        endereco: {
                bairro: '',
                rua: '',
                numeroCasa: 1
        },
        contacto: {
            telefone: '',
            email: ''
        }        
    }]
}
})
const {control, setError, formState:{ errors }} = form;
//use of useFieldArray to create dynamic fields
const { fields, append, remove } =
    useFieldArray({
        name: 'responsaveis',
        control
    })

/*Área q implementa o código pra pesquisar cursos*/
const [dataCursos, setDataCursos] = React.useState([]);
const [nomeCurso, setNomeCurso] = React.useState([]);
const [metodo, setMetodo] = React.useState([]);
const [ano, setAno] = React.useState([]);
const [idCurso, setIdCurso] = React.useState();
const [dataApiCursos, setDataApiCursos] = React.useState([]);
const URLCURSO = "http://localhost:8000/api/cursos"
const URLPAGAMENTO = "http://localhost:8000/api/metodos-pagamento"
const URLLECTIVO = "http://localhost:8000/api/ano-lectivos"
React.useEffect( () => {
    const respFetchCursos = async () => {
          const resp = await fetch (URLCURSO);
          const respJson = await resp.json();
          const conv1 = JSON.stringify(respJson.data)
          const conv2 = JSON.parse(conv1)
          setDataApiCursos(conv2)
          //Buscar Métodos de pagamento
          const resppay = await fetch (URLPAGAMENTO);
          const resppayJson = await resppay.json();
          const convpay1 = JSON.stringify(resppayJson.data)
          const convpay2 = JSON.parse(convpay1)
          setMetodo(convpay2);
          //Buscar Ano Lectivos
          const resplectivo = await fetch (URLLECTIVO);
          const resplectivoJson = await resplectivo.json();
          const convlectivo1 = JSON.stringify(resplectivoJson.data)
          const convlectivo2 = JSON.parse(convlectivo1)
          setAno(convlectivo2);
          
    } 
     respFetchCursos()
},[])

const handleFilterCurses =  (event) => {
    const newData = dataApiCursos.filter( row => {
        return row.nome.toLowerCase().includes(event.target.value.toLowerCase().trim())
    })
    setDataCursos(newData[0]);
    setNomeCurso(newData[0].nome);
    setIdCurso(newData[0].id);            
}

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
        },
        classeId: dados.classeId,
        cursoId: idCurso,
        turmaId: dados.turmaId,
        metodoPagamentoId: dados.metodoId,
        anoLectivoId: dados.anoId
      }
    await fetch('http://localhost:8000/api/matriculas',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then((resp => resp.json()))
        .then((resp) =>{ 
            setShowModal(true);
            setModalMessage(resp.message);
           console.log(resp.message);
        }
        )
        .catch((error) => console.log(`error: ${error}`))
        console.log(data)
    }

return(
    <div className='flex flex-col h-screen w-full p-3 pt-36'>
    <fieldset className='flex flex-col justify-center  bg-slate-700 md:bg-gray-300'>
        <h1 className=' font-poppins text-h1         text-center font-bold text-white md:text-slate-700'>
        Matrícula de Estudante
        </h1>
</fieldset>
<Form {...form} >
        <form onSubmit={form.handleSubmit(handleSubmitCreate)} >
    <Tabs defaultValue="entrada" className="w-full flex items-center flex-col">
  <TabsList>
    <TabsTrigger value="entrada">Dados de Entrada</TabsTrigger>
    <TabsTrigger value="juridico">Dados juridicos</TabsTrigger>
  </TabsList>
  <TabsContent value="entrada" className='w-[900px] flex flex-col '> 
        <div className='flex flex-col '>
        <fieldset >
            <legend className='bg-blue-600 w-full h-9 pl-2 mr-2 text-white flex items-center'><p>Informações do Aluno</p></legend>
            <div className='flex flex-col space-y-3 mb-5'>
                <div className='flex flex-col'>
                    <FormField
                    control={form.control}
                    name="nomeCompleto"
                    render={({field})=>(
                    <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                        {errors.nomeCompleto?.message ?
                        <Input className='text-red-400 border-red-500 focus:border-red-500' type='text' {...field} />
                        :
                        <Input type='text' {...field} />
                        }
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                        
                    )}
                    />
                </div>
                <div className='flex flex-col'>
                    <FormField
                    control={form.control}
                    name="numeroBi"
                    render={({field})=>(
                    <FormItem>
                        <FormLabel>Número do BI</FormLabel>
                        <FormControl>
                        {errors.numeroBi?.message ?
                        <Input className='text-red-400 border-red-500 focus:border-red-500' type='text' {...field} />
                        :
                        <Input  type='text' {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        {errors.email?.message ?
                        <Input className='text-red-400 border-red-500 focus:border-red-500' type='email' {...field} />
                        :
                        <Input  type='email' {...field} />
                        }
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
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                        {errors.telefone?.message ?
                        <Input className='text-red-400 border-red-500 focus:border-red-500 ' type='text' {...field} />
                        :
                        <Input className='placeholder-gray-200 placeholder-opacity-55' type='text' {...field} />
                        }
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                    )}
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
                    {errors.dataNascimento?.message ?
                        <Input type='date' className='text-red-400 border-red-500 focus:border-red-500' {...field} max="2010-01-01" min="1960-01-01"/>
                        :
                        <Input  type='date' max="2010-01-01" min="1960-01-01" {...field} />
                        }
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
                    <FormLabel>Gênero</FormLabel>
                    <FormControl>
                    {errors.genero?.message ?
                     <select {...field} className='w-full py-3 rounded-md ring-1 bg-white text-red-400 ring-red-500 focus:ring-red-500 pl-3'>
                        <option>Selecione o gênero</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                    </select>
                        :
                     <select {...field} className='w-full py-3 rounded-md ring-1 bg-white text-gray-500 ring-gray-300 pl-3'>
                        <option>Selecione o gênero</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                    </select>
                        }
                    
                    </FormControl>
                    <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
                )}
                />
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
                        {errors.numeroCasa?.message ?
                        <Input type='number' className='text-red-400 border-red-500 focus:border-red-500 placeholder-red-400'  min={0} {...field} onChange={(e)=>{ field.onChange(parseInt(e.target.value))}} />
                        :
                        <Input type='number' min={1} {...field} onChange={(e)=>{ field.onChange(parseInt(e.target.value))}} />
                        }
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
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                        {errors.bairro?.message ?
                        <Input type='text' className='text-red-400 border-red-500 focus:border-red-500 placeholder-red-400' {...field}/>
                        :
                        <Input type='text' {...field}/>
                         }
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
                        <FormLabel>Rua</FormLabel>
                        <FormControl>
                        {errors.rua?.message ?
                        <Input type='text' className='text-red-400 border-red-500 focus:border-red-500 placeholder-red-400' {...field}/>
                        :
                        <Input type='text' {...field}/>
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
                    name="nomeCompletoPai"
                    render={({field})=>(
                    <FormItem>
                        <FormLabel>Nome do Pai</FormLabel>
                        <FormControl>
                        {errors.nomeCompletoPai?.message ?
                        <Input type='text' className='text-red-400 border-red-500 focus:border-red-500 placeholder-red-400' {...field}/>
                        :
                        <Input type='text' {...field}/>
                         }
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
                        <FormLabel>Nome da Mãe</FormLabel>
                        <FormControl>
                        {errors.nomeCompletoMae?.message ?
                        <Input type='text' className='text-red-400 border-red-500 focus:border-red-500 placeholder-red-400' {...field}/>
                        :
                        <Input type='text' {...field}/>
                         }
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                    )}
                    />
                </div>
            </div>
            </fieldset>
                {
                fields.map((field, index) => {
                    return <fieldset key={field.id}>
                        <legend className='bg-blue-600 w-full h-9 pl-2 mr-2 text-white flex items-center'><p>Informações do Encarregado</p></legend>
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
                                    <FormLabel>Nome Completo</FormLabel>
                                    <FormControl>
                                    {errors.responsaveis?.message ?
                                    <Input type='text' 
                                    className='text-red-400 border-red-500 focus:border-red-500 placeholder-red-400' {...field}/>
                                    :
                                    <Input type='text' {...field}/>
                                    }
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
                                <FormLabel>Parentesco</FormLabel>
                                <FormControl>
                                <Select onValueChange={(value) => field.onChange(parseInt(value, 10))}>
                                    <SelectTrigger className='text-black bg-white mt-0 border-gray-300 rounded-sm'>
                                        <SelectValue placeholder="Seleciona o grau"  {...field} />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white'>
                                    {
                                    parentesco.map((field)=>{
                                        return <SelectItem value={`${field.id}`}>{field.nome}</SelectItem>
                                    })
                                }
                                    </SelectContent>
                                 </Select>
                                </FormControl>
                                <FormMessage className='text-red-500 text-xs'/>
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
                            name={`responsaveis.${index}.contacto.telefone`}
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                <Input type='text' {...field} />
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
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                    <Input type='text' {...field} />
                                    </FormControl>
                                    <FormMessage className='text-red-500 text-xs'/>
                                </FormItem>
                                )}
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
                            name={`responsaveis.${index}.endereco.numeroCasa`}
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Número de Casa</FormLabel>
                                <FormControl>
                                <Input type='number' min={1} {...field}  onChange={(e)=>{ field.onChange(parseInt(e.target.value))}}/>
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
                            <FormLabel>Bairro</FormLabel>
                            <FormControl>
                            <Input type='text' {...field} />
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
                        <FormLabel>Rua</FormLabel>
                        <FormControl>
                        <Input type='text' {...field} />
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
                </fieldset>
            
                </fieldset>
                    })
                    }  
                    {fields.length < 3 &&(
                    <div className='w-full flex items-center justify-center mb-4'>
                        <div className=' flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 cursor-pointer hover:bg-blue-800' onClick={()=>{ append({
                            nomeCompleto: '',
                        })}}>
                        <PlusIcon className='text-white h-6 w-6'/>
                        </div>
                    </div>
                )   }             
             
          </div>
      
</TabsContent>
 <TabsContent value="juridico" className='w-[900px]'>
            <fieldset>
            <legend className='bg-blue-600 w-full h-9 pl-2 mr-2 text-white flex items-center'><p>Informações Essenciais</p></legend>
            <div className='flex flex-col space-y-3 mb-5'>
                <div className='flex flex-col'>
                        <FormLabel>Persquisar Cursos</FormLabel>
                        <Input type='text'
                        placeholder='search by...'
                        onChange={handleFilterCurses}/>
                    <p className='text-blue-500 italic font-bold'>{nomeCurso}</p>
                </div>
                <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name='classeId'
                    render={({field})=>(
                    <FormItem>
                        <FormLabel>Classes</FormLabel>
                        <FormControl>
                        <Select onValueChange={(value) => field.onChange(parseInt(value, 10))}>
                            <SelectTrigger className='text-black bg-white mt-0 border-gray-300 rounded-sm'>
                                <SelectValue placeholder="Seleciona o grau"  {...field} />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                                <SelectItem value='1'>10ª Classe</SelectItem>
                            </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>)
                    }
                    />
                    </div>
                    <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name='turmaId'
                    render={({field})=>(
                    <FormItem>
                        <FormLabel>Turmas</FormLabel>
                        <FormControl>
                        <Select onValueChange={(value) => field.onChange(parseInt(value, 10))}>
                            <SelectTrigger className='text-black bg-white mt-0 border-gray-300 rounded-sm'>
                                <SelectValue placeholder="Seleciona a turma"  {...field} />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                                <SelectItem value='1'>Turma A</SelectItem>
                            </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>)
                    }
                    />
                    </div>
                    <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name='anoId'
                    render={({field})=>(
                    <FormItem>
                        <FormLabel>Ano Académico</FormLabel>
                        <FormControl>
                        <Select onValueChange={(value) => field.onChange(parseInt(value, 10))}>
                            <SelectTrigger className='text-black bg-white mt-0 border-gray-300 rounded-sm'>
                                <SelectValue placeholder="Seleciona o ano"  {...field} />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                                {
                                    ano.map((field)=>{
                                        return <SelectItem value={`${field.id}`}>{field.nome}</SelectItem>
                                    })
                                }
                            </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>)
                    }
                    />
                    </div>

                    <div className='flex flex-col w-full'>
                    <FormField
                    control={form.control}
                    name='metodoId'
                    render={({field})=>(
                    <FormItem>
                        <FormLabel>Pagamento em:</FormLabel>
                        <FormControl>
                        <Select onValueChange={(value) => field.onChange(parseInt(value, 10))}>
                            <SelectTrigger className='text-black bg-white mt-0 border-gray-300 rounded-sm'>
                                <SelectValue placeholder="Seleciona o método"  {...field} />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                                {
                                    metodo.map((field)=>{
                                        return <SelectItem value={`${field.id}`}>{field.nome}</SelectItem>
                                    })
                                }
                            
                            </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>)
                    }
                    />
                    </div>
                   
                </div>
                </fieldset>
         </TabsContent>
        </Tabs>
        <div className='w-full flex items-center justify-center'>
            <button type='submit' className='w-28 py-1 mb-4 bg-blue-700 text-white ' >Cadastrar</button>  
        </div>
        </form>
      </Form>
      {showModal && 
  <Dialog open={showModal} onOpenChange={setShowModal}>
    <DialogTrigger asChild>
    <div className='relative flex justify-center items-center'>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <DialogTitle>Resposta</DialogTitle>
        <DialogDescription>
          {modalMessage}
        </DialogDescription>
      </DialogHeader>
         </DialogContent>
        </Dialog>
    }
     </div>
     
)
}