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
import { AlertCircleIcon, CheckCircleIcon, ChevronLeft, ChevronRight, Combine, DatabaseBackupIcon, EditIcon, Library, Loader, PrinterIcon, SaveIcon, Trash} from 'lucide-react'
import { InfoIcon, AlertTriangle, Search } from 'lucide-react'
import { GraduationCap as Cursos } from 'lucide-react';
import {anoLectivo, classe, anoLectivoId, cursoId, custoMatricula, sala, capacidade, localizacao, idZod } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm} from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Header from './Header'
import { animateBounce, animateFadeLeft, animatePulse, animateShake } from '@/AnimationPackage/Animates'
import { Textarea } from '@/components/ui/textarea'
import { getSalas, getSalasId, postSalas, putSalas } from '@/_queries/Salas'
import MostrarDialog from './MostrarDialog';
import { useGetClassRoomQuery, useGetIdClassRoomdQuery, usePostClassRoom, usePostClassToClassRoom, usePutClassRoom } from '@/_queries/UseClassRoomQuery'
import { AlertErro, AlertSucesso } from './Alert'
import { useGetCurseQuery, useGetIdGradeCurseQuery } from '@/_queries/UseCurseQuery'
import { useGetPeriodQuery } from '@/_queries/UsePeriodQuery'

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

const TformClassToClassRoom = z.object({
  nome: sala,
  cursoId: idZod,
  classeId: idZod,
  turnoId: idZod,
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

  const formClassToClassRoom  = useForm<z.infer<typeof TformClassToClassRoom>>({
    mode: 'all', 
    resolver: zodResolver(TformClassToClassRoom)
    })

    const { watch } = formClassToClassRoom;
    const [ fieldCurse ] = watch(['cursoId']);

  //Get
  const[buscar, setBuscar] = React.useState('');
  const { data, isError, isLoading } = useGetClassRoomQuery();
  const { data: dataCurse } = useGetCurseQuery();
  const { data: dataPeriod } = useGetPeriodQuery();
  const { dataClassRoomId, isFetched } = useGetIdClassRoomdQuery(buscar);
  const { dataGradesCurse } = useGetIdGradeCurseQuery(fieldCurse);

  //Post
  const { postClassRoom, postError, postLevel } = usePostClassRoom();
  const handleSubmitCreate = async (data: z.infer<typeof TFormCreate>,e) => {
    e.preventDefault();
    postClassRoom(data);
  }

  const { postClass, postClassError, postClassLevel } = usePostClassToClassRoom();
  const handleSubmitClassToClassRoom = async (data: z.infer<typeof TformClassToClassRoom>,e) => {
    e.preventDefault();
    postClass(data);
  }

//Put
    //Update fields wth datas
    React.useEffect(()=>{
      formClassToClassRoom.setValue('id', dataClassRoomId?.data?.id);
      formUpdate.setValue('id', dataClassRoomId?.data?.id);
      formUpdate.setValue('nome', dataClassRoomId?.data?.nome);
      formUpdate.setValue('localizacao', dataClassRoomId?.data?.localizacao);
      formUpdate.setValue('capacidade', dataClassRoomId?.data?.capacidade);
    }, [buscar, isFetched])

    const { putClassRoom, updateError, updateLevel } = usePutClassRoom();

    const handleSubmitUpdate = async (data: z.infer<typeof TFormUpdate>,e) => {
      e.preventDefault();
      putClassRoom(data);
    }

    const putId = (id) => {
      setBuscar(id)
    }
      
    const colunas = ["Id", "Nome", "Ações"];

    const renderAcoes = () => (
      <>
      <Dialog >
          <DialogTrigger asChild >
          <div title='actualizar' className='relative flex justify-center items-center'>
          <EditIcon className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
            <Button  className='h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-500 rounded-sm'></Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                <DialogTitle className='text-blue-600 text-xl'>Actualizar Sala</DialogTitle>
              <DialogDescription>
                <p className='text-base text-gray-800'>
                altere uma informação da sala  e em seguida click em <span className='font-bold text-blue-500'>actualizar</span> quando terminar.
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
      <Dialog>
    <DialogTrigger asChild>
    <div title='cadastrar turma' className='relative flex justify-center items-center'>
      <Combine className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
      <Button className='h-7 px-5 bg-orange-600 text-white font-semibold hover:bg-orange-500 border-orange-500 rounded-sm'></Button>
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
      <Form {...formClassToClassRoom} >
     <form onSubmit={formClassToClassRoom.handleSubmit(handleSubmitClassToClassRoom)} >
     <FormField
          control={formClassToClassRoom.control}
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
        <label htmlFor="nome">Nome<span className='text-red-500'>*</span>
              </label>
          <FormField
          control={formClassToClassRoom.control}
          name="nome"
          render={({field})=>(
            <FormItem>
            <Input
              id="nome"
              type='text' {...field} className={formClassToClassRoom.formState.errors.nome?.message && `${animateShake} input-error`} 
              />
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className="w-full">
        <FormField
          control={formClassToClassRoom.control}
          name={'cursoId'}
          render={({field})=>(
          <FormItem>
        <label htmlFor="curso">Cursos<span className='text-red-500'>*</span>
              </label>
              <FormControl>
              <select {...field}  id='curso' onChange={(e)=>{field.onChange(parseInt(e.target.value))}} >
                      <option value="">Selecione o curso</option>
                      {
                        dataCurse?.data?.data?.map((field)=>{
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
              control={formClassToClassRoom.control}
              name={'classeId'}
              render={({field})=>(
              <FormItem>
                 <label htmlFor="classe">Classes<span className='text-red-500'>*</span>
              </label>
                  <FormControl>
                  <select {...field} className={
                      formClassToClassRoom.formState.errors.classeId?.message && `${animateShake}  select-error`} id='classe' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                      <option >Seleciona a classe</option>
                      {
                            dataGradesCurse?.data?.data?.map((field)=>{
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
              control={formClassToClassRoom.control}
              name={'turnoId'}
              render={({field})=>(
              <FormItem>
                 <label htmlFor="turno">Turnos<span className='text-red-500'>*</span>
              </label>
                  <FormControl>
                    <select id='turno' {...field} className={
                      formClassToClassRoom.formState.errors.turnoId?.message && `${animateShake}  select-error`} onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                      <option>Selecione o turno</option>
                      {
                        dataPeriod?.data?.data?.map((field)=>{
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
      <h4 className="font-medium leading-none text-gray-800">Dados da Sala</h4>
      <p className="text-sm text-muted-foreground">
        Inspecione os dados
      </p>
    </div>
    <div className="grid gap-2">
      <div className="grid grid-cols-3 items-center gap-4">
        <label htmlFor="maxWidth">Capacidade</label>
        <p>{dataClassRoomId?.data?.capacidade}</p>
      </div>
      <div className="">
        <label htmlFor="height">Localização</label>
        <p className='indent-2 text-justify text-xs text-pretty'>{dataClassRoomId?.data?.localizacao}</p>
      </div>
    </div>
  </div>
</PopoverContent>
      </Popover>
        </div>
      </>
    )
  
  const [pagina, setPagina] = React.useState(1);
  const [termoBusca, setTermoBusca] = React.useState('');
  const [itensPorPagina, setItensPorPagina] = React.useState<number>(5);

  const dadosFiltrados = data?.data?.data?.filter(item =>
    Object.values(item).some(valor =>
      valor.toString().toLowerCase().includes(termoBusca.toLowerCase())
    )
  );

  const totalPaginas = Math.ceil(dadosFiltrados?.length / itensPorPagina);
  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const dadosPaginados = dadosFiltrados?.slice(inicio, fim);

    return (
      <section className="m-0 w-screen h-screen  bg-gray-50">
      <Header />
      { (updateLevel === 1) &&(
        <AlertSucesso message={updateError} />  
    )
      }
      { (updateLevel === 2) &&(
        <AlertErro message={updateError} /> )
      }
      { (postLevel === 1) &&(
        <AlertSucesso message={postError} />  )
      }
      { (postLevel === 2) &&(
          <AlertErro message={postError} />  )
      }
      { (postClassLevel === 1) &&(
        <AlertSucesso message={postClassError} />  )
      }
      { (postClassLevel === 2) &&(
          <AlertErro message={postClassError} />  )
      }
     <div className="w-full bg-white p-4 rounded-lg shadow">
      
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
      <div className='flex flex-row space-x-2'>
            <div className='relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96'>
             <Search className='absolute text-gray-300 w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7'/>            
             <Input 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
             className=' pl-6 indent-2' type='text' placeholder='Procure por registros...' />
             </div>
             <Dialog>
    <DialogTrigger asChild>
    <div title='cadastrar' className='relative flex justify-center items-center'>
    <Cursos className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
      <Button className='h-8 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-500 rounded-sm'></Button>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
      <DialogTitle className='text-blue-600 text-xl'>Cadastrar Sala</DialogTitle>
        <DialogDescription>
          <p className='text-base text-gray-800'>
          preencha o formulário e em seguida click em <span className='font-bold text-blue-500'>actualizar</span> quando terminar.
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
        <div className="flex gap-2">
        
          <select onChange={
            (e)=>{
              setItensPorPagina(parseInt(e.target.value, 10) || 0)}}>
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={30}>30 por página</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
            {colunas.map((coluna, index) => (
            <th key={index} className="px-6 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider">{coluna}</th>
             ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {isLoading &&
              
              <tr className='w-96 h-32'>
              <td rowSpan={3} colSpan={3} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                  <div >
                  <Loader className={`${animatePulse} inline-block .Loading-alert`}/>
                  <p className='text-red-500'>Carregando</p>
                  </div>
                  
              </td>
          </tr>
            }
            {(isError || dadosPaginados?.length === 0) &&
             <tr className='w-96 h-32'>
             <td rowSpan={3} colSpan={3} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
               <div>
               <AlertTriangle className={`${animateBounce} inline-block triangle-alert`}/>
                    <p className='text-red-500'>Nenum Registro Foi Encontrado</p>
               </div>
             </td>
           </tr>
            }
            {!isError && dadosPaginados?.map((turno) => (
              <tr key={turno.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{turno.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{turno.nome}</div>
                </td>
                
                <td className="py-4 whitespace-nowrap text-right text-sm font-medium flex space-x-2" onClick={()=>{
                           putId(turno.id)
                         }}>
                {renderAcoes()}
              
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setPagina(Math.max(1, pagina - 1))}
            disabled={pagina === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPagina(Math.min(totalPaginas, pagina + 1))}
            disabled={pagina === totalPaginas}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Próxima
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{inicio + 1}</span> a{' '}
              <span className="font-medium">{Math.min(fim, dadosFiltrados?.length)}</span> de{' '}
              <span className="font-medium">{dadosFiltrados?.length}</span> resultados
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setPagina(Math.max(1, pagina - 1))}
                disabled={pagina === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-none bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {data?.data?.data?.length > 0 && [...Array(totalPaginas)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPagina(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                    ${pagina === i + 1
                      ? 'z-10 bg-blue-50 border-none text-blue-600'
                      : 'bg-white border-none text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPagina(Math.min(totalPaginas, pagina + 1))}
                disabled={pagina === totalPaginas}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md   bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 border-none"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
    </section>
   
)
}
