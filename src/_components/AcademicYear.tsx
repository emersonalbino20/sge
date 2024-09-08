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
import { AlertCircleIcon, EditIcon, PrinterIcon, Trash} from 'lucide-react'
import { InfoIcon } from 'lucide-react'
import { UserPlus } from 'lucide-react'
import { GraduationCap as Cursos } from 'lucide-react';
import DataTable from 'react-data-table-component'
import { CheckCircleIcon } from '@heroicons/react/24/outline'; 
import { dataNascimentoZod, emailZod, nomeCompletoZod, telefoneZod, nomeCursoZod, descricaoZod, duracaoZod, inicio, termino, anoLectivo } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useConfirm } from '@omit/react-confirm-dialog'


const TFormCreate =  z.object({
  inicio: inicio,
  termino: termino,
})

const TFormUpdate =  z.object({
  nome: anoLectivo,
  inicio: inicio,
  termino: termino,
  id: z.number()
})



export default function Curse(){

const formCreate  = useForm<z.infer<typeof TFormCreate>>({
  mode: 'all', 
  resolver: zodResolver(TFormCreate)
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

const[buscar, setBuscar] = React.useState(0);
const[nome, setNome] = React.useState();
const[inicio, setInicio] = React.useState();
const[termino, setTermino] = React.useState();
const[estado, setEstado] = React.useState(false);
React.useEffect(()=>{
    const search = async () => {
        const resp = await fetch(`http://localhost:8000/api/ano-lectivos/${buscar}`);
        const receve = await resp.json()
        setNome(receve.nome)
        setInicio(receve.inicio)
        setTermino(receve.termino)
        setActivo(receve.activo)
        setEstado(true);
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
    })
    .catch((error) => console.log(`error: ${error}`))
    setUpdateTable(!updateTable)
}

const[idAno, setIdAno] = React.useState();
const[activo, setActivo] = React.useState(false);
const handleSubmitState = async (id) => {
  const dado = {
    activo: true
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

 //REACT-CONFIRM-DIALOG
 /*const confirm = useConfirm()
 const handleClick = async () => {
   const isConfirmed = await confirm({
     title: 'Delete Item',
     description: 'Are you sure you want to delete this item?',
     confirmText: 'Delete',
     cancelText: 'Cancel'
   })
 
   if (isConfirmed) {
    handleSubmitUpdate
   }
 }
*/

    const columns = 
    [
        { 
            name: 'Id',
            selector: row => row.id,
            sortable:true
         },
         { 
          name: 'Nome',
          selector: row => row.nome,
          sortable:true
        },
        {
            name: 'Ação',
            cell: (row) => (<div className='flex flex-row space-x-2' onClick={()=>{
              changeResource(row.id)
            if(estado){
              formUpdate.setValue('nome', nome)
              formUpdate.setValue('inicio', inicio)
              formUpdate.setValue('termino', termino)
              formUpdate.setValue('id', row.id)
              setEstado(false)
            }
            
            }}><EditIcon className='w-5 h-4 absolute text-white'/> 
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
      <Button className='bg-green-500 border-green-500 text-white hover:bg-green-500 font-semibold' type='submit' >Actualizar</Button>
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
              handleSubmitState(row.id)
            }}></Button>
            
            </div>),
        }, 
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

        const [dados, setDados] = React.useState([])
        const [dataApi, setDataApi] = React.useState([])
        const URL = "http://localhost:8000/api/ano-lectivos"
       
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
    
        const handleFilter =  (event) => {
            const newData = dataApi.filter( row => {
                return row.nome.toLowerCase().includes(event.target.value.toLowerCase().trim())
            })
            setDados(newData)
        }
    
       const handleSort = (column, sortDirection) => {
        console.log({column, sortDirection})
       }
    

    return (
    
         <div className='w-full h-72 '>
         <br/><br/><br/>
   <DataTable 
   customStyles={ tableStyle }
   conditionalRowStyles={conditionalRowStyles}
   columns={columns}
   data={dados}
   fixedHeader
   fixedHeaderScrollHeight='300px'
   pagination
   defaultSortFieldId={1}
   onSort={handleSort}
   subHeader
   subHeaderComponent={
       <div className='flex flex-row space-x-2'><input className=' rounded-sm border-2 border-gray-400 placeholder:text-gray-400 placeholder:font-bold outline-none py-1 indent-2' type='text' placeholder='Pesquisar aqui...' onChange={handleFilter}/>
       
       <div className='relative flex justify-center items-center'>
           <PrinterIcon className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
           <button className='py-4 px-5 bg-green-700 border-green-700 rounded-sm ' onClick={() => window.print()}></button>
       </div>
       <Dialog >
    <DialogTrigger asChild >
    <div title='cadastrar' className='relative flex justify-center items-center'>
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
      <Button className='bg-blue-500 border-blue-500 text-white hover:bg-blue-500 font-semibold' type='submit'>Cadastrar</Button>
      </DialogFooter>
      </form></Form>
    </DialogContent>
  </Dialog>
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
   }
>
</DataTable>
</div>
)
}