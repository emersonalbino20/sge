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

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { AlertCircleIcon, CheckCircleIcon, EditIcon, Library, PrinterIcon, SaveIcon, Trash} from 'lucide-react'
import { InfoIcon, AlertTriangle, Search } from 'lucide-react'
import { GraduationCap as Cursos } from 'lucide-react';
import {anoLectivo, classe, anoLectivoId, cursoId, custoMatricula, sala } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm} from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MyDialog, MyDialogContent } from './my_dialog'
import { table } from 'console'
import { tdStyle, thStyle, trStyle, tdStyleButtons } from './table'
import { Link } from 'react-router-dom'
import Header from './Header'
import { animateBounce, animateShake } from '@/AnimationPackage/Animates'
import MostrarDialog from './MostrarDialog';

const TFormCreate =  z.object(
{
  nome: classe,
  cursoId: cursoId,
  valorMatricula: custoMatricula
})

const TFormUpdate =  z.object({
  nome: classe,
  cursoId: cursoId,
  valorMatricula: custoMatricula,
  id: z.number()
})


const TFormCreateClass =  z.object(
  {
    nome: sala,
    classeId: z.number(),
    salaId: z.number(),
    turnoId: z.number()
  })

  const TFormUpdateClass =  z.object({
    nome: sala,
    classeId: z.number(),
    salaId: z.number(),
    turnoId: z.number(),
    id: z.number()
  })

export default function Grade(){

const formCreate  = useForm<z.infer<typeof TFormCreate>>({
  mode: 'all', 
  resolver: zodResolver(TFormCreate)
})

const formUpdate  = useForm<z.infer<typeof TFormUpdate>>({
  mode: 'all', 
  resolver: zodResolver(TFormUpdate)
  })

const formCreateClass  = useForm<z.infer<typeof TFormCreateClass>>({
  mode: 'all', 
  resolver: zodResolver(TFormCreateClass)
})

const formUpdateClass  = useForm<z.infer<typeof TFormUpdateClass>>({
  mode: 'all', 
  resolver: zodResolver(TFormUpdateClass)
  })

const [updateTable, setUpdateTable] = React.useState(false)
const[estado, setEstado] = React.useState(false);
const [showDialog, setShowDialog] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState<string | null>(null);
  const handleSubmitCreate = async (data: z.infer<typeof TFormCreate>,e) => {

  await fetch(`http://localhost:8000/api/ano-lectivos/${idAno}/classes`,{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then((resp => resp.json()))
    .then((resp) =>{ 
            
            if (resp.message != null && resp.statusCode != 400) {
              setDialogMessage(resp.message);
              setShowDialog(true);
            }else{
              setDialogMessage(null);
              setShowDialog(true);
            }
            console.log(resp)
    })
    .catch((error) => console.log(`error: ${error}`))
    setUpdateTable(!updateTable)
  }

const handleSubmitUpdate = async (data: z.infer<typeof TFormUpdate>,e) => {

  const dados = {
    nome: data.nome,
    cursoId: data.cursoId,
    valorMatricula: data.valorMatricula 
  }
  await fetch(`http://localhost:8000/api/classes/${data.id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados)
    })
    .then((resp => resp.json()))
    .then((resp) =>{
      
            if (resp.message != null) {
              setDialogMessage(resp.message);
              setShowDialog(true);
            }else{
              setDialogMessage(null);
              setShowDialog(true);
            }
            console.log(resp)
    })
    .catch((error) => console.log(`error: ${error}`))
    setUpdateTable(!updateTable)
}

const handleSubmitCreateClass = async (data: z.infer<typeof TFormCreateClass>,e) => {
      
  await fetch(`http://localhost:8000/api/turmas/`,{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then((resp => resp.json()))
    .then((resp) =>{ 
            
            if (resp.message != null) {
              setDialogMessage(resp.message);
              setShowDialog(true);
            }else{
              setDialogMessage(null);
              setShowDialog(true);
            }
    })
    .catch((error) => console.log(`error: ${error}`))
  }

const[salas,setSalas] = React.useState([]);
const[turnos, setTurnos] = React.useState([]);
const URLSALA = "http://localhost:8000/api/salas"
const URLTURNO = "http://localhost:8000/api/turnos"

React.useEffect(()=>{
  const search = async () => {
      const respSala = await fetch(URLSALA);
      const receveSala = await respSala.json()
      setSalas(receveSala.data)
      const respTurno = await fetch(URLTURNO);
      const receveTurno = await respTurno.json()
      setTurnos(receveTurno.data)
  }
  search()
},[])


const[idAno,setIdAno] = React.useState(0);
const[bNomeCurso, setBNomeCurso] = React.useState([]);
const URLCURSO = `http://localhost:8000/api/cursos/`

React.useEffect(()=>{
    const search = async () => {
        const resp = await fetch(`http://localhost:8000/api/ano-lectivos/`);
        const receve = await resp.json()
        var meuarray = receve.data.find((c)=>{
          return c.activo === true
        })
        setIdAno(meuarray.id)
        
        const respC = await fetch(URLCURSO);
        const receveC = await respC.json()
        setBNomeCurso(receveC.data)
        setEstado(true)
    }
    search()
},[])

const[buscar, setBuscar] = React.useState();
const [dados, setDados] = React.useState([])
const [dataApi, setDataApi] = React.useState([])

const URLCLASSE = `http://localhost:8000/api/ano-lectivos/${idAno}/classes`
React.useEffect(()=>{
  const search = async () => {
      const resp = await fetch(URLCLASSE);
      const receve = await resp.json()
      let nArray = Object.values(receve.data.cursos)
      setDataApi(nArray);}
  search()
},[idAno])

const[cAll,setCAll] = React.useState([]);
const[cursoId, setCursoId] = React.useState(0);
React.useEffect(()=>{
  const search = async () => {
      const resp = await fetch(URLCLASSE);
      const receve = await resp.json()
      const conv1 = JSON.stringify(receve.data)
      const conv2 = JSON.parse(conv1)
      setCAll(conv2.cursos[cursoId].classes)
}
  search()
},[cursoId])

const [classe, setClasse] = React.useState([])
React.useEffect( ()=>{
  const search = async () =>{
    const resp = await fetch(`http://localhost:8000/api/classes/${buscar}/turmas`);
      const receve = await resp.json();
      if(receve.data.length > 0){
        setClasse(receve.data);
      }else{
        setClasse([{id:0, nome:"nenhuma"}]);
      }
      
  }
  search();
}, [buscar])

const changeResource = (id)=>{
  setBuscar(id)
}

    const handleFilter =  (event) => {
        const curso = dataApi.find(curso => curso.nome === event.target.value);
        if(curso)
        {
          let i = curso.classes.map( classe =>
            {
              return classe;
            })
           
            i.sort((a, b) => a.nome.localeCompare(b.nome))
            setDados(i)
        }
        console.log(curso)
    }
    const columns = ['Id', 'Classes', 'Acção'];

    return (
      <>
      { idAno == 0 ? <div className='w-screen min-h-screen bg-scroll bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300 flex items-center justify-center'>
      <div className='w-full text-center text-4xl text-red-600 md:text-2xl lg:text-2xl'>
          <div>
          <AlertTriangle className={`${animateBounce} inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12`}/>
              <p className='text-red-500'>SELECIONE O ANO LECTIVO</p>
              <p className='text-red-500 italic font-semibold text-sm cursor-pointer'><Link to={'/AcademicYearPage'}>Selecionar agora</Link></p>
          </div>
      </div>
        </div> : (
      <div className="m-0 w-screen h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300  grid-flow-col grid-cols-3">
      <Header />
      <div className='flex flex-col space-y-2 justify-center items-center w-full'>
        <div className='animate-fade-left animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-in flex flex-col space-y-2 justify-center w-[90%] z-10'>
       <div className='flex flex-row space-x-2'>
         <div className='relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96'>
             <select className='pl-3'  onChange={handleFilter} >
              <option>Selecione o curso</option>
              {
                  dataApi.map((field)=>{
                      return <option>{field.nome}</option>
                  })
              }
        </select>
         </div>
         <Dialog>
    <DialogTrigger asChild>
    <div title='cadastrar classe' className='relative flex justify-center items-center'>
    <Cursos className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
      <Button className='h-9 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-500 rounded-sm'></Button>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
      <DialogTitle className='text-blue-600 text-xl'>Cadastrar Classe</DialogTitle>
        <DialogDescription>
            <p className='text-base text-gray-800'>
            preencha o formulário do curso e em seguida click em <span className='font-bold text-blue-500'>actualizar</span> quando terminar.
          </p>
        </DialogDescription>
      </DialogHeader>
      <Form {...formCreate} >
     <form onSubmit={formCreate.handleSubmit(handleSubmitCreate)} >
     <div className="flex flex-col w-full py-4 bg-white">
        <div className="w-full">
        <label htmlFor="nome">Nome<span className='text-red-500'>*</span>
              </label>
          <FormField
          control={formCreate.control}
          name="nome"
          render={({field})=>(
            <FormItem>
            <Input
              id="nome"
              type='text' {...field} className={formCreate.formState.errors.nome?.message && `${animateShake} input-error`}
              />
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className="w-full">
        <label htmlFor="custo">Custo<span className='text-red-500'>*</span>
              </label>
          <FormField
          control={formCreate.control}
          name="valorMatricula"
          render={({field})=>(
            <FormItem>
            <Input id="custo" type='number' {...field} className={formCreate.formState.errors.valorMatricula?.message&& `${animateShake} input-error`}
            min="0"
            onChange={(e)=>{field.onChange(parseInt( e.target.value))}}/>
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className="w-full">
        <FormField
          control={formCreate.control}
          name={'cursoId'}
          render={({field})=>(
          <FormItem>
            <label htmlFor="curso">Cursos<span className='text-red-500'>*</span>
              </label>
              <FormControl>
              <select id='curso' {...field} className={
                      formCreate.formState.errors.cursoId?.message && `${animateShake}  select-error`} onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                        <option>Selecione o curso</option>
                        {
                                    bNomeCurso.map((field)=>{
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
      <DialogFooter>
      <Button title='cadastrar' className='bg-blue-500 border-blue-500 text-white hover:bg-blue-500 font-semibold w-12' type='submit'><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
      </DialogFooter>
      </form></Form>
    </DialogContent>
        </Dialog>  
        <Dialog>
    <DialogTrigger asChild>
    <div title='cadastrar turma' className='relative flex justify-center items-center'>
      <Library className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
      <Button className='h-9 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-500 rounded-sm'></Button>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
      <DialogTitle className='text-blue-600 text-xl'>Cadastrar Turma</DialogTitle>
              <DialogDescription>
                <p className='text-base text-gray-800'>
                preencha o formulário e em seguida click em <span className='font-bold text-blue-500'>actualizar</span> quando terminar.
              </p>
              </DialogDescription>
      </DialogHeader>
      <Form {...formCreateClass} >
     <form onSubmit={formCreateClass.handleSubmit(handleSubmitCreateClass)} >
     <div className="flex flex-col w-full py-4 bg-white">
        <div className="w-full">
        <label htmlFor="nome">Nome<span className='text-red-500'>*</span>
              </label>
          <FormField
          control={formCreateClass.control}
          name="nome"
          render={({field})=>(
            <FormItem>
            <Input
              id="nome"
              type='text' {...field} className={formCreateClass.formState.errors.nome?.message && `${animateShake} input-error`} 
              />
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className="w-full">
        <label htmlFor="curso">Cursos<span className='text-red-500'>*</span>
              </label>
              <select   id='curso' onChange={(e)=>{setCursoId(parseInt(e.target.value))}}>
                      <option value="">Selecione o curso</option>
                      {
                            bNomeCurso.map((field)=>{
                                return <option value={`${field.id}`}>{field.nome}</option>
                            })
                      }
                  </select>
        </div>
        <div className="w-full">
            <FormField
              control={formCreateClass.control}
              name={'classeId'}
              render={({field})=>(
              <FormItem>
                 <label htmlFor="classe">Classes<span className='text-red-500'>*</span>
              </label>
                  <FormControl>
                  <select {...field} className={
                      formCreateClass.formState.errors.classeId?.message && `${animateShake}  select-error`} id='classe' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                      <option >Seleciona a classe</option>
                      {
                            cAll.map((field)=>{
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
              
              <div className="w-full">
              <FormField
              control={formCreateClass.control}
              name={'turnoId'}
              render={({field})=>(
              <FormItem>
                 <label htmlFor="turno">Turnos<span className='text-red-500'>*</span>
              </label>
                  <FormControl>
              <select id='turno' {...field} className={
                      formCreateClass.formState.errors.turnoId?.message && `${animateShake}  select-error`} onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                            <option>Selecione o turno</option>
                            {
                                    turnos.map((field)=>{
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
              <div className="w-full">
              <FormField
              control={formCreateClass.control}
              name={'salaId'}
              render={({field})=>(
              <FormItem>
                <label htmlFor="sala">Salas<span className='text-red-500'>*</span>
              </label>
                  <FormControl>
              <select id='sala' {...field} className={
                      formCreateClass.formState.errors.salaId?.message && `${animateShake}  select-error`} onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                            <option>Selecione a sala</option>
                            {
                                    salas.map((field)=>{
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
      <DialogFooter>
      <Button title='cadastrar' className='bg-blue-500 border-blue-500 text-white hover:bg-blue-500 font-semibold w-12' type='submit'><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
      </DialogFooter>
      </form></Form>
    </DialogContent>
      </Dialog>  
     </div>
     <div className="overflow-x-auto overflow-y-auto w-full  h-80 md:h-1/2 lg:h-[500px]">
         
         <table className="w-full bg-white border border-gray-200 table-fixed">
             
             <thead className='sticky top-0 z-10'>
                 <tr className={trStyle}>
                     {columns.map((element, index) =>{ return( <th key={index} className={thStyle} >{element}</th>) })}
                 </tr>
             </thead>
             <tbody >
                 {dados.length == 0 ? (
                 <tr className='w-96 h-32'>
                     <td rowSpan={3} colSpan={3} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                         <div>
                         <AlertTriangle className={`${animateBounce} inline-block triangle-alert`}/>
                              <p className='text-red-500'>Nenum Registro Foi Encontrado</p>
                         </div>
                     </td>
                 </tr>
                 ) : dados.map((item, index) => (
                     <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
                         <td className={tdStyle}>{item.id}</td>
                         <td className={tdStyle}>{item.nome}</td>
                         <td className={tdStyleButtons}    onClick={()=>{
                           changeResource(item.id)
                           if(estado){
                            formUpdate.setValue('id', item.id)
                          }
                          setEstado(false)
                         }}>
                         <Dialog >
          <DialogTrigger asChild>
          <div title='actualizar' className='relative flex justify-center items-center'>
          <EditIcon className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
            <Button  className='h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-500 rounded-sm'></Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                <DialogTitle className='text-blue-600 text-xl'>Actualizar Classe</DialogTitle>
              <DialogDescription>
                <p className='text-base text-gray-800'>
                altere uma informação da classe e em seguida click em <span className='font-bold text-blue-500'>actualizar</span> quando terminar.
              </p>
              </DialogDescription>
                </DialogHeader>
                <Form {...formUpdate} >
              <form onSubmit={formUpdate.handleSubmit(handleSubmitUpdate)} >
            
              <div className="flex flex-col w-full py-4 bg-white">
                <div className="w-full">
                <label htmlFor="nome">Nome<span className='text-red-500'>*</span>
              </label>
                <FormField
                control={formUpdate.control}
                name="nome"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="nome"
                    type='text' {...field} className={formUpdate.formState.errors.nome?.message && `${animateShake} input-error`}
                    />
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>
              </div>
              <div className="w-full">
          <label htmlFor="custo"className='text-blue-500 text-lg font-semibold'>Custo<span className='text-red-500'>*</span>
          </label>
          <FormField
          control={formUpdate.control}
          name="valorMatricula"
          render={({field})=>(
            <FormItem>
            <Input id="custo" type='number' {...field} className={formUpdate.formState.errors.valorMatricula?.message && `${animateShake} input-error`}
            min="0"
            onChange={(e)=>{field.onChange(parseInt( e.target.value))}}/>
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
              <div className="w-full">
        <FormField
          control={formUpdate.control}
          name={'cursoId'}
          render={({field})=>(
          <FormItem>
           <label htmlFor="curso"className='text-blue-500 text-lg font-semibold'>Cursos<span className='text-red-500'>*</span>
              </label>
              <FormControl>
              <select id='curso' {...field} className={
                      formUpdate.formState.errors.cursoId?.message && `${animateShake}  select-error`} onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                <option>Selecione o curso</option>
                {
                    bNomeCurso.map((field)=>{
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
      <DialogFooter>
      <Button title='actualizar' className='bg-green-500 border-green-500 text-white hover:bg-green-500 font-semibold w-12' type='submit'><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
      </DialogFooter>
      </form></Form>
    </DialogContent>
                         </Dialog>
                         <div title='ver dados' className='relative flex justify-center items-center cursor-pointer'>
                                
                                <Popover >
                          <PopoverTrigger asChild className='bg-white'>

                          <div title='ver turmas' className='relative flex justify-center items-center cursor-pointer'>  <InfoIcon className='w-5 h-4 absolute text-white'/> 
                            <Button  className='h-7 px-5 bg-green-600 text-white font-semibold hover:bg-green-500 rounded-sm border-green-600'></Button>
                            </div>
                          </PopoverTrigger >
                          <PopoverContent className="w-80 bg-white">
                            <div className="grid gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium leading-none text-gray-800">Dados do Curso</h4>
                                <p className="text-sm text-muted-foreground">
                                  Ver todas as turmas do curso.
                                </p>
                              </div>
                              <div className="grid gap-2">
                             
                                  <label htmlFor="height">Turmas</label>
                                  <ul className='flex flex-row space-x-2'>
                                  {classe && (classe.map((nome, id)=>{return <li key={id}>{nome.nome},</li>}))}
                                  </ul>
                                </div>
                              </div>
                           
                          </PopoverContent>
                        </Popover>
                          </div>
                         </td>
                     </tr>
                 ))}
             </tbody>
             <tfoot className='sticky bottom-0 bg-white"'>
             <tr>
                 <td colSpan={3} className="py-2 text-blue-500">
                     Total de registros: {dados.length}
                 </td>
             </tr>
         </tfoot>
         </table>
     </div>
    </div>
     </div>

     <MostrarDialog show={showDialog} message={dialogMessage} onClose={() => setShowDialog(false)} />
    </div>
        )}</>
)
}