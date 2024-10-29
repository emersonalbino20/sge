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
import { AlertCircleIcon, CheckCircleIcon, EditIcon, PrinterIcon, SaveIcon, Search, AlertTriangle} from 'lucide-react'
import { InfoIcon } from 'lucide-react'
import { GraduationCap as Cursos } from 'lucide-react';
import DataTable from 'react-data-table-component'
import {anoLectivo, classe, anoLectivoId, cursoId, custoMatricula, sala, capacidade, localizacao, terminoturno, inicioturno } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm} from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { MyDialog, MyDialogContent } from './my_dialog'
import { tdStyle, thStyle, trStyle, tdStyleButtons } from './table'
import Header from './Header'
import { animateBounce } from '@/AnimationPackage/Animates'


const TFormCreate =  z.object(
{
  nome: sala,/*A validacao da sala é equicalente com o turno*/
  inicio: inicioturno,
  termino: terminoturno
})

const TFormUpdate =  z.object({
  nome: sala,
  inicio: inicioturno,
  termino: terminoturno,
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
      
await fetch(`http://localhost:8000/api/turnos/`,{
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
  setUpdateTable(!updateTable);
}

const[buscar, setBuscar] = React.useState();
const[nome, setNome] = React.useState();
const[inicio, setInicio] = React.useState();
const[termino, setTermino] = React.useState();
const[id,setId] = React.useState();

React.useEffect(()=>{
    const search = async () => {
        const resp = await fetch(`http://localhost:8000/api/turnos/${buscar}`);
        const receve = await resp.json()
        setNome(receve.nome)
        setInicio(receve.inicio)
        setTermino(receve.termino)
        setId(receve.id)
        formUpdate.setValue('nome', receve.nome)
        formUpdate.setValue('inicio', receve.inicio)
        formUpdate.setValue('termino', receve.termino)
        formUpdate.setValue('id', receve.id)
        setEstado(false)
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

    const changeResource = (id)=>{
      setBuscar(id)
    }
  
    
        const [dados, setDados] = React.useState([])
        const [dataApi, setDataApi] = React.useState([])
        const URL = `http://localhost:8000/api/turnos/`
       
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
       
      <div className='flex flex-col space-y-2 justify-center items-center w-full'>
        <div className='animate-fade-left animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-in flex flex-col space-y-2 justify-center w-[90%] z-10'>
       <div className='flex flex-row space-x-2'>
         <div className='relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96'>
             <Search className='absolute text-gray-300 w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7'/>            
             <Input className=' pl-6 indent-2' type='text' placeholder='Procure por registros...' onChange={handleFilter}/>
         </div>
         <Dialog>
    <DialogTrigger asChild>
    <div title='cadastrar' className='relative flex justify-center items-center'>
    <Cursos className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
      <Button className='h-9 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm'></Button>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
      <DialogTitle className='text-sky-800 text-xl'>Cadastrar Turno</DialogTitle>
      <DialogDescription>
          <p className='text-base text-gray-800'>
          preencha o formulário e em seguida click em <span className='font-bold text-sky-700'>cadastrar</span> quando terminar.
        </p>
      </DialogDescription>
      </DialogHeader>
      <Form {...formCreate} >
     <form onSubmit={formCreate.handleSubmit(handleSubmitCreate)} >
     <div className="flex flex-col w-full py-4 bg-white">
        <div className="w-full">
        <Label htmlFor="nome"className='text-sky-700 text-lg font-semibold'>Nome<span className='text-red-500'>*</span>
          </Label>
          <FormField
          control={formCreate.control}
          name="nome"
          render={({field})=>(
            <FormItem>
            <Input
              id="nome"
              type='text' {...field}  className={formCreate.formState.errors.nome?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
              'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'} 
              />
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className="w-full">
        <Label htmlFor="inicio"className='text-sky-700 text-lg font-semibold'>Ínicio<span className='text-red-500'>*</span>
          </Label>
          <FormField
          control={formCreate.control}
          name="inicio"
          render={({field})=>(
            <FormItem>
            <Input id="inicio" type='text' {...field}  className={formCreate.formState.errors.inicio?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                  'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'} 
            placeholder='00:00:00'/>
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className="w-full">
        <Label htmlFor="termino"className='text-sky-700 text-lg font-semibold'>Término<span className='text-red-500'>*</span>
          </Label>
          <FormField
          control={formCreate.control}
          name="termino"
          render={({field})=>(
            <FormItem>
            <Input id="termino" type='text' {...field}  className={formCreate.formState.errors.termino?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
            'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'} 
            placeholder='00:00:00'/>
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
                <DialogTitle className='text-sky-800 text-xl'>Actualizar Turno</DialogTitle>
              <DialogDescription>
                <p className='text-base text-gray-800'>
                altere uma informação do curso e em seguida click em <span className='font-bold text-sky-700'>actualizar</span> quando terminar.
              </p>
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
                <Label htmlFor="nome"className='text-sky-700 text-lg font-semibold'>Nome<span className='text-red-500'>*</span>
                </Label>
                <FormField
                control={formUpdate.control}
                name="nome"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="nome"
                    type='text' {...field} className={formUpdate.formState.errors.nome?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                    'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}
                    />
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>
              </div>
              <div className="w-full">
              <Label htmlFor="inicio"className='text-sky-700 text-lg font-semibold'>Ínicio<span className='text-red-500'>*</span>
              </Label>
                <FormField
                control={formUpdate.control}
                name="inicio"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="inicio"
                    type='text' {...field} className={formUpdate.formState.errors.inicio?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                    'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}
                    placeholder='00:00:00'/>
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>
              </div>
              <div className="w-full">
              <Label htmlFor="termino"className='text-sky-700 text-lg font-semibold'>Término<span className='text-red-500'>*</span>
          </Label>
                <FormField
                control={formUpdate.control}
                name="termino"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="termino"
                    type='text' {...field} className={formUpdate.formState.errors.termino?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                    'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}
                    placeholder='00:00:00'/>
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
                    <Button  className='h-7 px-5 bg-green-600 text-white font-semibold hover:bg-green-600 rounded-sm border-green-600'></Button>
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
                          <Label htmlFor="maxWidth">Turno</Label>
                          <p>{nome}</p>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="maxWidth">Inicio</Label>
                          <p>{inicio}</p>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="height">Termino</Label>
                          <p className='text-xs'>{termino}</p>
                        </div>
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