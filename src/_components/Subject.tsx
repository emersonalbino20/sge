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
import { EditIcon, PrinterIcon, Trash, CombineIcon, CheckCircleIcon, AlertCircleIcon, SaveIcon, AlertTriangle, Search, ChevronLeft, ChevronRight, Loader} from 'lucide-react'
import { InfoIcon } from 'lucide-react'
import { UserPlus } from 'lucide-react'
import { GraduationCap as Cursos } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea'
import { dataNascimentoZod, emailZod, nomeCompletoZod, telefoneZod, nomeCursoZod, descricaoZod, duracaoZod, cursos } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Select from 'react-select';
import { MyDialog, MyDialogContent } from './my_dialog'
import { tdStyle, thStyle, trStyle, tdStyleButtons } from './table'
import Header from './Header'
import { animateBounce, animatePulse } from '@/AnimationPackage/Animates'
import MostrarDialog from './MostrarDialog';
import { useGetIdSubjectQuery, useGetSubjectQuery, usePostMatchCurseToSubject, usePostSubject, usePutSubject } from '@/_queries/UseSubjectQuery'
import { useGetCurseQuery } from '@/_queries/UseCurseQuery'


const TFormCreate =  z.object({
  nome: nomeCursoZod,
  descricao: descricaoZod
})

const TFormUpdate =  z.object({
  nome: nomeCursoZod,
  descricao: descricaoZod,
  id: z.number()
})

/*Vinculo de disciplina e curso*/
const TFormConnect =  z.object({
  disciplinaId: z.number(),
  cursoId: cursos
})

export default function Subject(){

  const formCreate  = useForm<z.infer<typeof TFormCreate>>({
    mode: 'all', 
    resolver: zodResolver(TFormCreate)
   })

   const formConnect  = useForm<z.infer<typeof TFormConnect>>({
    mode: 'all', 
    resolver: zodResolver(TFormConnect)
   })
  
  const formUpdate  = useForm<z.infer<typeof TFormUpdate>>({
    mode: 'all', 
    resolver: zodResolver(TFormUpdate)
    })

//Get
    const[buscar, setBuscar] = React.useState('');
    const { data, isError, isLoading } = useGetSubjectQuery();
    const { dataSubjectId, isFetched } = useGetIdSubjectQuery(buscar);
    const { data: dataCurse } = useGetCurseQuery();
    
   //Vincular um curso a multiplas disciplina
   const[selectedValues, setSelectedValues] = React.useState([]);
   const cursoOptions = dataCurse?.data?.data?.map((c)=>{return {value: c.id, label: c.nome}});
   const handleChange = (selectedOptions) => {
     const values = selectedOptions.map(option => option.value);
     setSelectedValues(values);
   };

//Post 
  const [showDialog, setShowDialog] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState<string | null>(null);

  const { postSubject, responsePostSubject } = usePostSubject();
  const handleSubmitCreate = async (data: z.infer<typeof TFormCreate>,e) => {
    e.preventDefault();
    postSubject(data);
    if( responsePostSubject )
      {
        setDialogMessage(responsePostSubject);
        setShowDialog(true);
      }else{
        setDialogMessage(null);
        setShowDialog(true)
	}
}

  const { postMatchSubject, error } = usePostMatchCurseToSubject();
  
  const handleSubmitConnect = async (data: z.infer<typeof TFormConnect>,e) => {
    e.preventDefault();
    postMatchSubject(data);
    if (error) {
      setDialogMessage(error);
      setShowDialog(true);
    } else {
      setDialogMessage(null);
      setShowDialog(true);
    }

  }

//Put
    //Update fields wth datas
    React.useEffect(()=>{
      formConnect.setValue('disciplinaId', dataSubjectId?.data?.id);
      formUpdate.setValue('id', dataSubjectId?.data?.id);
      formUpdate.setValue('nome', dataSubjectId?.data?.nome);
      formUpdate.setValue('descricao', dataSubjectId?.data?.descricao);
    }, [buscar, isFetched])

    const { putSubject, responsePutSubject } = usePutSubject();

    const handleSubmitUpdate = async (data: z.infer<typeof TFormUpdate>,e) => {
      e.preventDefault();
      putSubject(data);
      if( responsePutSubject )
        {
          setDialogMessage(responsePutSubject);
          setShowDialog(true);
        }else{
          setDialogMessage(null);
          setShowDialog(true);
        }
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
            <Button className='h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-500 rounded-sm'></Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                <DialogTitle className='text-blue-600 text-xl'>Actualizar Disciplina</DialogTitle>
              <DialogDescription>
                <p className='text-base text-gray-800'>
                altere uma informação da disciplina e em seguida click em <span className='font-bold text-blue-500'>actualizar</span> quando terminar.
              </p>
              </DialogDescription>
                </DialogHeader>
                <Form {...formUpdate} >
              <form onSubmit={formUpdate.handleSubmit(handleSubmitUpdate)} >
              <div className="flex flex-col w-full py-4 bg-white">
              <div className="w-full">
              <Label htmlFor="nome"className='text-blue-500 text-lg font-semibold'>Nome<span className='text-red-500'>*</span>
          </Label>
                <FormField
                control={formUpdate.control}
                name="nome"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="nome"
                    className={formUpdate.formState.errors.nome?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                   'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-blue-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'} {...field}
                  />
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>
                
              </div>
              <div className="w-full">
              <Label htmlFor="descricao"className='text-blue-500 text-lg font-semibold'>Descrição<span className='text-red-500'>*</span>
          </Label>
                <FormField
                control={formUpdate.control}
                name="descricao"
                render={({field})=>(
                  <FormItem>
                  <Textarea id='descricao' className={formUpdate.formState.errors.descricao?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                  'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-blue-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'} placeholder="Dê uma descrição ao curso." {...field}/>
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
        <Dialog>
        <DialogTrigger asChild >
        <div title='vincular' className='relative flex justify-center items-center'>
        <CombineIcon className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
          <Button className='h-7 px-5 bg-yellow-600 text-white font-semibold hover:bg-yellow-600 rounded-sm border-yellow-600'></Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle>Vincular Disciplina {dataSubjectId?.data?.nome}</DialogTitle>
                <DialogDescription>
                  Vincula a disciplina de <span className='text-blue-500 font-medium'>{dataSubjectId?.data?.nome}</span> em multiplos cursos.
                </DialogDescription>
              </DialogHeader>
              <Form {...formConnect} >
            <form onSubmit={formConnect.handleSubmit(handleSubmitConnect)
            
            } >
            <div className="flex flex-col w-full py-4 bg-white">              
            <div className="w-full">
            <FormField
            control={formConnect.control}
            name="cursoId"
            render={({field})=>(
            <FormItem>
              <Label htmlFor="disciplina" className="text-right">
              Cursos
            </Label>
                <FormControl>
                <Select
                name="curso"
                isMulti
                options={cursoOptions}
                className="basic-multi-select"
                onChange={handleChange}
                classNamePrefix="select"
              />
                </FormControl>
              <FormMessage className='text-red-500 text-xs'/>
            </FormItem>)
            }
            />
            </div>
          <div>
          </div>
        </div>
    <DialogFooter>
      <Button title='vincular' type="submit" className='bg-blue-500 border-blue-500 text-white hover:bg-blue-500 hover:text-white w-12'  onClick={()=>{
              formConnect.setValue('cursoId', selectedValues)
            }}><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
    </DialogFooter>
    </form></Form>
  </DialogContent>
        </Dialog>
        <div title='ver dados' className='relative flex justify-center items-center cursor-pointer'>
              
              <Popover >
        <PopoverTrigger asChild className='bg-white'>

        <div className='relative flex justify-center items-center cursor-pointer'>  <InfoIcon className='w-5 h-4 absolute text-white'/> 
          <Button className='h-7 px-5 bg-green-600 text-white font-semibold hover:bg-green-500 rounded-sm border-green-600'></Button>
          </div>
        </PopoverTrigger >
        <PopoverContent className="w-80 bg-white">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none text-gray-800">Dados da Disiciplina</h4>
              <p className="text-sm text-muted-foreground">
                Inspecione os dados da displina
              </p>
            </div>
            <div className="grid gap-2">
            <div className="">
              <label htmlFor="height">Descrição</label>
              <p className='indent-2 text-justify text-xs text-pretty'>{dataSubjectId?.data?.descricao}</p>
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
      <div className="m-0 w-screen h-screen  bg-gray-50">
       <Header />

     <div className="w-full bg-white p-4 rounded-lg shadow">
      
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
      <div className='flex flex-row space-x-2'>
            <div className='relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96'>
             <Search className='absolute text-gray-300 w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7'/>            
             <Input 
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
             className=' pl-6 indent-2' type='text' placeholder='Procure por registros...' /></div>
             <Dialog >
    <DialogTrigger asChild>
    <div title='cadastrar' className='relative flex justify-center items-center'>
    <Cursos className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
      <Button className='h-8 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-500 rounded-sm'></Button>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
      <DialogTitle className='text-blue-600 text-xl'>Cadastrar Disciplina</DialogTitle>
        <DialogDescription>
                <p className='text-base text-gray-800'>
                preencha o formulário e em seguida click em <span className='font-bold text-blue-500'>cadastrar</span> quando terminar.
              </p>
              </DialogDescription>
      </DialogHeader>
      <Form {...formCreate} >
     <form onSubmit={formCreate.handleSubmit(handleSubmitCreate)} >
     <div className="flex flex-col w-full py-4 bg-white">
        <div className="w-full">
        <Label htmlFor="nome"className='text-blue-500 text-lg font-semibold'>Nome<span className='text-red-500'>*</span>
          </Label>
          <FormField
          control={formCreate.control}
          name="nome"
          render={({field})=>(
            <FormItem>
            <Input
              id="nome"
              className={formCreate.formState.errors.nome?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
              'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-blue-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'} {...field}
            />
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
          
        </div>
        <div className="w-full">
        <Label htmlFor="descricao"className='text-blue-500 text-lg font-semibold'>Descrição<span className='text-red-500'>*</span>
          </Label>
          <FormField
          control={formCreate.control}
          name="descricao"
          render={({field})=>(
            <FormItem>
             <Textarea id='descricao' className={formCreate.formState.errors.descricao?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
              'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-blue-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'} placeholder="Dê uma descrição ao curso." {...field}/>
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
     <MostrarDialog show={showDialog} message={dialogMessage} onClose={() => setShowDialog(false)} />

    </div>

)
}
