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
  MyDialog,
  MyDialogContent
} from "./my_dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { AlertCircleIcon, AlertTriangle, EditIcon, Library, PrinterIcon, SaveIcon, Search, Trash} from 'lucide-react'
import { InfoIcon } from 'lucide-react'
import { UserPlus } from 'lucide-react'
import { GraduationCap as Cursos } from 'lucide-react';
import DataTable from 'react-data-table-component'
import { CheckCircleIcon } from '@heroicons/react/24/outline'; 
import { dataNascimentoZod, emailZod, nomeCompletoZod, telefoneZod, nomeCursoZod, descricaoZod, duracaoZod, inicio, termino, anoLectivo, idZod } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { tdStyle, thStyle, trStyle, tdStyleButtons } from './table'
import Header from './Header'

const TFormCreate =  z.object({
  inicio: inicio,
  termino: termino,
})

const TFormUpdate =  z.object({
  inicio: inicio,
  termino: termino,
  id: z.number()
})

const TFormCreateTrimestre =  z.object({
  numero: idZod,
  inicio: inicio,
  termino: termino,
})



export default function Curse(){

const formCreate  = useForm<z.infer<typeof TFormCreate>>({
  mode: 'all', 
  resolver: zodResolver(TFormCreate)
})

const formCreateTrimestre  = useForm<z.infer<typeof TFormCreateTrimestre>>({
  mode: 'all', 
  resolver: zodResolver(TFormCreateTrimestre)
})

const [updateTable, setUpdateTable] = React.useState(false)
const [showModal, setShowModal] = React.useState(false);
const [modalMessage, setModalMessage] = React.useState('');
const handleSubmitCreate = async (data: z.infer<typeof TFormCreate>,e) => {
 
await fetch(`http://localhost:8000/api/ano-lectivos/`,{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then((resp => resp.json()))
  .then((resp) =>{
          setShowModal(true);  
          if (resp.statusCode != 200) {
            const sms = resp.message
            setModalMessage(sms);  
          }else{
            setModalMessage(null);
          }
          console.log(resp)
  })
  .catch((error) => console.log(`error: ${error}`))
  setUpdateTable(!updateTable)
    
}

const handleSubmitCreateTrimestre = async (data: z.infer<typeof TFormCreateTrimestre>) => {
    await fetch(`http://localhost:8000/api/trimestres/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then((resp => resp.json()))
    .then((resp) =>{
        setShowModal(true);  
        if (resp.statusCode != 200) {
          const sms = resp.message
          setModalMessage(sms); 
        }else{
          setModalMessage(null);
        }
        console.log(resp)
    })
    .catch((error) => console.log(`error: ${error}`))
  }

const[buscar, setBuscar] = React.useState(0);
const[nome, setNome] = React.useState();
const[inicio, setInicio] = React.useState();
const[termino, setTermino] = React.useState();
const[activo, setActivo] = React.useState(false);
React.useEffect(()=>{
    const search = async () => {
        const resp = await fetch(`http://localhost:8000/api/ano-lectivos/${buscar}`);
        const receve = await resp.json()
        setNome(receve.nome)
        setInicio(receve.inicio)
        setTermino(receve.termino)
        setActivo(receve.activo)
          formUpdate.setValue('inicio', receve.inicio)
          formUpdate.setValue('termino', receve.termino)
          formUpdate.setValue('id', receve.id)
    }
    search()
},[buscar])


const changeResource = (id)=>{
  setBuscar(id)
}

const formUpdate  = useForm<z.infer<typeof TFormUpdate>>({
  mode: 'all', 
  resolver: zodResolver(TFormUpdate)
  })
 
const handleSubmitUpdate = async (data: z.infer<typeof TFormUpdate>,e) => {
  await fetch(`http://localhost:8000/api/ano-lectivos/${data.id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then((resp => resp.json()))
    .then((resp) =>{
      
      setShowModal(true);  
            if (resp.message != null) {
            setModalMessage(resp.errors.termino[0]);  
          }else{
            setModalMessage(resp.message);
          }
          console.log(resp)
    })
    .catch((error) => console.log(`error: ${error}`))
    setUpdateTable(!updateTable)
}

const handleSubmitState = async (id, values) => {
  const dado = {
    activo: values
  }
  await fetch(`http://localhost:8000/api/ano-lectivos/${id}`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dado)
    })
    .then((resp => resp.json()))
    .then((resp) =>{
      setShowModal(true);  
            if (resp.message != null) {
            setModalMessage(resp.errors.activo[0]);  
          }else{
            setModalMessage(resp.message);
          }
          console.log(resp)
    })
    .catch((error) => console.log(`error: ${error}`))
    setUpdateTable(!updateTable)
}


const [dados, setDados] = React.useState([])
const [dataApi, setDataApi] = React.useState([])
const URL = "http://localhost:8000/api/ano-lectivos"
  
  useEffect( () => {
      const respFetch = async () => {
            const resp = await fetch (URL);
            const respJson = await resp.json();
            const conv1 = JSON.stringify(respJson.data)
            const conv2 = JSON.parse(conv1)
            conv2.sort((a, b) => a.nome.localeCompare(b.nome))
            setDados(conv2)
            setDataApi(conv2)
      } 
        respFetch()
  },[updateTable])

  const columns = ['Id', 'Nome', 'Acção'];
  const handleFilter = (event) => {
      const valores = dataApi.filter((element) =>{ return (element.nome.toLowerCase().includes(event.target.value.toLowerCase().trim())) });
      setDados(valores)
  }
    

    return (
      <section className="m-0 w-screen h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300  grid-flow-col grid-cols-3">
      <Header title={false}/>
       
      <div className='flex flex-col space-y-2 justify-center w-[90%] z-10'> 
       <div className='flex flex-row space-x-2'>
         <div className='relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96'>
             <Search className='absolute text-gray-300'/>            
             <input className=' pl-6 rounded-md border-2 border-gray-400 placeholder:text-gray-400 placeholder:font-bold outline-none py-2 w-full indent-2' type='text' placeholder='Procure por registros...' onChange={handleFilter}/>
         </div>
         <Dialog>
    <DialogTrigger asChild >
    <div title='cadastrar Ano-Lectivos' className='relative flex justify-center items-center'>
    <Cursos className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
      <Button className='h-9 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm'></Button>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <DialogTitle>Cadastrar Ano Académico</DialogTitle>
        <DialogDescription>
          <p>preencha o formulário e em seguida click em <span className='font-bold text-blue-500'>cadastrar</span> quando terminar.
          </p>
        </DialogDescription>
      </DialogHeader>
      <Form {...formCreate} >
     <form onSubmit={formCreate.handleSubmit(handleSubmitCreate)} >
     <div className="flex flex-col w-full py-4 bg-white">
        <div className="w-full">
          <Label htmlFor="inicio" className="text-right">
            Íncicio
          </Label>
          <FormField
          control={formCreate.control}
          name="inicio"
          render={({field})=>(
            <FormItem>
            <Input
              id="inicio"
              type='date' {...field} className="w-full"
              min="2024-01-01"/>
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className="w-full">
        <Label htmlFor="termino" className="text-right">
            Termino
          </Label>
          <FormField
          control={formCreate.control}
          name="termino"
          render={({field})=>(
            <FormItem>
            <Input id="termino" type='date' {...field} className="w-full"
            min="2025-01-01"/>
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>  
        </div>
      </div>
      <DialogFooter>
      <Button title='cadastrar' className='bg-blue-500 border-blue-500 text-white hover:bg-blue-500 font-semibold w-12' type='submit'><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
      </DialogFooter>
      </form></Form>
    </DialogContent>
         </Dialog> 
         <Dialog>
    <DialogTrigger asChild >
    <div title='cadastrar trimestre' className='relative flex justify-center items-center'>
    
    <Library className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
      <Button className='h-9 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm'></Button>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <DialogTitle>Cadastrar Trimestre</DialogTitle>
        <DialogDescription>
          <p>esta secção tem como finalidade adicionar um novo trimestre ao ano lectivo corrente.
          </p>
        </DialogDescription>
      </DialogHeader>
      <Form {...formCreateTrimestre} >
     <form onSubmit={formCreateTrimestre.handleSubmit(handleSubmitCreateTrimestre)} >
     <div className="flex flex-col w-full py-4 bg-white">
     <div className="w-full">
          <Label htmlFor="inicio" className="text-right">
            Número
          </Label>
          <FormField
          control={formCreateTrimestre.control}
          name="numero"
          render={({field})=>(
            <FormItem>
            <Input
              id="numero"
              type='number' {...field} className="w-full"
              onChange={(e)=>{field.onChange(parseInt(e.target.value))}}/>
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className="w-full">
          <Label htmlFor="inicio" className="text-right">
            Íncicio
          </Label>
          <FormField
          control={formCreateTrimestre.control}
          name="inicio"
          render={({field})=>(
            <FormItem>
            <Input
              id="inicio"
              type='date' {...field} className="w-full"
              min="2024-01-01"/>
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className="w-full">
        <Label htmlFor="termino" className="text-right">
            Termino
          </Label>
          <FormField
          control={formCreateTrimestre.control}
          name="termino"
          render={({field})=>(
            <FormItem>
            <Input id="termino" type='date' {...field} className="w-full"
            min="2025-01-01"/>
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>  
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
             
             <thead className='sticky top-0 z-10 '>
                 <tr className={trStyle}>
                     {columns.map((element, index) =>{ return( <th key={index} className={thStyle} >{element}</th>) })}
                 </tr>
             </thead>
             <tbody >
                 {dados.length == 0 ? (
                 <tr className='w-96 h-32'>
                     <td rowSpan={3} colSpan={3} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                         <div>
                             <AlertTriangle className="inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12"/>
                             <p>Nenum Registro Foi Encontrado</p>
                         </div>
                     </td>
                 </tr>
                 ) : dados.map((item, index) => (
                     <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
                      {item.activo == true && 
                         <td className={tdStyle}><CheckCircleIcon className='h-5 w-7 text-green-600'/></td>
                        }
                        {!item.activo &&
                         <td className={tdStyle}>{item.id}</td>
                        
                        }
                         <td className={tdStyle}>{item.nome}</td>
                         <td className={tdStyleButtons}    onClick={()=>{
                           changeResource(item.id)
                           
                         }}>
                         <Dialog >
          <DialogTrigger asChild >
          <div title='actualizar' className='relative flex justify-center items-center'>
          <EditIcon className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
            <Button  className='h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm'></Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                  <DialogTitle>Actualizar Ano Académico</DialogTitle>
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
                <Label htmlFor="inicio" className="text-right">
                  Ínicio
                </Label>
                <FormField
                control={formUpdate.control}
                name="inicio"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="inicio"
                    type='date' {...field} className="w-full"
                    min="2024-01-01"/>
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>
              </div>
              <div className="w-full">
              <Label htmlFor="termino" className="text-right">
                  Fim
                </Label>
                <FormField
                control={formUpdate.control}
                name="termino"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="termino"
                    type='date' {...field} className="w-full"
                    min="2025-01-01"/>
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>               
              
              </div>
      </div>
      <DialogFooter>
      <Button title='actualizar' className='bg-green-500 border-green-500 text-white hover:bg-green-500 font-semibold w-12' type='submit' ><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
      </DialogFooter>
      </form></Form>
    </DialogContent>
                        </Dialog>
                        <div className='relative flex justify-center items-center cursor-pointer'>
                      
                        <Popover >
                  <PopoverTrigger asChild className='bg-white'>

                  <div title='ver dados' className='relative flex justify-center items-center cursor-pointer'>  <InfoIcon className='w-5 h-4 absolute text-white'/> 
                    <Button  className='h-7 px-5 bg-green-600 text-white font-semibold hover:bg-green-600 rounded-sm border-green-600'></Button>
                    </div>
                  </PopoverTrigger >
                  <PopoverContent className="w-80 bg-white">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Dados do Ano Em Curso</h4>
                        <p className="text-sm text-muted-foreground">
                          Inspecione os dados
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="maxWidth">Ínicio</Label>
                          <p>{inicio}</p>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="height">Termino</Label>
                          <p className='text-xs'>{termino}</p>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="height">Estado</Label>
                          <p className='text-xs'>{activo ? "Disponível" : "Indisponível"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                        </div>
                      <Button title='activar' className='h-7 px-5 bg-green-300 text-white font-semibold hover:bg-green-300 rounded-sm border-green-300' onClick={()=>{
                            setActivo(true)
                            handleSubmitState(item.id, true)
                      }}>Yes</Button>
                      <Button title='desactivar' className='h-7 px-5 bg-red-300 text-white font-semibold hover:bg-red-300 rounded-sm border-red-300' onClick={()=>{
                            setActivo(false)
                            handleSubmitState(item.id, false)
                      }}>No</Button>
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
     hover:font-medium
      font-poppins text-md border-green-400 font-medium h-9 w-20' onClick={() => setShowModal(false)}>Fechar</Button>
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
    </section>
)
}