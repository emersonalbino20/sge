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
import { AlertCircleIcon, CheckCircleIcon, DatabaseBackupIcon, EditIcon, PrinterIcon, SaveIcon, Trash} from 'lucide-react'
import { InfoIcon, AlertTriangle, Search } from 'lucide-react'
import { GraduationCap as Cursos } from 'lucide-react';
import DataTable from 'react-data-table-component'
import {anoLectivo, classe, anoLectivoId, cursoId, custoMatricula, sala, capacidade, localizacao } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm} from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { MyDialog, MyDialogContent } from './my_dialog'
import { tdStyle, thStyle, trStyle, tdStyleButtons } from './table'
import Header from './Header'
import { animateBounce, animateShake } from '@/AnimationPackage/Animates'
import { Textarea } from '@/components/ui/textarea'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSalas, getSalasId, postSalas, putSalas } from '@/_tanstack/FetchFunction'


const TFormCreate =  z.object(
{
  nome: sala,
  capacidade: capacidade,
  localizacao: localizacao
})

const TFormUpdate =  z.object({
  nome: sala,
  capacidade: capacidade,
  localizacao: localizacao,
  id: z.number()
})

export default function ClassRoom(){

  const formCreate  = useForm<z.infer<typeof TFormCreate>>({
    mode: 'all', 
    resolver: zodResolver(TFormCreate)
  })

  const formUpdate  = useForm<z.infer<typeof TFormUpdate>>({
  mode: 'all', 
  resolver: zodResolver(TFormUpdate)
  })

  const [showModal, setShowModal] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState(''); 

  const {data: salas, isError, } = useQuery({ queryKey: ["salas"] , queryFn: ()=>getSalas(),
    });

  const[buscar, setBuscar] = React.useState<number>(null);

  const {data: salasId, isSuccess: salasSuccessId, isFetched: salasFetchedId} = useQuery({ queryKey: ["salasId", buscar] , queryFn: ()=>getSalasId(buscar), enabled: !!buscar, 
  });

  if(salasFetchedId){formUpdate.setValue('nome', salasId.data.nome)
    formUpdate.setValue('capacidade', salasId.data.capacidade)
    formUpdate.setValue('localizacao', salasId.data.localizacao)}

  const queryClient = useQueryClient();
  const {mutate: postMutationSalas} = useMutation({
    mutationFn: postSalas,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['salas']});
      setShowModal(true);
      setModalMessage(null)
    }
  });

  const handleSubmitCreate = async (data: z.infer<typeof TFormCreate>,e) => {
      e.preventDefault();
      postMutationSalas(data);
    }

  const {mutate: putMutationSalas} = useMutation({
    mutationFn: putSalas,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['salas']});
      setShowModal(true);
      setModalMessage(null)
    }
  });

  const handleSubmitUpdate = async (data: z.infer<typeof TFormCreate>,e) => {
    e.preventDefault();
    putMutationSalas(data);
  }

  const changeResource = (id)=>{
    setBuscar(id); 
  }
  
  const handleFilter = (event) => {
      salas.data.filter((element) =>{ return (element.nome.toLowerCase().includes(event.target.value.toLowerCase().trim())) });
  }

    return (
      <section className="m-0 w-screen h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300  grid-flow-col grid-cols-3">
      <Header title={false}/>
       
      <div className='flex flex-col space-y-2 justify-center items-center w-full'>
        <div className='animate-fade-left animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-in flex flex-col space-y-2 justify-center w-[90%] z-10'>
       <div className='flex flex-row space-x-2'>
         <div className='relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96'>
             <Search className='absolute text-gray-300 '/>            
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
      <DialogTitle className='text-sky-800 text-xl'>Cadastrar Sala</DialogTitle>
        <DialogDescription>
          <p className='text-base text-gray-800'>
          preencha o formulário e em seguida click em <span className='font-bold text-sky-700'>actualizar</span> quando terminar.
        </p>
        </DialogDescription>
      </DialogHeader>
      <Form {...formCreate} >
     <form onSubmit={formCreate.handleSubmit(handleSubmitCreate)} >
     <div className="flex flex-col w-full py-4 bg-white">
        <div className="w-full mb-2">
        <label htmlFor="nome">Nome<span className='text-red-500'>*</span>
        </label>
          <FormField
          control={formCreate.control}
          name="nome"
          render={({field})=>(
            <FormItem>
            <Input
              id="nome"
              type='text' {...field} className={formCreate.formState.errors.nome?.message && `${animateShake} select-error`}
              />
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className="w-full mb-2">
        <label htmlFor="capacidade">Capacidade<span className='text-red-500'>*</span>
        </label>
          <FormField
          control={formCreate.control}
          name="capacidade"
          render={({field})=>(
            <FormItem>
            <Input id="capacidade" type='number' {...field} className={formCreate.formState.errors.capacidade?.message 
            && `${animateShake} select-error`}
            min="0"
            onChange={(e)=>{field.onChange(parseInt( e.target.value))}}
            />
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className="w-full">
        <label htmlFor="localizacao">Localização<span className='text-red-500'>*</span>
              </label>
          <FormField
          control={formCreate.control}
          name="localizacao"
          render={({field})=>(
            <FormItem>
            <Textarea id="localizacao" {...field} className={formCreate.formState.errors.localizacao?.message && `${animateShake} select-error active:outline-none`}
            />
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
      </div>
      <DialogFooter>
      <Button title='cadastrar' className='responsive -button bg-blue-500 border-blue-500 text-white hover:bg-blue-500 font-semibold w-12' type='submit'><SaveIcon className='w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7  absolute text-white font-extrabold'/></Button>
      </DialogFooter>
      </form></Form>
    </DialogContent>
      </Dialog>      
     </div>
     <div className="overflow-x-auto overflow-y-auto w-full  h-80 md:h-1/2 lg:h-[500px]">
         
         <table className="w-full bg-white border border-gray-200 table-fixed">
             
             <thead className='sticky top-0 z-10'>
                 <tr className={trStyle}>
                      <th className={thStyle} >Id</th> 
                      <th className={thStyle} >Salas</th>
                      <th className={thStyle} >Acção</th>
                 </tr>
             </thead>
             <tbody >
                 { isError ? (
                 <tr className='w-96 h-32'>
                     <td rowSpan={3} colSpan={3} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                         <div>
                         <AlertTriangle className={`${animateBounce} inline-block triangle-alert`}/>
                              <p className='text-red-500'>Nenum Registro Foi Encontrado</p>
                         </div>
                     </td>
                 </tr>
                 ) : salas?.data?.data.map((item, index) => (
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
                <DialogTitle className='text-sky-800 text-xl'>Actualizar Sala</DialogTitle>
              <DialogDescription>
                <p className='text-base text-gray-800'>
                altere uma informação da sala  e em seguida click em <span className='font-bold text-sky-700'>actualizar</span> quando terminar.
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
                <div className="w-full mb-2">
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
              <div className="w-full mb-2">
              <label htmlFor="capacidade">Capacidade<span className='text-red-500'>*</span>
              </label>
                <FormField
                control={formUpdate.control}
                name="capacidade"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="capacidade"
                    type='number' {...field} className={formUpdate.formState.errors.capacidade?.message && `${animateShake} input-error`}
                    min="0"/>
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>
              </div>
              <div className="w-full">
              <label htmlFor="localizacao">Localização<span className='text-red-500'>*</span>
              </label>
                <FormField
                control={formUpdate.control}
                name="localizacao"
                render={({field})=>(
                  <FormItem>
                  <Textarea
                    id="localizacao"
                    {...field} className={formUpdate.formState.errors.localizacao?.message && `${animateShake} input-error `}
                    />
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>               
              
              </div>
      </div>
      <DialogFooter>
      <Button title='actualizar' className='responsive-button bg-green-500 border-green-500 text-white hover:bg-green-500 font-semibold w-12' type='submit'><SaveIcon className='w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7  absolute text-white font-extrabold'/></Button>
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
                          <h4 className="font-medium leading-none text-gray-800">Dados da Sala</h4>
                          <p className="text-sm text-muted-foreground">
                            Inspecione os dados
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 items-center gap-4">
                            <label htmlFor="maxWidth">Capacidade</label>
                            <p>{salasSuccessId && salasId.data.capacidade}</p>
                          </div>
                          <div className="">
                            <label htmlFor="height">Localização</label>
                            <p className='indent-2 text-justify text-xs text-pretty'>{salasSuccessId && salasId.data.localizacao}</p>
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
                     Total de registros: 
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
