import * as React from 'react'
import { useEffect } from 'react'
import { AlertCircleIcon, CheckCircleIcon, EditIcon, Info, SaveIcon } from 'lucide-react'
import { FolderOpenIcon } from '@heroicons/react/24/outline'
import Table from './Table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import {FolderOpenIcon as Relatorios} from '@heroicons/react/24/outline';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { InfoIcon } from 'lucide-react'
import { UserPlus } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, 
FormLabel, 
FormMessage} from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver} from '@hookform/resolvers/zod'
import { z } from 'zod'
import {nomeCompletoZod,  dataNascimentoZod, generoZod, numeroBiZod, bairroZod, ruaZod, numeroCasaZod, telefoneZod, emailZod, idZod} from '../_zodValidations/validations'
import { MyDialog, MyDialogContent } from './my_dialog'
import InputMask from 'react-input-mask'

const TForm =  z.object({
    nomeCompleto: nomeCompletoZod,
    nomeCompletoPai: nomeCompletoZod,
    nomeCompletoMae: nomeCompletoZod,
    dataNascimento: dataNascimentoZod,
    genero: generoZod,
    bairro: bairroZod,
    rua: ruaZod,
    numeroCasa: z.number(),
    telefone: telefoneZod,
    email: emailZod,
    id: z.number()
  })

  const TFormConfirmacao =  z.object({
    classeId: idZod,
    cursoId: idZod,
    turmaId: idZod,
    turnoId: idZod,
    metodoPagamentoId: idZod
  })

  type FormProps =  z.infer<typeof TForm>;
  type FormPropsConfirmacao =  z.infer<typeof TFormConfirmacao>;

export default function ListStudent(){
    const form  = useForm<z.infer<typeof TForm>>({
        mode: 'all', 
        resolver: zodResolver(TForm)
       })

    const formConfirmacao  = useForm<z.infer<typeof TFormConfirmacao>>({
        mode: 'all', 
        resolver: zodResolver(TFormConfirmacao),
       })

       const [showModal, setShowModal] = React.useState(false);
       const [modalMessage, setModalMessage] = React.useState('');  
       const [updateTable, setUpdateTable] = React.useState(false)
        const handleSubmitUpdate = async (data: z.infer<typeof TForm>,e) => {
          
          const dados = 	{
            nomeCompleto: data.nomeCompleto,
            nomeCompletoPai: data.nomeCompletoPai,
            nomeCompletoMae: data.nomeCompletoMae,
            dataNascimento: data.dataNascimento,
            genero: data.genero,
            endereco: {
              bairro: data.bairro,
              rua: data.rua,
              numeroCasa: data.numeroCasa
            },
            contacto: {
              telefone: data.telefone,
              email: data.email
            }
          }
          await fetch(`http://localhost:8000/api/alunos/${data.id}`,{
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(dados)
              })
              .then((resp => resp.json()))
              .then((resp) =>{ 
                setShowModal(true);
                if (resp.message != null) {
                  setModalMessage(resp.message);  
                }else{
                  setModalMessage(resp.message);
                }
                //console.log(resp);
              })
              .catch((error) => console.log(`error: ${error}`))
              setUpdateTable(!updateTable)
          }

      const[idAluno, setIdAluno] = React.useState([]);
      const handleSubmitCreateConfirmacao = async (data: z.infer<typeof TFormConfirmacao>,e) => {
        await fetch(`http://localhost:8000/api/alunos/${idAluno}/matriculas`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then((resp => resp.json()))
            .then((resp) =>{  
                  setShowModal(true);  
                  if (resp.message != null) {
                  setModalMessage(resp.message);  
                }else{
                  setModalMessage(resp.message);
                }
               // console.log(resp)
            })
            .catch((error) => console.log(`error: ${error}`))
            setUpdateTable(!updateTable)
        }

    const[buscar, setBuscar] = React.useState(2);
    const[nome, setNome] = React.useState();
    const[pai, setPai] = React.useState();
    const[mae, setMae] = React.useState();
    const[bi, setBi] = React.useState();
    const[nasc, setNasc] = React.useState();
    const[genero,setGenero] = React.useState();
    const[bairro,setBairro] = React.useState();
    const[rua,setRua] = React.useState();
    const[casa,setCasa] = React.useState();
    const[telefone,setTelefone] = React.useState();
    const[email,setEmail] = React.useState();
    const[estado, setEstado] = React.useState(false);
    const[aluno, setAluno] = React.useState([])
    React.useEffect(()=>{
        const search = async () => {
            const resp = await fetch(`http://localhost:8000/api/alunos/${buscar}`);
            const receve = await resp.json()
            const conv = JSON.stringify(receve)
            const conv1 = JSON.parse(conv)
            setAluno(conv1)
            console.log(Object.values(Object.values(aluno)[7])[0])
            console.log(aluno)
            setNome(receve.nomeCompleto)
            setPai(receve.nomeCompletoPai)
            setMae(receve.nomeCompletoMae)
            setBi(receve.numeroBi)
            setNasc(receve.dataNascimento)
            setGenero(receve.genero)
            setBairro(receve.endereco.bairro)
            setRua(receve.endereco.rua)
            setCasa(receve.endereco.numeroCasa)
            setTelefone(receve.contacto.telefone)
            setEmail(receve.contacto.email)
            setEstado(true)
            
        }
        search()
    },[buscar])


  /*Área q implementa o código pra pesquisar cursos*/
const [metodo, setMetodo] = React.useState([]);
const [ano, setAno] = React.useState([]);
const [classe, setClasse] = React.useState([]);
const [turma, setTurma] = React.useState([]);
const [turno, setTurno] = React.useState([]);
const [idCurso, setIdCurso] = React.useState(0);
const [idClasse, setIdClasse] = React.useState(0);
const [dataApiCursos, setDataApiCursos] = React.useState([]);
const URLCURSO = "http://localhost:8000/api/cursos"
const URLPAGAMENTO = "http://localhost:8000/api/metodos-pagamento"
const URLLECTIVO = "http://localhost:8000/api/ano-lectivos"
const URLCLASSE = `http://localhost:8000/api/cursos/${idCurso}/classes`
const URLTURMA = `http://localhost:8000/api/classes/${idClasse}/turmas`
const URLTURNO = `http://localhost:8000/api/turnos/`
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
          //Buscar Classes
          const respclasse = await fetch (URLCLASSE);
          const respclasseJson = await respclasse.json();
          const convclasse1 = JSON.stringify(respclasseJson.data)
          const convclasse2 = JSON.parse(convclasse1)
          setClasse(convclasse2)
          //Buscar Turmas
          const respturma = await fetch (URLTURMA);
          const respturmaJson = await respturma.json();
          const convturma1 = JSON.stringify(respturmaJson.data)
          const convturma2 = JSON.parse(convturma1)
          setTurma(convturma2)
         // console.log(convturma2)
          //Buscar Turnos
          const respturno = await fetch (URLTURNO);
          const respturnoJson = await respturno.json();
          const convturno1 = JSON.stringify(respturnoJson.data)
          const convturno2 = JSON.parse(convturno1)
          setTurno(convturno2)
         // console.log(convturno2)
          
    } 
     respFetchCursos()
},[idCurso, idClasse])

  const changeResource=(id)=>{
        setBuscar(id)
    }

    const columns = 
    [
    { 
        name: 'Id',
        selector: row => row.id,
        sortable:true,
        sortField: "id"
     },
    { 
        name: 'Nome',
        selector: row => row.nomeCompleto,
        sortable:true,
        sortField: "nome"
     },
    { 
        name: 'Número de Bi',
        selector: row => row.numeroBi,
        sortable:true
    },
    { 
        name: 'Data de Nascimento',
        selector: row => row.dataNascimento,
        sortable:true
    },
    {
        name: 'Ação',
        cell: (row) => (<div  className='flex flex-row  cursor-pointer space-x-2' onClick={()=>{
          changeResource(row.id)
          if(estado){
            form.setValue('nomeCompleto', nome)
            form.setValue('genero', genero)
            form.setValue('dataNascimento', nasc)
            form.setValue('nomeCompletoPai', pai)
            form.setValue('nomeCompletoMae', mae)
            form.setValue('bairro', bairro)
            form.setValue('rua', rua)
            form.setValue('numeroCasa', parseInt(casa))
            form.setValue('telefone', telefone)
            form.setValue('email', email)
            form.setValue('id', row.id)
            setIdAluno(row.id)
            setEstado(false)
          }
          
          }}>
             <Dialog >
    <DialogTrigger asChild >
    <div title='actualizar' className='relative flex justify-center items-center' >
    <EditIcon className='w-5 h-4 absolute text-white font-extrabold'/>
      <Button className='h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm'  ></Button>
      </div>
      
    </DialogTrigger>
    <DialogContent className="sm:max-w-[645px] overflow-y-scroll h-[640px] bg-white">
      <DialogHeader>
        <DialogTitle>Actualização do Registro</DialogTitle>
        <DialogDescription>
        Actualiza o registro {genero == 'M' ? 'do aluno' : 'da aluna' } aqui.
        </DialogDescription>
      </DialogHeader>
     
      <Form {...form} >
     <form onSubmit={form.handleSubmit(handleSubmitUpdate)} >
     <div className="w-full flex flex-col justify-between  ">
     <FormField
          control={form.control}
          name="id"
          render={({field})=>(
            <FormControl>
          <Input 
          type='hidden'
            className="w-full"
            
            {...field} 
            
            onChange={(e)=>{field.onChange(parseInt( e.target.value))}}
           
          />
          </FormControl>
        )}
           />
        <fieldset>
            <legend className='font-robotoSlab text-sm'>Dados Pessoal</legend>
            <div className='w-full flex flex-col '>
            <div className="w-full flex flex-row justify-between space-x-2 ">
            <div className='w-full'>
          <Label htmlFor="name" className="text-right">
            Nome 
          </Label>
          <FormField
          control={form.control}
          name="nomeCompleto"
          render={({field})=>(
            <FormItem>
            <FormControl>
          <Input 
            className="w-full"
            
            {...field} 
            
          />
          </FormControl>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}
           />
        </div>
        <div className='w-full'>
          <Label htmlFor="genero" className="text-right">
            Gênero
          </Label>
         
            <FormField
          control={form.control}
          name="genero"
          render={({field})=>(
            <FormItem>
            <FormControl>
          <select {...field} id='genero' className='w-full py-3 bg-white border-gray-3s00 rounded-md'>
              <option value="M">M</option>
              <option value="F">F</option>
          </select>
          </FormControl>
           <FormMessage className='text-red-500 text-xs'/>
           </FormItem>
        )}/></div></div>
        <div className="flex w-full flex-col text-left">
        <Label htmlFor="nasc" >
            Data de nascimento
          </Label>
         
            <FormField
          control={form.control}
          name="dataNascimento"
          render={({field})=>(
           <FormControl>
          <FormItem>
          <Input type='date' max="2010-01-01" min="1960-01-01" id="nasc" {...field} className="w-full"/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>

        )}/>
          </div>
        <div className="w-full flex flex-row justify-between space-x-2">
        <div className='w-full'>
          <Label htmlFor="pai" className="text-right">
            Nome do pai
          </Label>
         
            <FormField
          control={form.control}
          name="nomeCompletoPai"
          render={({field})=>(
            <FormControl>
                <FormItem>
          <Input id="pai" type='text' {...field} className="w-full"/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/></div>
        <div className='w-full'>
          <Label htmlFor="mae" className="text-right">
            Nome da mãe
          </Label>
         
            <FormField
          control={form.control}
          name="nomeCompletoMae"
          render={({field})=>(
            <FormControl>
            <FormItem>
          <Input id="mae" type='text' {...field} className="w-full"/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/></div></div></div>
        </fieldset>
        <fieldset>
        <legend className='font-robotoSlab text-sm'>
            Localização</legend>
            <div className="w-full flex flex-row justify-between space-x-2">
            <div className='w-full'>
          <Label htmlFor="bairro" className="text-right">
            Bairro
          </Label>
         
            <FormField
          control={form.control}
          name="bairro"
          render={({field})=>(
            <FormControl>
                <FormItem>
          <Input id="bairro" type='text' {...field} className="w-full"/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/></div>
            <div className='w-full'>
          <Label htmlFor="rua" className="text-right">
            Rua
          </Label>
         
            <FormField
          control={form.control}
          name="rua"
          render={({field})=>(
            <FormControl>
        <FormItem>
          <Input id="rua" type='text' {...field} className="w-full"/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/>
        </div>
        <div className='w-full'>
          <Label htmlFor="casa" className="text-right">
            Número da Casa
          </Label>
         
            <FormField
          control={form.control}
          name="numeroCasa"
          render={({field})=>(
            <FormControl>
            <FormItem>
          <Input id="casa" type='number' {...field} className="w-full"  onChange={(e)=>{field.onChange(parseInt( e.target.value))}}/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/>
        </div></div>
        </fieldset>
        <fieldset>
        <legend className='font-robotoSlab text-sm'>
            Contacto</legend>
            <div className="w-full flex flex-row justify-between space-x-2">
        <div className='w-full'>
        <Label htmlFor="tel" className="text-right">
            Telefone
          </Label>
      <FormField
          control={form.control}
          name="telefone"
          render={({field})=>(
            <FormControl>
                <FormItem>
                <InputMask
                mask="999999999"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
            >
                {(inputProps) => (
                    <Input
                        {...inputProps}
                        className={'placeholder-gray-200 placeholder-opacity-55'
                        }
                        type="text"
                    />
                )}
            </InputMask>
           <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/></div>
        <div className='w-full'>
        <Label htmlFor="email" className="text-right">
            @Email
          </Label>
      <FormField
          control={form.control}
          name="email"
          render={({field})=>(
            <FormItem>
            <FormControl>
          <Input
            id="email"
            className="w-full"
          {...field}/>
          </FormControl>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
         </div></div></fieldset>
        </div>
      
      <DialogFooter>
        <Button title='actualizar' className='bg-green-500 border-green-500 text-white hover:bg-green-500 w-12' type='submit'><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
      </DialogFooter>
      </form>
      </Form>
    </DialogContent>
  </Dialog>

  <Dialog >
    <DialogTrigger asChild >
    <div title='confirmação' className='relative flex justify-center items-center' >
    <FolderOpenIcon className='w-5 h-4 absolute text-white font-extrabold'/>
      <button className='h-7 px-5 bg-amber-400 text-white font-semibold hover:bg-amber-400 border-amber-400 rounded-sm' ></button>
      </div>
      
    </DialogTrigger>
    <DialogContent className="sm:max-w-[645px] overflow-y-scroll h-[690px] bg-white">
      <DialogHeader>
        <DialogTitle>Confirmação de Matrícula</DialogTitle>
        <DialogDescription>
        <p>confirma a matrícula {genero == 'M' ? 'do aluno' : 'da aluna'} <span className='font-bold uppercase'>{Object.values(aluno)[1]}</span> n. bi: <span className='font-bold'>{Object.values(aluno)[4]}</span> para o ano corrente, após terminar o preenchimento do formulário click em <span className='font-bold text-blue-500'>nova matrícula</span>.
        </p>
        </DialogDescription>
      </DialogHeader>
     
      <Form {...formConfirmacao} >
     <form onSubmit={formConfirmacao.handleSubmit(handleSubmitCreateConfirmacao)} >
     <fieldset>
            <legend className='bg-blue-600 w-full h-9 pl-2 mr-2 text-white flex items-center'><p>Informações Essenciais</p></legend>
            <div className='flex flex-col space-y-3 mb-5'>
                <div className='flex flex-col'>
                    <FormField
                    control={formConfirmacao.control}
                    name='cursoId'
                    render={({field})=>(
                    <FormItem>
                        <FormLabel>Cursos*</FormLabel>
                        <FormControl>
                        <select {...field} className='w-full py-3 rounded-sm ring-1 ring-gray-300 bg-white text-gray-500 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))
                          setIdCurso(parseInt(e.target.value, 10) || 0)
                        }}>
                      <option >Selecione o curso</option>
                      {
                            dataApiCursos.map((field)=>{
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
                    control={formConfirmacao.control}
                    name='classeId'
                    render={({field})=>(
                    <FormItem>
                        <FormLabel>Classes*</FormLabel>
                        <FormControl>
                          <select {...field} className='w-full py-3 rounded-sm ring-1 ring-gray-300 bg-white text-gray-500 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))
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
                    <div className='flex flex-col w-full'>
                    <FormField
                    control={formConfirmacao.control}
                    name='turmaId'
                    render={({field})=>(
                    <FormItem>
                        <FormLabel>Turmas*</FormLabel>
                        <FormControl>
                        <select {...field} className='w-full py-3 rounded-sm ring-1 ring-gray-300 bg-white text-gray-500 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
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
                    control={formConfirmacao.control}
                    name='turnoId'
                    render={({field})=>(
                    <FormItem>
                        <FormLabel>Turno*</FormLabel>
                        <FormControl>
                        <select {...field} className='w-full py-3 rounded-sm ring-1 ring-gray-300 bg-white text-gray-500 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                        <option >Selecione a turma</option>
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
                <div className='flex flex-col w-full'>
                    <FormField
                    control={formConfirmacao.control}
                    name='metodoPagamentoId'
                    render={({field})=>(
                    <FormItem>
                        <FormLabel>Pagamento em*</FormLabel>
                        <FormControl>
                         <select {...field} className='w-full py-3 rounded-sm ring-1 ring-gray-300 bg-white text-gray-500 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                        <option >Selecione o método</option>
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
                </fieldset>
      
      <DialogFooter>
        <Button title='nova matrícula' className='bg-blue-600 border-blue-600 text-white hover:bg-blue-600 font-semibold w-12' type='submit'><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
      </DialogFooter>
      </form>
      </Form>
    </DialogContent>
  </Dialog> 
  
         <Dialog >
    <DialogTrigger asChild>
    <div title='ver dados' className='relative flex justify-center items-center'>
    <InfoIcon className='w-5 h-4 absolute text-white font-extrabold'/>
      <button className='h-7 px-5 bg-green-600 text-white font-semibold hover:bg-green-600 rounded-sm border-green-600' ></button>
      </div>
      
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <DialogTitle>Informações sobre {row.nomeCompleto}</DialogTitle>
        <DialogDescription >
        As informações relevantes do aluno, são listadas aqui!
        </DialogDescription>
      </DialogHeader>
     
      <div className="grid gap-4 py-4 bg-white">
        <div className="flex flex-col w-full"><fieldset>
            <legend className='font-robotoSlab text-sm'>Dados Pessoal</legend>
            <div className='w-full flex flex-col space-y-3'>
            <div className="w-full flex flex-row justify-between px-2">
            <div>
                <Label className='font-poppins'>nome completo</Label>
                <p className='font-thin text-sm'>{Object.values(aluno)[1]}</p>
            </div>
            <div>
                 <Label className='font-poppins'>número do bi</Label>		
                  <p className='font-thin text-sm'>{Object.values(aluno)[4]}</p>
            </div>
            </div>
            <div className="w-full flex flex-row justify-between px-2">
            <div>
                <Label className='font-poppins'>nome do pai</Label>	
                <p className='font-thin text-sm'>{Object.values(aluno)[2]}</p>
            </div>
            <div>
                <Label className='font-poppins'>nome da mãe</Label>
                <p className='font-thin text-sm'>{Object.values(aluno)[3]}</p>
            </div>
            </div>
            <div className="w-full flex flex-row justify-between px-2">
            <div>
                <Label className='font-poppins'>gênero</Label>
                <p className='font-thin text-sm'>{Object.values(aluno)[6]}</p>
            </div>
            <div>
                <Label className='font-poppins'>data de nascimento</Label>
                <p className='font-thin text-sm'>{Object.values(aluno)[5]}</p>
            </div>
            </div>
            </div>
            
        </fieldset>
        <fieldset>
            <legend className='font-robotoSlab text-sm'>Localização</legend>
            <div className="w-full flex flex-row justify-between px-2">
            <div className="w-full flex flex-row justify-between px-2">
            <div>
                <Label className='font-poppins'>número da casa</Label>
                <p className='font-thin text-sm'>{casa}</p>
            </div>
            <div>
                <Label className='font-poppins'>bairro</Label>
                <p className='font-thin text-sm'>{bairro}</p>
            </div>
            <div>
                <Label className='font-poppins'>rua</Label>
                <p className='font-thin text-sm'>{rua}</p>
            </div>
            </div>
            </div>
        </fieldset>
            <fieldset>
                <legend className='font-robotoSlab text-sm'>Contacto</legend>
            <div className="w-full flex flex-row justify-between px-2">
            <div className="w-full flex flex-row justify-between px-2">
            <div>
                <Label className='font-poppins'>Telefone</Label>
                <p className='font-thin text-sm'>{telefone}</p>
            </div>
            <div>
                <Label className='font-poppins'>email</Label>
                <p className='font-thin text-sm'>{email}</p>
            </div>
            </div>
            </div>
            </fieldset>
            <fieldset>
                <legend className='font-robotoSlab text-sm'>Histórico de matrículas</legend>
            <div className="w-full flex flex-row justify-between px-2">
            <div className="w-full flex flex-row justify-between px-2">
            <div>
                <Label className='font-poppins'>Classe</Label>
                <p className='font-thin text-sm'>10ª</p>
            </div>
            </div>
            </div>
            </fieldset>
            
        </div>
      </div>
      <DialogFooter>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  
        </div>),
    }, 
];
    const [dados, setDados] = React.useState([])
    const [dataApi, setDataApi] = React.useState([])
    const URL = "http://localhost:8000/api/alunos?page_size=21"
   
   useEffect( () => {
        const respFetch = async () => {
              const resp = await fetch (URL);
              const respJson = await resp.json();
              const conv1 = JSON.stringify(respJson.data)
              const conv2 = JSON.parse(conv1)
              setDados(conv2)
              setDataApi(conv2)
              setUpdateTable(false)
        } 
         respFetch()
   },[updateTable])

    const handleFilter =  (event) => {
        const newData = dataApi.filter( row => {
            return row.nomeCompleto.toLowerCase().includes(event.target.value.toLowerCase().trim())
        })
        setDados(newData)

    }

    return (
    <>
    <Table title="Lista dos Estudantes" dados={dados} handleFilter={handleFilter} columns={columns}/>
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
    </>)
}