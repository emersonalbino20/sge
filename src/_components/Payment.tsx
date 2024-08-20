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
import { EditIcon, PrinterIcon, CreditCard } from 'lucide-react'
import { InfoIcon } from 'lucide-react'
import { UserPlus, Trash, SendIcon } from 'lucide-react'
import DataTable from 'react-data-table-component'
import { useForm, useFieldArray } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { dataNascimentoZod, emailZod, nomeCompletoZod, telefoneZod, ruaZod, bairroZod, numeroCasaZod, idZod, methodPay } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


const TFormMethod =  z.object({
  nome: methodPay,
  
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
   
   const handleSubmitCreateMethod = async (data: z.infer<typeof TFormMethod>,e) => {
          
    await fetch(`http://localhost:8000/api/metodos-pagamento`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then((resp => resp.json()))
        .then((resp) =>{console.log(resp)})
        .catch((error) => console.log(`error: ${error}`))
        //console.log(data)
        
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

    const[nomeMethod, setNomeMethod] = React.useState();
    const [dados, setDados] = React.useState([])
    const [dataApi, setDataApi] = React.useState([])
    const[buscar, setBuscar] = React.useState(0);
    const URL = `http://localhost:8000/api/metodos-pagamento/${buscar}`
    React.useEffect(()=>{
        const search = async () => {
          const resp = await fetch (URL);
          const respJson = await resp.json();
          
          console.log(respJson)
          setNomeMethod(respJson.nome)
          const obj = [{
            id: respJson.id,
            nome: respJson.nome,
          }]
          setDados(obj)
          setDataApi(obj)
        }
        search()
    },[buscar])

    const columns = 
    [
        { 
            name: 'Id',
            selector: row => row.id,
            sortable:true
         },
        
        { 
            name: 'Nome',
            selector: row => row.nomeCompleto,
            sortable:true
         }, 
         { 
          name: 'Parentesco',
          selector: row => row.parentesco,
          sortable:true
       },
        {
            name: 'Ação',
        }
    ];
    
    
    const tableStyle = {
        
        headCells: {
            style: {
                backgroundColor: '#e8e9eb',
                fontWeight: 'bold',
                fontSize: '14px',
                color: '#008ae1'
            }
        },
        }
           
        const conditionalRowStyles = [
            {
                when: row => row.id % 2 === 0,
                style: {
                    backgroundColor: '#e8e9eb'
                },
            },
            {
                when: row => row.id % 2 !== 0,
                style: {
                    backgroundColor: '#ffffff'
                },
            },
        ];
        
        const handleFilter =  (event) => {
          setBuscar(parseInt(event.target.value.trim()))
        }
    
      
       const handleSort = (column, sortDirection) => {
        console.log({column, sortDirection})
       }
    
       const[value, setValue] = React.useState();
    return( 
      <div className='w-full h-72 '>
         <br/><br/><br/>
   <DataTable 
    customStyles={ tableStyle }
    conditionalRowStyles={conditionalRowStyles}
    columns={columns}
    data={dados}
    fixedHeader
    fixedHeaderScrollHeight='400px'
    pagination
    defaultSortFieldId={1}
    onSort={handleSort}
    subHeader
   subHeaderComponent={ 
       <div className='flex flex-row space-x-2'><input className=' rounded-sm border-2 border-gray-400 placeholder:text-gray-400 placeholder:font-bold outline-none py-1 indent-2' type='text' placeholder='Pesquisar aqui...' onChange={handleFilter}/>
       
       <div className='relative flex justify-center items-center'>
           <PrinterIcon className='w-5 h-4 absolute text-white font-extrabold'/>
           <button className='py-4 px-5 bg-green-700 border-green-700 rounded-sm ' onClick={() => window.print()}></button>
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
        registre a forma de pagamento aceitãvel pelainstituição, click em registrar quando terminar.
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
           
           <div className='flex flex-row space-x-2 mt-2'>
           <div className='relative flex justify-center items-center' >
                 <SendIcon className='w-4 h-3 absolute text-white font-extrabold'/>
                 <button type='submit' title='registrar' className='py-3 px-5 bg-green-600 text-white font-semibold hover:bg-green-600 border-green-600 rounded-sm' ></button>
          </div>
          <div className='relative flex justify-center items-center' >
                 <EditIcon className='w-4 h-3 absolute text-white font-extrabold'/>
                 <button title='editar' className='py-3 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 border-blue-600 rounded-sm' ></button>
          </div>
          </div>
          </div>
           </div>
           <div className="w-full">
        <FormField
          control={formMethod.control}
          name={'nome'}
          render={({field})=>(
          <FormItem>
            <Label htmlFor="method" className="text-right">
            Todos métodos
          </Label>
              <FormControl>
              <select id='method' {...field} className='w-full py-3 rounded-md ring-1 bg-white text-gray-500 ring-gray-300 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                        <option>Selecione</option>
                        <option value={1}>Cash</option>
                        <option value={2}>TPA</option>
                  </select>
              </FormControl>
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>)
          }
          />
        </div></div>
           </form>
           </Form>
           </DialogHeader>
       </DialogContent>
  </Dialog>
  </div>
      
   }
>
</DataTable>
</div>
 ) ;
}