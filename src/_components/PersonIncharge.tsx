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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { UserPlus, Trash, InfoIcon, AlertCircleIcon, CheckCircleIcon, EditIcon, PrinterIcon, SaveIcon, AlertTriangle, Search } from 'lucide-react'
import DataTable from 'react-data-table-component'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { emailZod, telefoneZod, ruaZod, bairroZod, numeroCasaZod, idZod, nomeCompletoEncarregadoZod } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { MyDialog, MyDialogContent } from './my_dialog'
import InputMask from 'react-input-mask'
import { tdStyle, thStyle, trStyle, tdStyleButtons } from './table'
import { getCookies, removeCookies } from '@/_cookies/Cookies'
import { Link } from 'react-router-dom'
import Header from './Header'
import { useHookFormMask } from 'use-mask-input'
import { animateBounce } from '@/AnimationPackage/Animates'

const TForm =  z.object({
  nomeCompleto: nomeCompletoEncarregadoZod,
  telefone: telefoneZod,
  email: emailZod,
  parentescoId: z.number(),
  bairro: bairroZod,
  rua: ruaZod,
  numeroCasa: numeroCasaZod
})

const TFormUpdate =  z.object({
  nomeCompleto: nomeCompletoEncarregadoZod,
  telefone: telefoneZod,
  email: emailZod,
  parentescoId: z.number(),
  bairro: bairroZod,
  rua: ruaZod,
  numeroCasa: numeroCasaZod,
  responsavelId: idZod,
})

const TFormDelete = z.object({
  responsavelId: idZod
})


type FormProps =  z.infer<typeof TForm>;
type FormPropsUpdate =  z.infer<typeof TFormUpdate>;
type FormPropsDelete =  z.infer<typeof TFormDelete>;
export default function PersonIncharge (){
  const form  = useForm<z.infer<typeof TForm>>({
    mode: 'all', 
    resolver: zodResolver(TForm),
    defaultValues:{
      numeroCasa: 1}
   })
   const { register } = form;
   const registerWithMask = useHookFormMask(register);
   const formUpdate  = useForm<z.infer<typeof TFormUpdate>>({
    mode: 'all', 
    resolver: zodResolver(TFormUpdate)
   })
   const upWithMask = useHookFormMask(formUpdate.register)
   const formDelete  = useForm<z.infer<typeof TFormDelete>>({
    mode: 'all', 
    resolver: zodResolver(TFormDelete)
   })

    const [updateTable, setUpdateTable] = React.useState(false)
    const [showModal, setShowModal] = React.useState(false);
    const [modalMessage, setModalMessage] = React.useState('');
   const handleSubmitCreate = async (data: z.infer<typeof TForm>,e) => {
          
    const dados = 	{
      nomeCompleto: data.nomeCompleto,
      parentescoId: data.parentescoId,
      endereco: {
        bairro: data.bairro,
        rua: data.rua,
        numeroCasa: data.numeroCasa
      },
      contacto: {
        telefone: data.telefone,
        email: data.email
      }
    }

    await fetch(`http://localhost:8000/api/alunos/${getCookies('idAluno')}/responsaveis`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        })
        .then((resp => resp.json()))
        .then((resp) =>{ 
            setShowModal(true);  
            if (resp.statusCode != 200) {
              setModalMessage(resp.message);  
            }else{
              setModalMessage(null);
            }
        })
        .catch((error) => console.log(`error: ${error}`))
        setUpdateTable(!updateTable)        
    }

   const handleSubmitUpdate = async (data: z.infer<typeof TFormUpdate>) => {
       
    const dados = 	{
      nomeCompleto: data.nomeCompleto,
      parentescoId: data.parentescoId,
      endereco: {
        bairro: data.bairro,
        rua: data.rua,
        numeroCasa: data.numeroCasa
      },
      contacto: {
        telefone: data.telefone,
        email: data.email
      }
    }

    await fetch(`http://localhost:8000/api/responsaveis/${data.responsavelId}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        })
        .then((resp => resp.json()))
        .then((resp) =>{ 
          setShowModal(true);  
          if (resp.statusCode != 200)
          {
            setModalMessage(resp.message);  
          }else{
            setModalMessage(null);
          }
        })
        .catch((error) => console.log(`error: ${error}`))
        setUpdateTable(!updateTable)
    }

    const handleSubmitDelete = async (data: z.infer<typeof TFormDelete>) => {
          
      await fetch(`http://localhost:8000/api/responsaveis/${data.responsavelId}`,{
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data)
          })
          .then((resp => resp.json()))
          .then((resp) =>{ 
            setShowModal(true);  
            if (resp.statusCode != 200) {
              setModalMessage(resp.message);  
            }else{
              setModalMessage(null);
            }
        })
          .catch((error) => console.log(`error: ${error}`))
          setUpdateTable(!updateTable)
      }

  const[parentesco, setParentesco] = React.useState([]);
  React.useEffect(()=>{
    const search = async () => {
        const resp = await fetch(`http://localhost:8000/api/parentescos/`);
        const respJson = await resp.json()
        setParentesco(respJson.data)
    }
    search()
  },[])
    
  const[buscar, setBuscar] = React.useState(0);
  const URLRESPONSAVEIS = `http://localhost:8000/api/alunos/${getCookies('idAluno')}/responsaveis`
  const[idResponsavel, setIdEncarregado] = React.useState(0);
  React.useEffect(()=>{
    const search = async () => {
      const resp = await fetch (URLRESPONSAVEIS);
      const respJson = await resp.json();
      respJson.data.sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto))
      setDados(respJson.data)
      setDataApi(respJson.data)
    
    }
    search()
  },[buscar, updateTable])

  const[nome, setNome] = React.useState();
  const[bairro, setBairro] = React.useState();
  const[rua, setRua] = React.useState();
  const[casa, setCasa] = React.useState();
  const[telefone,setTelefone] = React.useState();
  const[email,setEmail] = React.useState();
  const[eoq, setEoq] = React.useState();
  const [dados, setDados] = React.useState([])
  const [dataApi, setDataApi] = React.useState([])
  const URL = `http://localhost:8000/api/responsaveis/${idResponsavel}`
  React.useEffect(()=>{
      const search = async () => {
        if (idResponsavel > 0){
        const resp = await fetch (URL);
        const respJson = await resp.json();
        setEoq(respJson.parentesco)
        setNome(respJson.nomeCompleto)
        setBairro(respJson.endereco.bairro)
        setRua(respJson.endereco.rua)
        setCasa(respJson.endereco.numeroCasa)
        setTelefone(respJson.contacto.telefone)
        setEmail(respJson.contacto.email)
        formUpdate.setValue('nomeCompleto', respJson.nomeCompleto)
        formUpdate.setValue('telefone', respJson.contacto.telefone)
        if(respJson.contacto.email != null){
          formUpdate.setValue('email', respJson.contacto.email)}else{
            formUpdate.setValue('email', '')
          }
        formUpdate.setValue('bairro', respJson.endereco.bairro)
        formUpdate.setValue('rua', respJson.endereco.rua)
        formUpdate.setValue('numeroCasa', parseInt(respJson.endereco.numeroCasa))
        formUpdate.setValue('responsavelId', respJson.id)}
      }
      search()
  },[idResponsavel])
  
    const changeResource = (id)=>{
      setIdEncarregado(id)
    }

    const columns = ['Id', 'Nome', 'Acção'];
        
    const handleFilter = (event) => {
      const a = dataApi.filter((element) =>{ return (element.nomeCompleto.toLowerCase().includes(event.target.value.toLowerCase().trim())) });
      setDados(a)
       }
    
    return( <>
      {!getCookies('idAluno') ? <div className='w-screen min-h-screen bg-scroll bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300 flex items-center justify-center'>
      <div className='w-full text-center text-4xl text-red-600 md:text-2xl lg:text-2xl'>
          <div >
          <AlertTriangle className={`${animateBounce} inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12`}/>
              <p className='text-red-500'>ACESSO INVÁLIDO</p>
              <p className='text-red-500 italic font-semibold text-sm cursor-pointer'><Link to={'/StudentListPage'}>Lista dos Alunos</Link></p>
          </div>
      </div>
        </div>: (
       <section className="m-0 w-screen h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300  grid-flow-col grid-cols-3">
       <Header title={false}/>
       
       <div className='flex flex-col space-y-2 justify-center items-center w-full'> 
       <div className='animate-fade-left animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-in flex flex-col space-y-2 justify-center w-[90%] z-10'>
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
    <DialogContent className="sm:max-w-[645px] overflow-y-scroll h-[605px] bg-white">
      <DialogHeader>
      <DialogTitle className='text-sky-800 text-xl'>Cadastrar Regstro</DialogTitle>
        <DialogDescription>
          <p className='text-base text-gray-800'>
          preencha o formulário e em seguida click em <span className='font-bold text-sky-700'>cadastrar</span> quando terminar.
        </p>
        </DialogDescription>
      </DialogHeader>
     
      <Form {...form} >
     <form onSubmit={form.handleSubmit(handleSubmitCreate)} >
     <div className="w-full flex flex-col justify-between  ">
        <fieldset>
        <legend className='text-sky-800 text-xl'>Dados Pessoal</legend>
            <div className='w-full flex flex-col '>
            <div className="w-full flex flex-row justify-between space-x-2 ">
            <div className='w-full'>
            <Label htmlFor="nome"className='text-sky-700 text-md font-semibold'>Nome<span className='text-red-500'>*</span></Label>
          <FormField
          control={form.control}
          name="nomeCompleto"
          render={({field})=>(
            <FormItem>
            <FormControl>
          <Input id='nome'
            className={form.formState.errors.nomeCompleto?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
            'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}
            
            {...field} 
            
          />
          </FormControl>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}
           />
        </div>
        <div className='w-full'>
        <Label htmlFor="parentesco"className='text-sky-700 text-md font-semibold'>Parentesco<span className='text-red-500'>*</span></Label>
          <FormField
              control={form.control}
              name="parentescoId"
              render={({field})=>(
          <FormItem>
          <FormControl>
          <select id='parentesco' {...field}  className={
                      form.formState.errors.parentescoId?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-lg border-2 border-red-300 text-red-600 focus:text-red-700 focus:font-semibold focus:border-red-500 py-2 focus:outline-none rounded-md bg-white':
                      'w-full bg-white text-lg border-2 border-gray-300 text-gray-600 focus:text-sky-700 focus:font-semibold focus:border-sky-500 py-2 focus:outline-none rounded-md'} onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                      <option >Selecione o grau</option>
                      {
                            parentesco.map((field, index)=>{
                                return <option key={index} value={`${field.id}`}>{field.nome}</option>
                            })
                      }
                  </select>
                  </FormControl>
                  <FormMessage className='text-red-500 text-xs'/>
              </FormItem>)
              }
              />
                       
          </div></div>
        
       </div>
        </fieldset>
        <fieldset>
        <legend className='text-sky-800 text-xl'>
        Localização</legend>
            <div className="w-full flex flex-row justify-between space-x-2">
            <div className='w-full'>
            <Label htmlFor="bairro"className='text-sky-700 text-md font-semibold'>Bairro<span className='text-red-500'>*</span></Label>
            <FormField
          control={form.control}
          name="bairro"
          render={({field})=>(
            <FormControl>
                <FormItem>
          <Input id="bairro" type='text' {...field} className={form.formState.errors.bairro?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
          'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/></div>
            <div className='w-full'>
            <Label htmlFor="rua"className='text-sky-700 text-md font-semibold'>Rua<span className='text-red-500'>*</span></Label>
            <FormField
          control={form.control}
          name="rua"
          render={({field})=>(
            <FormControl>
        <FormItem>
          <Input id="rua" type='text' {...field} className={form.formState.errors.rua?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                            'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/>
        </div>
        <div className='w-full'>
        <Label htmlFor="name"className='text-sky-700 text-md font-semibold'>N. da Residência<span className='text-red-500'>*</span></Label>
            <FormField
          control={form.control}
          name="numeroCasa"
          render={({field})=>(
            <FormControl>
            <FormItem>
         
          <Input id="casa" type='number' {...field} className={form.formState.errors.numeroCasa?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
          'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}  min="1"  onChange={(e)=>{ field.onChange(parseInt(e.target.value))}}/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/>
        </div></div>
        </fieldset>
        <fieldset>
        <legend className='text-sky-800 text-xl'>
        Contacto</legend>
            <div className="w-full flex flex-row justify-between space-x-2">
        <div className='w-full'>
        <Label htmlFor="tel"className='text-sky-700 text-md font-semibold'>Telefone<span className='text-red-500'>*</span></Label>
                <FormField
          control={form.control}
          name="telefone"
          render={({field})=>(
            <FormItem>
            <FormControl>
            <Input {...registerWithMask('telefone',['999999999'], {required: true})} className={form.formState.errors.telefone?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
            'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}/>
          </FormControl>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className='w-full'>
        <Label htmlFor="email"className='text-sky-700 text-md font-semibold'>Email<span className='text-red-500'>*</span></Label>
      <FormField
          control={form.control}
          name="email"
          render={({field})=>(
            <FormItem>
            <FormControl>
          <Input
            id="email"
            className={form.formState.errors.email?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
            'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}
          {...field}/>
          </FormControl>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
         </div></div></fieldset>
        
      </div>
      
      <DialogFooter>
        <Button title='cadastrar' className='bg-blue-500 border-blue-500 text-white hover:bg-blue-500 font-semibold w-12' type='submit'><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
      </DialogFooter>
      </form>
      </Form>
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
                              <AlertTriangle className="animate-bounce animate-infinite animate-duration-[550ms] animate-delay-[400ms] animate-ease-out inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12"/>
                              <p>Nenum Registro Foi Encontrado</p>
                          </div>
                      </td>
                  </tr>
                  ) : dados.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
                          <td className={tdStyle}>{item.id}</td>
                          <td className={tdStyle}>{item.nomeCompleto}</td>
                          <td className={tdStyleButtons}    onClick={()=>{
                            changeResource(item.id)
                            
                          }}>
                             <Dialog >
                              <DialogTrigger asChild >
                            <div title='actualizar' className='relative flex justify-center items-center' >
                            <EditIcon className='w-5 h-4 absolute text-white'/> 
                              <Button className='h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm border-blue-600'></Button>
                              </div>
                              
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px] bg-white">
                              <DialogHeader>
                              <DialogTitle className='text-sky-800 text-xl'>Actualizar Registro</DialogTitle>
                                  <DialogDescription>
                                    <p className='text-base text-gray-800'>
                                    altere uma informação do registro click em <span className='font-bold text-sky-700'>actualizar</span> quando terminar.
                                  </p>
                                  </DialogDescription>
                              </DialogHeader>
                              <Form {...formUpdate} >
                            <form onSubmit={formUpdate.handleSubmit(handleSubmitUpdate)} >
                            <div className="w-full flex flex-col justify-between  ">
                                <fieldset>
                                <legend className='text-sky-800 text-xl'>
                                Dados Pessoal</legend>
                                    <div className='w-full flex flex-col '>
                                    <div className="w-full flex flex-row justify-between space-x-2 ">
                                    <div className='w-full'>
                                    <Label htmlFor="nome"className='text-sky-700 text-lg font-semibold'>Nome Completo<span className='text-red-500'>*</span>
                                  </Label>
                                  <FormField
                                  control={formUpdate.control}
                                  name="nomeCompleto"
                                  render={({field})=>(
                                    <FormItem>
                                    <FormControl>
                                  <Input id='nome'
                                    className={formUpdate.formState.errors.nomeCompleto?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                                    'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}
                                    
                                    {...field} 
                                    
                                  />
                                  </FormControl>
                                  <FormMessage className='text-red-500 text-xs'/>
                                  </FormItem>
                                )}
                                  />
                                </div>
                                <div className='w-full'>
                    <Label htmlFor="parentesco"className='text-sky-700 text-lg font-semibold'>Parentesco<span className='text-red-500'>*</span>
                      </Label>
                      <FormField
                          control={formUpdate.control}
                          name="parentescoId"
                          render={({field})=>(
                      <FormItem>
                      <FormControl>
                      <select id='parentesco' {...field}  className={
                      formUpdate.formState.errors.parentescoId?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-lg border-2 border-red-300 text-red-600 focus:text-red-700 focus:font-semibold focus:border-red-500 py-2 focus:outline-none rounded-md bg-white':
                      'w-full bg-white text-lg border-2 border-gray-300 text-gray-600 focus:text-sky-700 focus:font-semibold focus:border-sky-500 py-2 focus:outline-none rounded-md'} onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                                        <option >Selecione o grau</option>
                                        {
                                              parentesco.map((field)=>{
                                                  return <option value={`${field.id}`}>{field.nome}</option>
                                              })
                                        }
                                    </select>
                                          </FormControl>
                                          <FormMessage className='text-red-500 text-xs'/>
                                      </FormItem>)
                                      }
                                      />
                                              
                                  </div></div>
                                
                              </div>
                                </fieldset>
                                <fieldset>
                                <legend className='text-sky-800 text-xl'>
                                Localização</legend>
                                    <div className="w-full flex flex-row justify-between space-x-2">
                                    <div className='w-full'>
                                    <Label htmlFor="bairro"className='text-sky-700 text-lg font-semibold'>Bairro<span className='text-red-500'>*</span>
                                  </Label>
                                
                                    <FormField
                                  control={formUpdate.control}
                                  name="bairro"
                                  render={({field})=>(
                                    <FormControl>
                                        <FormItem>
                                  <Input id="bairro" type='text' {...field}  className={formUpdate.formState.errors.bairro?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                                    'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}/>
                                  <FormMessage className='text-red-500 text-xs'/>
                                  </FormItem>
                                  </FormControl>
                                )}/></div>
                                    <div className='w-full'>
                                    <Label htmlFor="rua"className='text-sky-700 text-lg font-semibold'>Rua<span className='text-red-500'>*</span>
                                  </Label>
                                    <FormField
                                  control={formUpdate.control}
                                  name="rua"
                                  render={({field})=>(
                                    <FormControl>
                                <FormItem>
                                  <Input id="rua" type='text' {...field}  className={formUpdate.formState.errors.rua?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                                  'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}/>
                                  <FormMessage className='text-red-500 text-xs'/>
                                  </FormItem>
                                  </FormControl>
                                )}/>
                                </div>
                                <div className='w-full'>
                                <Label htmlFor="name"className='text-sky-700 text-lg font-semibold'>Residên.<span className='text-red-500'>*</span>
                                  </Label>
                                
                                    <FormField
                                  control={formUpdate.control}
                                  name="numeroCasa"
                                  render={({field})=>(
                                    <FormControl>
                                    <FormItem>
                                
                                  <Input id="numeroCasa" type='number' {...field}  className={formUpdate.formState.errors.numeroCasa?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                                    'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}  onChange={(e)=>{ field.onChange(parseInt(e.target.value))}}/>
                                  <FormMessage className='text-red-500 text-xs'/>
                                  </FormItem>
                                  </FormControl>
                                )}/>
                                </div></div>
                                </fieldset>
                                <fieldset>
                                <legend className='text-sky-800 text-xl'>
                                Contacto</legend>
                                    <div className="w-full flex flex-row justify-between space-x-2">
                                <div className='w-full'>
                                <Label htmlFor="tel"className='text-sky-700 text-lg font-semibold'>Telefone<span className='text-red-500'>*</span>
                                  </Label>
                                <FormField
                                  control={formUpdate.control}
                                  name="telefone"
                                  render={({field})=>(
                                    <FormItem>
                                    <FormControl>
                                    <Input id='tel' {...upWithMask('telefone',['999999999'], {required: true})} className={formUpdate.formState.errors.telefone?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                                   'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}/>
                                  </FormControl>
                                  <FormMessage className='text-red-500 text-xs'/>
                                  </FormItem>
                                )}/>
                                </div>
                                <div className='w-full'>
                                <Label htmlFor="email"className='text-sky-700 text-lg font-semibold'>Email<span className='text-red-500'>*</span>
                                  </Label>
                              <FormField
                                  control={formUpdate.control}
                                  name="email"
                                  render={({field})=>(
                                    <FormItem>
                                    <FormControl>
                                  <Input
                                    id="email"
                                    className={formUpdate.formState.errors.email?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                                    'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}
                                  {...field}/>
                                  </FormControl>
                                  <FormMessage className='text-red-500 text-xs'/>
                                  </FormItem>
                                )}/>
                                </div></div></fieldset>
                                
                              </div>
                              
                              <DialogFooter>
                                <Button title='actualizar' className='bg-green-500 border-green-500 text-white hover:bg-green-500 font-semibold w-12' onClick={()=>{formUpdate.setValue('responsavelId', item.id)}} type='submit'><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
                              </DialogFooter>
                              </form></Form>
                            </DialogContent>
                           </Dialog>

                          <Dialog >
                              <DialogTrigger asChild onClick={()=>{
                                      formDelete.setValue('responsavelId', item.id)
                                    }}>
                            <div title='excluir' className='relative flex justify-center items-center' >
                            <Trash className='w-5 h-4 absolute text-white'/> 
                            <Button className='h-7 px-5 rounded-sm bg-red-600  border-red-600 hover:bg-red-600'></Button>
                              </div>
                              
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-white">
                              <DialogHeader>
                                <DialogTitle>Excluir Registro</DialogTitle>
                                <DialogDescription>
                                <p>Caso queira exluir o registro, basta confirmar em excluir.</p>
                                </DialogDescription>
                                <hr/>
                              </DialogHeader>
                              <Form {...formDelete} >
                            <form onSubmit={formDelete.handleSubmit(handleSubmitDelete)} >
                                    <FormField
                                  control={formDelete.control}
                                  name="responsavelId"
                                  render={({field})=>(
                                    <FormControl>
                                    <FormItem>
                                  <Input id="id" type='hidden' {...field} className="w-full" min={0} onChange={(e)=>{field.onChange(parseInt( e.target.value))}}/>
                                  <FormMessage className='text-red-500 text-xs'/>
                                  </FormItem>
                                  </FormControl>
                                )}/>
                        <DialogFooter>
                              <Button className='h-8 bg-red-500 border-red-500 text-white hover:bg-red-500 font-semibold' type='submit'>Excluir</Button>
                              </DialogFooter>
                              </form></Form>
                            </DialogContent>
                          </Dialog>  

                          <Dialog >
                            <DialogTrigger asChild>
                            <div title='ver dados' className='relative flex justify-center items-center'>
                            <InfoIcon className='w-5 h-4 absolute text-white font-extrabold'/>
                              <button className='h-7 px-5 bg-green-600 text-white font-semibold hover:bg-green-600 rounded-sm border-green-600' ></button>
                              </div>
                              
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-white">
                              <DialogHeader>
                                <DialogTitle>{item.nomeCompleto}, {eoq}</DialogTitle>
                                <DialogDescription >
                                As informações relevantes do encarregado, são listadas aqui!
                                </DialogDescription>
                              </DialogHeader>
                            
                              <div className="grid gap-4 py-4 bg-white">
                                <div className="flex flex-col w-full">
                                    
                                <fieldset>
                                    <legend className='font-robotoSlab text-sm'>Localização</legend>
                                    <div className="w-full flex flex-row justify-between px-2">
                                    <div className="w-full flex flex-row justify-between px-2">
                                    <div>
                                        <Label className='font-poppins'>número da casa</Label>
                                        <p className='font-thin text-sm'>{casa}</p>
                                    </div>
                                    <div>
                                        <Label className='font-poppins'>bairro</Label>
                                        <p className='font-thin text-sm'>{bairro}</p>
                                    </div>
                                    <div>
                                        <Label className='font-poppins'>rua</Label>
                                        <p className='font-thin text-sm'>{rua}</p>
                                    </div>
                                    </div>
                                    </div>
                                </fieldset>
                                    <fieldset>
                                        <legend className='font-robotoSlab text-sm'>Contacto</legend>
                                    <div className="w-full flex flex-row justify-between px-2">
                                    <div className="w-full flex flex-row justify-between px-2">
                                    <div>
                                        <Label className='font-poppins'>Telefone</Label>
                                        <p className='font-thin text-sm'>{telefone}</p>
                                    </div>
                                    {email && (
                                    <div>
                                        <Label className='font-poppins'>email</Label>
                                        <p className='font-thin text-sm'>{email}</p>
                                    </div>
                                    )}
                                    </div>
                                    </div>
                                    </fieldset>
                                    
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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
          <p className='text-blue-500 font-semibold' onClick={()=>{removeCookies('idAluno')}}><Link to={'/StudentListPage'}>Voltar</Link></p>
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
      </section>)}</>
 );
}