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
import { EditIcon, PrinterIcon, CreditCard, SaveIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react'
import { InfoIcon } from 'lucide-react'
import { UserPlus, Trash, SendIcon, Search, AlertTriangle } from 'lucide-react'
import DataTable from 'react-data-table-component'
import { useForm, useFieldArray } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { dataNascimentoZod, emailZod, nomeCompletoZod, telefoneZod, ruaZod, bairroZod, numeroCasaZod, idZod, methodPay } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { tdStyle, thStyle, trStyle, tdStyleButtons } from './table'
import { MyDialog, MyDialogContent } from './my_dialog'

const TFormMethod =  z.object({
  nome: methodPay
})


const TFormUpdateMethod =  z.object({
  nome: methodPay,
  id: z.number()
})


type FormPropsMethod =  z.infer<typeof TFormMethod>;
type FormPropsUpdateMethod =  z.infer<typeof TFormUpdateMethod>;
export default function Payment (){
  
  const formMethod  = useForm<z.infer<typeof TFormMethod>>({
    mode: 'all', 
    resolver: zodResolver(TFormMethod)
   })

   const formUpdateMethod  = useForm<z.infer<typeof TFormUpdateMethod>>({
    mode: 'all', 
    resolver: zodResolver(TFormUpdateMethod)
   })
   
   const [showModal, setShowModal] = React.useState(false);
   const [modalMessage, setModalMessage] = React.useState('');
   const handleSubmitCreateMethod = async (dado: z.infer<typeof TFormMethod>,e) => {
          const data1 = 
            {
              nome: dado.nome 
            }
            
    await fetch(`http://localhost:8000/api/metodos-pagamento`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data1)
        })
        .then((resp => resp.json()))
        .then((resp) =>{
          setShowModal(true);  
          if (resp.message != null && resp.statusCode != 400) {
            setModalMessage(resp.message);  
          }else{
            setModalMessage(resp.message);
          }
        })
        .catch((error) => console.log(`error: ${error}`))
        
        
    }

   const [updateTableMethod, setUpdateTableMethod] = React.useState(false)
   const handleSubmitUpdateMethod = async (data: z.infer<typeof TFormUpdateMethod>) => {
          
    await fetch(`http://localhost:8000/api/metodos-pagamento/${data.id}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then((resp => resp.json()))
        .then((resp) =>{ console.log(resp)})
        .catch((error) => console.log(`error: ${error}`))
        setUpdateTableMethod(true)
        //console.log(data)
        
    }

  const[metodo, setMetodo] = React.useState([]);
  React.useEffect(()=>{
    const search = async () => {
        const URLPAGAMENTO = "http://localhost:8000/api/metodos-pagamento/";
        const response = await fetch (URLPAGAMENTO);
        const responseJson = await response.json();
        setMetodo(responseJson.data);
    }
    search();
  },[])
    const [dados, setDados] = React.useState([])
    const [dataApi, setDataApi] = React.useState([])
    const[buscar, setBuscar] = React.useState(0);
    const URL = `http://localhost:8000/api/metodos-pagamento/${buscar}`
    React.useEffect(()=>{
      const search = async () => {
          if (buscar > 0)
          {
            const resp = await fetch (URL);
            const respJson = await resp.json();
            setDados(respJson.data);
            setDataApi(respJson.data);
          }
        }
        search()
    },[buscar])

    
    const columns = ['Id', 'Nome'];
    const handleFilter = (event) => {
      const valores = dataApi.filter((element) =>{ return (element.nome.toLowerCase().includes(event.target.value.toLowerCase().trim())) });
      setDados(valores)
  }

    return( 
      <div className='w-screen min-h-screen bg-scroll bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300 flex items-center justify-center'>
      <div className='flex flex-col space-y-2 justify-center w-[90%] z-10 mt-44'> 
       <div className='flex flex-row space-x-2'>
         <div className='relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96'>
             <Search className='absolute text-gray-300'/>            
             <input className=' pl-6 rounded-md border-2 border-gray-400 placeholder:text-gray-400 placeholder:font-bold outline-none py-2 w-full indent-2' type='text' placeholder='Procure por registros...' onChange={handleFilter}/>
         </div>
         <Dialog >
    <DialogTrigger asChild >
    <div title='cadastrar' className='relative flex justify-center items-center' >
    <UserPlus className='w-5 h-4 absolute text-white font-extrabold'/>
      <button className='py-4 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm' ></button>
      </div>
      
    </DialogTrigger>
    <DialogContent className="sm:max-w-[625px] overflow-y-scroll h-[550px] bg-white">
      <DialogHeader>
        <DialogTitle>Cadastrar Encarregado</DialogTitle>
        <DialogDescription>
        cadastre um registro, click em cadastrar quando terminar.
        </DialogDescription>
      </DialogHeader>
       </DialogContent>
  </Dialog> 

  <Dialog >
    <DialogTrigger asChild >
    <div title='pagamento' className='relative flex justify-center items-center' >
    <CreditCard className='w-5 h-4 absolute text-white font-extrabold'/>
      <button className='py-4 px-5 bg-slate-600 text-white font-semibold hover:bg-slate-600 rounded-sm border-slate-600' ></button>
      </div>
      
    </DialogTrigger>
    <DialogContent className="sm:max-w-[625px] overflow-y-scroll h-[400px] bg-white">
      <DialogHeader>
        <DialogTitle>Registrar</DialogTitle>
        <DialogDescription>
        registre a forma de pagamento aceitavel pela instituição, click em registrar quando terminar.
        </DialogDescription>
      
      <Form {...formMethod} >
     <form onSubmit={formMethod.handleSubmit(handleSubmitCreateMethod)} >
     <div className="flex flex-col  py-4 bg-white">
      <div className="flex flex-row space-x-2 w-full py-4">
        <div className="w-full">
          <Label htmlFor="name" className="text-right">
          Forma de Pagamento
          </Label>
          <FormField
          control={formMethod.control}
          name="nome"
          render={({field})=>(
          <FormItem>
           <FormControl>
          <Input 
            id="name"
            className="w-full"
            {...field}
          />
          </FormControl>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}
           />
           <FormField
          name={''}
          render={({field})=>(
          <FormItem>
            <Label htmlFor="method" className="text-right">
            Todos métodos
          </Label>
              <FormControl>
              <select id='method' {...field} className='w-full py-3 rounded-md ring-1 bg-white text-gray-500 ring-gray-300 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))
              }}>
                        <option>Selecione</option>
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
           <div className='flex flex-row space-x-2 mt-2'>
           <div className='relative flex justify-center items-center' >
                 <SaveIcon className='w-4 h-5 absolute text-white font-extrabold'/>
                 <button type='submit' title='registrar' className='py-3 px-5 bg-green-600 text-white font-semibold hover:bg-green-600 border-green-600 rounded-sm' ></button>
          </div>
          <div className='relative flex justify-center items-center' >
                 <EditIcon className='w-4 h-3 absolute text-white font-extrabold'/>
                 <button title='editar' className='py-3 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 border-blue-600 rounded-sm' ></button>
          </div>
          </div>
          </div>
           </div>
          </div>
           </form>
           </Form>
           </DialogHeader>
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
                 {metodo.length == 0 ? (
                 <tr className='w-96 h-32'>
                     <td rowSpan={2} colSpan={2} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                         <div>
                             <AlertTriangle className="inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12"/>
                             <p>Nenum Registro Foi Encontrado</p>
                         </div>
                     </td>
                 </tr>
                 ) : metodo.map((item, index) => (
                     <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
                         <td className={tdStyle}>{item.id}</td>
                         <td className={tdStyle}>{item.nome}</td>
                     </tr>
                 ))}
             </tbody>
             <tfoot className='sticky bottom-0 bg-white"'>
             <tr>
                 <td colSpan={2} className="py-2 text-blue-500">
                     Total de registros: {metodo.length}
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
   </div>
      
 ) ;
}