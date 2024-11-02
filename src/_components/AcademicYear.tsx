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
import { AlertCircleIcon, AlertTriangle, CheckCircle, EditIcon, Library, PrinterIcon, SaveIcon, Search, Trash} from 'lucide-react'
import { InfoIcon } from 'lucide-react'
import { UserPlus } from 'lucide-react'
import { GraduationCap as Cursos } from 'lucide-react';
import { dataNascimentoZod, emailZod, nomeCompletoZod, telefoneZod, nomeCursoZod, descricaoZod, duracaoZod, inicio, termino, anoLectivo, idZod } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { tdStyle, thStyle, trStyle, tdStyleButtons } from './table'
import Header from './Header'
import { animateBounce, animatePulse, animateShake } from '@/AnimationPackage/Animates'
import MostrarDialog from './MostrarDialog';
import {  useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { collectErrorMessages, getAnoAcademico, getAnoAcademicoId, patchAnoAcademico, postAnoAcademico, putAnoAcademico } from '@/_tanstack/AnoAcademico'
import axios from 'axios'
import { postTrimestres } from '@/_tanstack/Trimestres'

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


export default function AcademicYear(){

const formCreate  = useForm<z.infer<typeof TFormCreate>>({
  mode: 'all', 
  resolver: zodResolver(TFormCreate)
})

const formCreateTrimestre  = useForm<z.infer<typeof TFormCreateTrimestre>>({
  mode: 'all', 
  resolver: zodResolver(TFormCreateTrimestre)
})

const formUpdate  = useForm<z.infer<typeof TFormUpdate>>({
  mode: 'all', 
  resolver: zodResolver(TFormUpdate)
  })

const [showDialog, setShowDialog] = React.useState(false);
const [dialogMessage, setDialogMessage] = React.useState<string | null>(null);

const queryClient = useQueryClient();
const {mutate: postMutationAnoAcademico} = useMutation({
  mutationFn: postAnoAcademico,
  onSuccess: () => {
    setDialogMessage(null);
    setShowDialog(true);
    queryClient.invalidateQueries({queryKey: ["getAnoLectivos"]});
  },
  onError: (error) => {
    if(axios.isAxiosError(error)){
      if (error.response && error.response.data) {
        const err = error.response.data?.errors;
        const errorMessages = collectErrorMessages(err);
        setDialogMessage(errorMessages[0]);
        setShowDialog(true);
       }
      }
    }
});

const handleSubmitCreateAnoLectivos = async (data: z.infer<typeof TFormCreate>,e) => {
  e.preventDefault();
  postMutationAnoAcademico(data)
 }

const {mutate: postMutationTrimestre} = useMutation({
  mutationFn: postTrimestres,
  onSuccess: () => {
    setDialogMessage(null);
    setShowDialog(true);
    queryClient.invalidateQueries({queryKey: ["getAnoLectivos"]});
  },
  onError: (error) => {
      if(axios.isAxiosError(error)){
        if (error.response && error.response.data) {
          if(error.response.data?.errors)
            {
              const err = error.response.data?.errors;
              const errorMessages = collectErrorMessages(err);
            setDialogMessage(errorMessages[0]);
            setShowDialog(true);
            }else{
              const errorMessages = error.response.data.message
              setDialogMessage(errorMessages);
              setShowDialog(true);
            }
         }
        }
      }
    }
);

const handleSubmitCreateTrimestre = async (data: z.infer<typeof TFormCreateTrimestre>,e) => {
  e.preventDefault();
  postMutationTrimestre(data)
 }

 const {mutate: patchMutationAnoLectivo} = useMutation({
  mutationFn: patchAnoAcademico,
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ["getAnoLectivos"]});
  },
  onError: (error) => {
    console.log(error);
    if(axios.isAxiosError(error)){
      if (error.response && error.response.data) {
        if(error.response.data?.errors)
          {
            const err = error.response.data?.errors;
            const errorMessages = collectErrorMessages(err);
          setDialogMessage(errorMessages[0]);
          setShowDialog(true);
          }else{
            const errorMessages = error.response.data.message
            setDialogMessage(errorMessages);
            setShowDialog(true);
          }
       }
      }
    }
});

const handleSubmitPatchAno = async (buscar, bool) => {
  const dados = {
    id: buscar,
    values: bool 
  }
  patchMutationAnoLectivo(dados);
 }
 
 const {mutate: putMutationAnoAcademico} = useMutation({
  mutationFn: putAnoAcademico,
  onSuccess: () => {
    setDialogMessage(null);
    setShowDialog(true);
    queryClient.invalidateQueries({queryKey: ["getAnoLectivos"]});
  },
  onError: (error) => {
    console.log(error)
    if(axios.isAxiosError(error)){
      if (error.response && error.response.data) {
        const err = error.response.data?.errors;
        const errorMessages = collectErrorMessages(err);
        setDialogMessage(errorMessages[0]);
        setShowDialog(true);
       }
      }
    }
});

const handleSubmitUpdate = async (data: z.infer<typeof TFormUpdate>,e) => {
  e.preventDefault();
  putMutationAnoAcademico(data)
 }

const [buscar, setBuscar] = React.useState<number>(null);
  const [{data: dados, isLoading: dadosLoading, isSuccess: dadosSuccess, isError: dadosError}, {data: anoLectivos}] = useQueries(
    { 
      queries: 
      [
        {queryKey: ["getAnoLectivos"] , queryFn: getAnoAcademico},
        {queryKey: ["getAnoLectivosId", buscar] , queryFn:()=>getAnoAcademicoId(buscar), enabled: !!buscar},
      ]
    })
    

  React.useEffect(()=>{
      async () => {
            formUpdate.setValue('inicio', anoLectivos?.data?.data?.inicio)
            formUpdate.setValue('termino', anoLectivos?.data?.data?.termino)
            formUpdate.setValue('id', anoLectivos?.data?.data?.id)
      }
  },[buscar])



  const changeResource = (id)=>{
    setBuscar(id)
  }

  const [searchTerm, setSearchTerm] = React.useState("");
  const handleFilterChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredAnos = dados?.data?.data?.filter((ano) =>{
    return ano.nome.toLowerCase().includes(searchTerm)}
  );

    return (
      <section className="m-0 w-screen h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300  grid-flow-col grid-cols-3">
      <Header title={false}/>
      <div className='flex flex-col space-y-2 justify-center items-center w-full'>
        <div className='animate-fade-left animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-in flex flex-col space-y-2 justify-center w-[90%] z-10'>
      <div className='flex flex-col space-y-2 justify-center w-[90%] z-10'> 
       <div className='flex flex-row space-x-2'>
         <div className='relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96'>
             <Search className='absolute text-gray-300 w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7'/>            
             <Input className=' pl-6 indent-2' type='text' value={searchTerm} onChange={handleFilterChange} placeholder='Procure por registros...' />
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
      <DialogTitle className='text-sky-800 text-xl'>Cadastrar Ano Académico</DialogTitle>
      <DialogDescription>
        <p className='text-base text-gray-800'>
        preencha o formulárioe em seguida click em <span className='font-bold text-sky-700'>cadastrar</span> quando terminar.
      </p>
      </DialogDescription>
      </DialogHeader>
      <Form {...formCreate} >
     <form onSubmit={formCreate.handleSubmit(handleSubmitCreateAnoLectivos)} >
     <div className="flex flex-col w-full py-4 bg-white">
        <div className="w-full">
        <label htmlFor="inicio">Íncio<span className='text-red-500'>*</span>
          </label>
          <FormField
          control={formCreate.control}
          name="inicio"
          render={({field})=>(
            <FormItem>
            <Input
              id="inicio"
              type='date' {...field} className={formCreate.formState.errors.inicio?.message && `${animateShake} input-error`}
              />
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
            <Input id="termino" type='date' {...field} className={formCreate.formState.errors.termino?.message && `${animateShake} input-error`}
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
      <DialogTitle className='text-sky-800 text-xl'>Cadastrar Trimestre</DialogTitle>
        <DialogDescription>
          <p className='text-base text-gray-800'>
          esta secção tem como finalidade adicionar um novo trimestre ao ano lectivo corrente.
        </p>
        </DialogDescription>
      </DialogHeader>
      <Form {...formCreateTrimestre} >
     <form onSubmit={formCreateTrimestre.handleSubmit(handleSubmitCreateTrimestre)} >
     <div className="flex flex-col w-full py-4 bg-white">
     <div className="w-full">
          <label htmlFor="numero">Número<span className='text-red-500'>*</span>
          </label>
          <FormField
          control={formCreateTrimestre.control}
          name="numero"
          render={({field})=>(
            <FormItem>
            <Input
              id="numero"
              type='number' {...field} className={formCreateTrimestre.formState.errors.numero?.message && `${animateShake} input-error`}
              onChange={(e)=>{field.onChange(parseInt(e.target.value))}}/>
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className="w-full">
         <label htmlFor="inicio"className='text-sky-700 text-lg font-semibold'>Ínicio<span className='text-red-500'>*</span>
          </label>
          <FormField
          control={formCreateTrimestre.control}
          name="inicio"
          render={({field})=>(
            <FormItem>
            <Input
              id="inicio"
              type='date' {...field} className={formCreateTrimestre.formState.errors.inicio?.message && `${animateShake} input-error`}
              />
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className="w-full">
        <label htmlFor="termino"className='text-sky-700 text-lg font-semibold'>Término<span className='text-red-500'>*</span>
          </label>
          <FormField
          control={formCreateTrimestre.control}
          name="termino"
          render={({field})=>(
            <FormItem>
            <Input id="termino" type='date' {...field} className={formCreateTrimestre.formState.errors.termino?.message && `${animateShake} input-error`}
            />
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
                   <th className={thStyle} >Id</th>
                   <th className={thStyle} >Nome</th>
                   <th className={thStyle} >Acção</th>
                 </tr>
             </thead>
             <tbody >
              {dadosLoading &&
              
              <tr className='w-96 h-32'>
              <td rowSpan={3} colSpan={3} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                  <div className={`${animatePulse}`}>
                  Loading ...
                  </div>
              </td>
          </tr>
            }
            {filteredAnos?.length === 0 &&
            <tr className='w-96 h-32'>
            <td rowSpan={3} colSpan={3} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                <div>
                <AlertTriangle className={`${animateBounce} inline-block triangle-alert`}/>
                     <p className='text-red-500'>Nenum Registro Foi Encontrado</p>
                </div>
            </td>
        </tr>
            }
            {dadosError &&
                 <tr className='w-96 h-32'>
                     <td rowSpan={3} colSpan={3} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                         <div>
                         <AlertTriangle className={`${animateBounce} inline-block triangle-alert`}/>
                              <p className='text-red-500'>Nenum Registro Foi Encontrado</p>
                         </div>
                     </td>
                 </tr>}
                 { dadosSuccess &&
                 filteredAnos?.map((item, index) => (
                     <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
                      {item.activo == true && 
                         <td className={tdStyle}><CheckCircle className='h-5 w-7 text-green-600'/></td>
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
                <DialogTitle className='text-sky-800 text-xl'>Actualizar Ano Académico</DialogTitle>
              <DialogDescription>
                <p className='text-base text-gray-800'>
                altere uma informação do ano e em seguida click em <span className='font-bold text-sky-700'>actualizar</span> quando terminar.
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
            {...field} value={item.id}
            onChange={(e)=>{field.onChange(parseInt( e.target.value))}}
          />
          </FormControl>
        )}
           />
  
              <div className="flex flex-col w-full py-4 bg-white">
              <div className="w-full">
              <label htmlFor="inicio"className='text-sky-700 text-lg font-semibold'>Ínicio<span className='text-red-500'>*</span>
          </label>
                <FormField
                control={formUpdate.control}
                name="inicio"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="inicio"
                    type='date' {...field} className={formUpdate.formState.errors.inicio?.message && `${animateShake} input-error`}
                    />
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>
              </div>
              <div className="w-full">
              <label htmlFor="termino"className='text-sky-700 text-lg font-semibold'>Término<span className='text-red-500'>*</span>
              </label>
                <FormField
                control={formUpdate.control}
                name="termino"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="termino"
                    type='date' {...field} className={formUpdate.formState.errors.termino?.message && `${animateShake} input-error`}
                    />
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
                          <label htmlFor="maxWidth">Ínicio</label>
                          <p>{anoLectivos?.data?.inicio}</p>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <label htmlFor="height">Termino</label>
                          <p className='text-xs'>{anoLectivos?.data?.termino}</p>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <label htmlFor="height">Estado</label>
                          <p className='text-xs'>{anoLectivos?.data?.activo ? "Disponível" : "Indisponível"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                        </div>
                      <Button title='activar' className='h-7 px-5 bg-green-300 text-white font-semibold hover:bg-green-300 rounded-sm border-green-300' onClick={()=>{handleSubmitPatchAno(item.id, true)
                      }}>Yes</Button>
                      <Button title='desactivar' className='h-7 px-5 bg-red-300 text-white font-semibold hover:bg-red-300 rounded-sm border-red-300' onClick={()=>{handleSubmitPatchAno(item.id, false)
                      }}>No</Button>
                         </td>
                     </tr>
                 ))}
             </tbody>
             <tfoot className='sticky bottom-0 bg-white"'>
             <tr>
                 <td colSpan={3} className="py-2 text-blue-500">
                     Total de registros: {filteredAnos?.length}
                 </td>
             </tr>
         </tfoot>
         </table>
     </div>
    </div>
     </div></div>

     <MostrarDialog show={showDialog} message={dialogMessage} onClose={() => setShowDialog(false)} />

    </section>
)
}