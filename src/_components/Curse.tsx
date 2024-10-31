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
import { AlertCircleIcon, AlertTriangle, CheckCircleIcon, EditIcon, PrinterIcon, SaveIcon, Search, Trash} from 'lucide-react'
import { InfoIcon, CombineIcon } from 'lucide-react'
import { UserPlus } from 'lucide-react'
import { GraduationCap as Cursos } from 'lucide-react';
import DataTable from 'react-data-table-component'
import { Textarea } from '@/components/ui/textarea'
import { dataNascimentoZod, emailZod, nomeCompletoZod, telefoneZod, nomeCursoZod, descricaoZod, duracaoZod, disciplinas } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Select from 'react-select';
import { MyDialog, MyDialogContent } from './my_dialog'
import { tdStyle, thStyle, trStyle, tdStyleButtons } from './table'
import { Link } from 'react-router-dom'
import Header from './Header'
import { animateBounce } from '@/AnimationPackage/Animates'
import MostrarDialog from './MostrarDialog';

const TFormCreate =  z.object({
  nome: nomeCursoZod,
  descricao: descricaoZod,
  duracao: duracaoZod,
  disciplinas: disciplinas,
})

const TFormUpdate =  z.object({
  nome: nomeCursoZod,
  descricao: descricaoZod,
  duracao: duracaoZod,
  id: z.number()
})

/*Vinculo de curso e disciplina*/
const TFormConnect =  z.object({
  idCursos: z.number(),
  disciplinas: disciplinas,
  nomeDisciplinas: z.array(z.string())
})

/*Desvinculo de curso e disciplina*/
const TFormUnConnect =  z.object({
  idCursos: z.number(),
  disciplinas: disciplinas,
  nomeDisciplinas: z.array(z.string())
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

const formConnect  = useForm<z.infer<typeof TFormConnect>>({
  mode: 'all', 
  resolver: zodResolver(TFormConnect)
 })

 const formUnConnect  = useForm<z.infer<typeof TFormUnConnect>>({
  mode: 'all', 
  resolver: zodResolver(TFormUnConnect)
 })

const [updateTable, setUpdateTable] = React.useState(false)
const [showDialog, setShowDialog] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState<string | null>(null);
const handleSubmitCreate = async (data: z.infer<typeof TFormCreate>,e) => {
      
await fetch(`http://localhost:8000/api/cursos`,{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then((resp => resp.json()))
  .then((resp) =>{
    
    if (resp.statusCode != 200) {
      const sms = resp.message;
      setDialogMessage(sms);
       setShowDialog(true);
    }else{
      setDialogMessage(null);
      setShowDialog(true);
    }
    console.log(resp)
  })
  .catch((error) => console.log(`error: ${error}`))
  setUpdateTable(!updateTable)
  //console.log(data)
}


const handleSubmitUpdate = async (data: z.infer<typeof TFormUpdate>,e) => {
  await fetch(`http://localhost:8000/api/cursos/${data.id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then((resp => resp.json()))
    .then((resp) =>{
      
      if (resp.statusCode != 200) {
        const sms = resp.message;
        setDialogMessage(sms);
        setShowDialog(true);  
      }else{
        setDialogMessage(null);
        setShowDialog(true); 
      }
      console.log(resp)
      })
    .catch((error) => console.log(`error: ${error}`))
    setUpdateTable(!updateTable)
}

const handleSubmitConnect = async (data: z.infer<typeof TFormConnect>,e) => {
     
  const disciplinas = 
  {
    disciplinas: data.disciplinas
  }

  await fetch(`http://localhost:8000/api/cursos/${data.idCursos}/disciplinas`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(disciplinas)
        })
        .then((resp => resp.json()))
        .then((resp) =>{ 
          
          if (resp.message != null) {
            let index = parseInt(Object.keys(resp.errors.disciplinas)[0]);
           
            setDialogMessage(resp.errors.disciplinas[index]+"\n Disciplina: "+data.nomeDisciplinas[index]);
        setShowDialog(true); 
          }else{
            setDialogMessage(null);
        setShowDialog(true); 
          }
        })
        .catch((error) => console.log(`error: ${error}`))
    }

    const handleSubmitUnConnect = async (data: z.infer<typeof TFormUnConnect>,e) => {
      
      const disciplinas = 
      {
        disciplinas: data.disciplinas
      }
    
      await fetch(`http://localhost:8000/api/cursos/${data.idCursos}/disciplinas`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(disciplinas)
            })
            .then((resp => resp.json()))
            .then((resp) =>{ 
            
              if (resp.message != null) {
                let index = parseInt(Object.keys(resp.errors.disciplinas)[0]);
                 
                setDialogMessage(resp.errors.disciplinas[index]+"\n Disciplina: "+data.nomeDisciplinas[index]);
                setShowDialog(true); 
              }else{
                
                setDialogMessage(null);
                setShowDialog(true); 
              }
            })
            .catch((error) => console.log(`error: ${error}`))
        }

const[buscar, setBuscar] = React.useState();
const[nome, setNome] = React.useState();
const[descricao, setDescricao] = React.useState();
const[duracao,setDuracao] = React.useState();
const[id,setId] = React.useState();
React.useEffect(()=>{
    const search = async () => {
        const resp = await fetch(`http://localhost:8000/api/cursos/${buscar}`);
        const receve = await resp.json()
        setNome(receve.nome)
        setDescricao(receve.descricao)
        setDuracao(receve.duracao)
        setId(receve.id)
        formUpdate.setValue('nome', receve.nome)
        formUpdate.setValue('descricao', receve.descricao)
        formUpdate.setValue('duracao', receve.duracao)
        formUpdate.setValue('id', receve.id)
    }
    search()
},[buscar])

  const changeResource = (id)=>{
    setBuscar(id)
    }

  const [idAno, setIdAno] = React.useState<number>(0);
  const [disciplina, setDisciplina] = React.useState([]);
  const URLDISCIPLINA = "http://localhost:8000/api/disciplinas"
  useEffect( () => {
    const respFetch = async () => {
      let resp = await fetch (URLDISCIPLINA);
      const respJson = await resp.json();
      setDisciplina(respJson.data)

      resp = await fetch(`http://localhost:8000/api/ano-lectivos/`);
        const receve = await resp.json()
        var meuarray = receve.data.find((c)=>{
          return c.activo === true
        })
        setIdAno(meuarray.id)
    } 
  respFetch()
  },[])

   

       //Vincular um curso a multiplas disciplina
       const[selectedValues, setSelectedValues] = React.useState([]);
       const[selectedLabels, setSelectedLabels] = React.useState([]);
       const disciplinaOptions = disciplina.map((c)=>{return {value: c.id, label: c.nome}});
       const handleChange = (selectedOptions) => {
         // Extrair valores e labels
         const values = selectedOptions.map(option => option.value);
         setSelectedValues(values);
         const labels = selectedOptions.map(option => option.label);
         setSelectedLabels(labels);
       };

  
    
        const [dados, setDados] = React.useState([])
        const [dataApi, setDataApi] = React.useState([])
        const URL = "http://localhost:8000/api/cursos"
       
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
      <>
      { idAno == 0 ? <div className='w-screen min-h-screen bg-scroll bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300 flex items-center justify-center'>
      <div className='w-full text-center text-4xl text-red-600 md:text-2xl lg:text-2xl'>
          <div >
              <AlertTriangle className={`${animateBounce} inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12`}/>
              <p className='text-red-500'>SELECIONE O ANO LECTIVO</p>
              <p className='text-red-500 italic font-semibold text-sm cursor-pointer'><Link to={'/AcademicYearPage'}>Selecionar agora</Link></p>
          </div>
      </div>
        </div> : (
      <section  className="m-0 w-screen h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300  grid-flow-col grid-cols-3">
      <Header title={false}/>
       
      <div className='flex flex-col space-y-2 justify-center items-center w-full'> 
      <div className='animate-fade-left animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-in flex flex-col space-y-2 justify-center w-[90%] z-10'>
          
       <div className='flex flex-row space-x-2'>
         <div className='relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96'>
             <Search className='absolute text-gray-300 w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7'/>            
             <Input className=' pl-6  indent-2' type='text' placeholder='Procure por registros...' onChange={handleFilter}/>
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
      <DialogTitle className='text-sky-800 text-xl'>Cadastrar Curso</DialogTitle>
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
        <Label htmlFor="name"className='text-sky-700 text-lg font-semibold'>Nome<span className='text-red-500'>*</span>
          </Label>
          <FormField
          control={formCreate.control}
          name="nome"
          render={({field})=>(
            <FormItem>
            <Input
              id="name"
              className={formCreate.formState.errors.nome?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
            'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'} {...field}
            />
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
          
        </div>
        <div className="w-full">
          <Label htmlFor="descricao"className='text-sky-700 text-lg font-semibold'>Descrição<span className='text-red-500'>*</span>
          </Label>
          <FormField
          control={formCreate.control}
          name="descricao"
          render={({field})=>(
            <FormItem>
             <Textarea id='descricao' className={formCreate.formState.errors.descricao?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
            'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'} placeholder="Dê uma descrição ao curso." {...field}/>
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
          
        
        </div>
        <div className="w-full">
        <Label htmlFor="duracao"className='text-sky-700 text-lg font-semibold'>Ano de Duração<span className='text-red-500'>*</span>
          </Label>
          <FormField
          control={formCreate.control}
          name="duracao"
          render={({field})=>(
            <FormItem>
             <Input id='duracao' type="number" className={formCreate.formState.errors.duracao?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:outline-none focus:text-red-600 font-semibold  focus:border-red-500 py-4 mb-2':
            'w-full text-md border-2 border-gray-300 text-gray-600 focus:outline-none focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'} {...field} onChange={(e)=>{field.onChange(parseInt(e.target.value))}}/>
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
            <DialogTitle className='text-sky-800 text-xl'>Actualizar Curso</DialogTitle>
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
                    className={formUpdate.formState.errors.nome?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                  'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'} {...field}
                  />
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>
                
              </div>
              <div className="w-full">
              <Label htmlFor="descricao"className='text-sky-700 text-lg font-semibold'>Descrição<span className='text-red-500'>*</span>
              </Label>
                <FormField
                control={formUpdate.control}
                name="descricao"
                render={({field})=>(
                  <FormItem>
                  <Textarea id='descricao' className={formUpdate.formState.errors.descricao?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                  'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'} placeholder="Dê uma descrição ao curso." {...field}/>
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>
                
              
              </div>
              <div className="w-full">
              <Label htmlFor="duracao"className='text-sky-700 text-lg font-semibold'>Ano de Duração<span className='text-red-500'>*</span>
              </Label>
                <FormField
                control={formUpdate.control}
                name="duracao"
                render={({field})=>(
                  <FormItem>
                  <Input id='duracao' type="number" className={formUpdate.formState.errors.duracao?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                  'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'} {...field} onChange={(e)=>{field.onChange(parseInt(e.target.value))}}/>
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
                    <DialogTitle>Vincular Curso de {item.nome}</DialogTitle>
                    <DialogDescription>
                    Essa secção tem como objectivo relacionar cursos em alguma disciplina especifíca.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...formConnect} >
                <form onSubmit={formConnect.handleSubmit(handleSubmitConnect)
                
                } >
                <div className="flex flex-col w-full py-4 bg-white">              
                <div className="w-full">
                <FormField
                control={formConnect.control}
                name="disciplinas"
                render={({field})=>(
                <FormItem>
                  <Label htmlFor="disciplina" className="text-right">
                  Disciplinas
                </Label>
                    <FormControl>
                    <Select
                    name="disciplina"
                    isMulti
                    options={disciplinaOptions}
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
          <Button type="submit" title='vincular' className='bg-blue-500 border-blue-500 text-white hover:bg-blue-500 hover:text-white w-12'  onClick={()=>{
                  formConnect.setValue('disciplinas', selectedValues)
                  formConnect.setValue('nomeDisciplinas', selectedLabels)
                  formConnect.setValue('idCursos', item.id);
                }}><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
        </DialogFooter>
        </form></Form>
      </DialogContent>
                          </Dialog>
                          <Dialog>
            <DialogTrigger asChild >
            <div title='desvincular' className='relative flex justify-center items-center'>
            <Trash className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
              <Button className='h-7 px-5 bg-red-600 text-white font-semibold hover:bg-red-600 rounded-sm border-red-600'></Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                  <DialogHeader>
                    <DialogTitle>Desvincular Curso de {item.nome}</DialogTitle>
                    <DialogDescription>
                    Essa secção tem como objectivo desvincular a relação existente entre cursos e algumas disciplinas especifícas.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...formConnect} >
                <form onSubmit={formUnConnect.handleSubmit(handleSubmitUnConnect)
                
                } >
                <div className="flex flex-col w-full py-4 bg-white">              
                <div className="w-full">
                <FormField
                control={formUnConnect.control}
                name="disciplinas"
                render={({field})=>(
                <FormItem>
                  <Label htmlFor="disciplina" className="text-right">
                  Disciplinas
                </Label>
                    <FormControl>
                    <Select
                    name="disciplina"
                    isMulti
                    options={disciplinaOptions}
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
          <Button title='desvincular' type="submit" className='bg-red-500 border-red-500 text-white hover:bg-red-500 hover:text-white w-12' onClick={()=>{
                  formUnConnect.setValue('disciplinas', selectedValues)
                  formUnConnect.setValue('nomeDisciplinas', selectedLabels)
                  formUnConnect.setValue('idCursos', item.id);
                }}><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
        </DialogFooter>
        </form></Form>
      </DialogContent>
                          </Dialog>
                          <div title='ver dados' className='relative flex justify-center items-center cursor-pointer'>
                                
                                <Popover >
                          <PopoverTrigger asChild className='bg-white'>

                          <div title='ver dados' className='relative flex justify-center items-center cursor-pointer'>  <InfoIcon className='w-5 h-4 absolute text-white'/> 
                            <Button  className='h-7 px-5 bg-green-600 text-white font-semibold hover:bg-green-600 rounded-sm border-green-600'></Button>
                            </div>
                          </PopoverTrigger >
                          <PopoverContent className="w-80 bg-white">
                            <div className="grid gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium leading-none text-gray-800">Dados do Curso</h4>
                                <p className="text-sm text-muted-foreground">
                                  Inspecione os dados do curso
                                </p>
                              </div>
                              <div className="grid gap-2">
                                
                              <div className="">
                            <label htmlFor="height">Descrição</label>
                            <p className='indent-2 text-justify text-xs text-pretty'>{descricao}</p>
                            </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <label htmlFor="height">Duração</label>
                                  <p className='text-xs'>{duracao} Anos</p>
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


     <MostrarDialog show={showDialog} message={dialogMessage} onClose={() => setShowDialog(false)} />
    </section>)}
    </>
)
}