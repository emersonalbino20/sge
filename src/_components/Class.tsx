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
import { AlertCircleIcon, CheckCircleIcon, EditIcon, PrinterIcon, SaveIcon, Trash, AlertTriangle, Search} from 'lucide-react'
import { InfoIcon } from 'lucide-react'
import { GraduationCap as Cursos } from 'lucide-react';
import {anoLectivo, classe, anoLectivoId, cursoId, custoMatricula, sala, capacidade, localizacao, terminoturno, inicioturno } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm} from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { MyDialog, MyDialogContent } from './my_dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { tdStyle, thStyle, trStyle, tdStyleButtons } from './table'


const TFormCreate =  z.object(
{
  nome: sala,
  classeId: z.number(),
  salaId: z.number(),
  turnoId: z.number()
})

const TFormUpdate =  z.object({
  nome: sala,
  classeId: z.number(),
  salaId: z.number(),
  turnoId: z.number(),
  id: z.number()
})

export default function Curse(){

const formCreate  = useForm<z.infer<typeof TFormCreate>>({
  mode: 'all', 
  resolver: zodResolver(TFormCreate)
})

const formUpdate  = useForm<z.infer<typeof TFormUpdate>>({
  mode: 'all', 
  resolver: zodResolver(TFormUpdate)
  })

const [updateTable, setUpdateTable] = React.useState(false)
const[estado, setEstado] = React.useState(false);
const [showModal, setShowModal] = React.useState(false);
const [modalMessage, setModalMessage] = React.useState('');

const handleSubmitCreate = async (data: z.infer<typeof TFormCreate>,e) => {
      
await fetch(`http://localhost:8000/api/turmas/`,{
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
  })
  .catch((error) => console.log(`error: ${error}`))
  setUpdateTable(!updateTable)
}

const[buscar, setBuscar] = React.useState();
const[nome, setNome] = React.useState();
const[classe, setClasse] = React.useState();
const[sala, setSala] = React.useState();
const[turno, setTurno] = React.useState();
const[id,setId] = React.useState();

React.useEffect(()=>{
    const search = async () => {
        const resp = await fetch("http://localhost:8000/api/turmas/1");
        const receve = await resp.json()
        setNome(receve.nome)
        setClasse(receve.classeId)
        setSala(receve.salaId)
        setTurno(receve.turnoId)
        setId(receve.id)
        setEstado(true)
    }
    search()
},[buscar])

const handleSubmitUpdate = async (data: z.infer<typeof TFormUpdate>,e) => {
  await fetch(`http://localhost:8000/api/turnos/${data.id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then((resp => resp.json()))
    .then((resp) =>{ console.log(resp)})
    .catch((error) => console.log(`error: ${error}`))
    setUpdateTable(!updateTable)
}



/*Buscar dados da sala, turno*/
const[salas,setSalas] = React.useState([]);
const[turnos, setTurnos] = React.useState([]);
const[curso, setCurso] = React.useState([]);
const[anoId, setAnoId] = React.useState();
const[cursoId, setCursoId] = React.useState(0);
const URLSALA = "http://localhost:8000/api/salas"
const URLTURNO = "http://localhost:8000/api/turnos"
const URLANO = "http://localhost:8000/api/ano-lectivos"
const URLCURSO = "http://localhost:8000/api/cursos"
React.useEffect(()=>{
    const search = async () => {
        const respSala = await fetch(URLSALA);
        const receveSala = await respSala.json()
        const convsala1 = JSON.stringify(receveSala.data)
        const convsala2 = JSON.parse(convsala1)
        setSalas(convsala2)
        const respTurno = await fetch(URLTURNO);
        const receveTurno = await respTurno.json()
        const convTurno = JSON.stringify(receveTurno.data)
        const convTurno2 = JSON.parse(convTurno)
        setTurnos(convTurno2)
        const respAno = await fetch(URLANO);
        const receveAno = await respAno.json()
        const convAno = JSON.stringify(receveAno.data)
        const convAno2 = JSON.parse(convAno)
        convAno2.filter((a) => {if (a.activo == true )return setAnoId(a.id) })
        const respCurso = await fetch(URLCURSO);
        const receveCurso = await respCurso.json()
        const convCurso = JSON.stringify(receveCurso.data)
        const convCurso2 = JSON.parse(convCurso)
        setCurso(convCurso2)
    }
    search()
},[])

/*Buscar dados da Classe*/
const[cAll,setCAll] = React.useState([]);
React.useEffect(()=>{
    const search = async () => {
        const resp = await fetch(`http://localhost:8000/api/ano-lectivos/${anoId}/classes`);
        const receveClasse = await resp.json()
        const convClasse = JSON.stringify(receveClasse.data)
        const convClasse2 = JSON.parse(convClasse)
        setCAll(convClasse2.cursos[cursoId].classes)
      
    }
    search()
},[cursoId])

const changeResource = (id)=>{
  setBuscar(id)
}

    const [dados, setDados] = React.useState([])
    const [dataApi, setDataApi] = React.useState([])
    const one = 1;
    const URL = `http://localhost:8000/api/turmas/${buscar}`
       
       useEffect( () => {
            const respFetch = async () => {
                  const resp = await fetch (URL);
                  const respJson = await resp.json();
                  const conv1 = JSON.stringify(respJson.data)
                  const conv2 = JSON.parse(conv1)
                  setDados(conv2)
                  setDataApi(conv2)
            } 
             respFetch()
       },[updateTable])
    
       const columns = ['Id', 'Turmas', 'Classes', 'Salas', 'Acção'];
        
       const handleFilter = (event) => {
          const valores = dataApi.filter((element) =>{ return (element.nome.toLowerCase().includes(event.target.value.toLowerCase().trim())) });
          setDados(valores)
      }

    return (
      <div className='w-screen min-h-screen bg-scroll bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300 flex items-center justify-center'>
       
      <div className='flex flex-col space-y-2 justify-center w-[90%] z-10 mt-44'> 
       <div className='flex flex-row space-x-2'>
         <div className='relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96'>
             <Search className='absolute text-gray-300'/>            
             <input className=' pl-6 rounded-md border-2 border-gray-400 placeholder:text-gray-400 placeholder:font-bold outline-none py-2 w-full indent-2' type='text' placeholder='Procure por registros...' onChange={handleFilter}/>
         </div>
         <Dialog>
    <DialogTrigger asChild>
    <div title='cadastrar' className='relative flex justify-center items-center'>
    <Cursos className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
      <Button className='h-9 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-500 rounded-sm'></Button>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <DialogTitle>Cadastrar Turma</DialogTitle>
        <DialogDescription>
        <p>preencha o formulário e em seguida click em <span className='font-bold text-blue-500'>cadastrar</span> quando terminar.
        </p>
        </DialogDescription>
      </DialogHeader>
      <Form {...formCreate} >
     <form onSubmit={formCreate.handleSubmit(handleSubmitCreate)} >
     <div className="flex flex-col w-full py-4 bg-white">
        <div className="w-full">
          <Label htmlFor="nome" className="text-right">
            Nome
          </Label>
          <FormField
          control={formCreate.control}
          name="nome"
          render={({field})=>(
            <FormItem>
            <Input
              id="nome"
              type='text' {...field} className="w-full"
              />
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className="w-full">
         <label htmlFor="curso" className="text-right">
                Cursos
              </label>
              <select className='w-full py-3 rounded-sm ring-1 ring-gray-300 bg-white text-gray-500 pl-3'  onChange={(e)=>{setCursoId(parseInt(e.target.value))}}>
                      <option value="">Selecione o curso</option>
                      {
                            curso.map((field)=>{
                                return <option value={`${field.id}`}>{field.nome}</option>
                            })
                      }
                  </select>
        </div>
        <div className="w-full">
            <FormField
              control={formCreate.control}
              name={'classeId'}
              render={({field})=>(
              <FormItem>
                <label htmlFor="classe" className="text-right">
                Classes
              </label>
                  <FormControl>
                  <select {...field} className='w-full py-3 rounded-sm ring-1 ring-gray-300 bg-white text-gray-500 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                      <option value="">Seleciona a classe</option>
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
              control={formCreate.control}
              name={'turnoId'}
              render={({field})=>(
              <FormItem>
                <Label htmlFor="turno" className="text-right">
                Turno
              </Label>
                  <FormControl>
              <select id='turno' {...field} className='w-full py-3 rounded-md ring-1 bg-white text-gray-500 ring-gray-300 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
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
              control={formCreate.control}
              name={'salaId'}
              render={({field})=>(
              <FormItem>
                <Label htmlFor="sala" className="text-right">
                Sala
              </Label>
                  <FormControl>
              <select id='sala' {...field} className='w-full py-3 rounded-md ring-1 bg-white text-gray-500 ring-gray-300 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
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
                     <td rowSpan={5} colSpan={5} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                         <div>
                             <AlertTriangle className="inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12"/>
                             <p>Nenum Registro Foi Encontrado</p>
                         </div>
                     </td>
                 </tr>
                 ) : dados.map((item, index) => (
                     <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
                         <td className={tdStyle}>{item.id}</td>
                         <td className={tdStyle}>{item.nome}</td>
                         <td className={tdStyle}>{item.classe}</td>
                         <td className={tdStyle}>{item.sala}</td>
                         <td className={tdStyleButtons}    onClick={()=>{
                           changeResource(item.id)
                           if (estado)
                            {
                              formUpdate.setValue('nome', nome)
                              formUpdate.setValue('salaId', sala)
                              formUpdate.setValue('classeId', classe)
                              formUpdate.setValue('turnoId', turno)
                              formUpdate.setValue('id', item.id)
                              setEstado(false);
                            }
                          setEstado(false)
                         }}>
                          <Dialog >
          <DialogTrigger asChild >
          <div title='actualizar' className='relative flex justify-center items-center'>
          <EditIcon className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
            <Button  className='h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-500 rounded-sm'></Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                  <DialogTitle>Actualizar Turma</DialogTitle>
                  <DialogDescription>
                  <p>altere uma informação do registro click em <span className='font-bold text-green-500'>actualizar</span> quando terminar.</p>
                  </DialogDescription>
                </DialogHeader>
                <Form {...formUpdate} >
              <form onSubmit={formUpdate.handleSubmit(handleSubmitUpdate)} >
              <FormField
          control={formUpdate.control}
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
  
              <div className="flex flex-col w-full py-4 bg-white">
                <div className="w-full">
                <Label htmlFor="nome" className="text-right">
                  Nome
                </Label>
                <FormField
                control={formUpdate.control}
                name="nome"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="nome"
                    type='text' {...field} className="w-full"
                    />
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>
              </div>
              <div className="w-full">
                <Label htmlFor="classe" className="text-right">
                  Id da Classe
                </Label>
                <FormField
                control={formUpdate.control}
                name="classeId"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="classe"
                    type='number' {...field} className="w-full"
                    min="0"
                    onChange={(e)=>{field.onChange(parseInt( e.target.value))}}/>
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>
              </div>
              <div className="w-full">
              <Label htmlFor="turno" className="text-right">
                  Id do Turno
                </Label>
                <FormField
                control={formUpdate.control}
                name="turnoId"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="turno"
                    type='number' {...field} className="w-full"
                    min="0"
                    onChange={(e)=>{field.onChange(parseInt( e.target.value))}}/>
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>               
              
              </div>
              <div className="w-full">
              <Label htmlFor="sala" className="text-right">
                  Id da Sala
                </Label>
                <FormField
                control={formUpdate.control}
                name="salaId"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="sala"
                    type='number' {...field} className="w-full"
                    min="0"
                    onChange={(e)=>{field.onChange(parseInt( e.target.value))}}/>
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>               
              
              </div>
      </div>
      <DialogFooter>
      <Button title='actualizar' className='bg-green-500 border-green-500 text-white hover:bg-green-500 font-semibold w-12' type='submit'><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
      </DialogFooter>
      </form></Form>
    </DialogContent>
                          </Dialog>
 
                          <div className='relative flex justify-center items-center cursor-pointer'>
                        
                          <Popover >
                    <PopoverTrigger asChild className='bg-white'>

                    <div title='ver dados' className='relative flex justify-center items-center cursor-pointer'>  <InfoIcon className='w-5 h-4 absolute text-white'/> 
                      <Button  className='h-7 px-5 bg-green-600 text-white font-semibold hover:bg-green-500 rounded-sm border-green-600'></Button>
                      </div>
                    </PopoverTrigger >
                    <PopoverContent className="w-80 bg-white">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Dados da Sala</h4>
                          <p className="text-sm text-muted-foreground">
                            Inspecione os dados
                          </p>
                        </div>
                        <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="maxWidth">Classe</Label>
                            <p>{classe}</p>
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="maxWidth">Sala</Label>
                            <p>{sala}</p>
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="height">Turno</Label>
                            <p className='text-xs'>{turno}</p>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                          </div>
                          <div title='excluir' className='relative flex justify-center items-center cursor-pointer' ><Trash className='w-5 h-4 absolute text-white'/> <button className='py-3 px-5 rounded-sm bg-red-600  border-red-600'></button>
                          </div>
                         </td>
                     </tr>
                 ))}
             </tbody>
             <tfoot className='sticky bottom-0 bg-white"'>
             <tr>
                 <td colSpan={5} className="py-2 text-blue-500">
                     Total de registros: {dados.length}
                 </td>
             </tr>
         </tfoot>
         </table>
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
   <p className='uppercase'>Operação foi bem sucedida!</p>
   <div className=' bottom-0 py-2 flex flex-col items-end justify-end border-t w-full border-green-400'>
     <Button className='bg-green-400 hover:bg-green-500
     hover:font-medium
     text-md border-green-400 font-medium h-9 w-20' onClick={() => setShowModal(false)}>Fechar</Button>
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
   <p className='uppercase'>{modalMessage}</p>
   <div className='bottom-0 py-2 flex flex-col items-end justify-end border-t w-full border-red-400'>
     <Button className='hover:bg-red-500 bg-red-400 hover:font-medium text-md border-red-400 font-medium h-9 w-20' onClick={() => setShowModal(false)}>Fechar</Button>
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