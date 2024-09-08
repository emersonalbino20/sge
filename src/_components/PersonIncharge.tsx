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
import { AlertCircleIcon, CheckCircleIcon, EditIcon, PrinterIcon } from 'lucide-react'
import { InfoIcon } from 'lucide-react'
import { UserPlus, Trash } from 'lucide-react'
import DataTable from 'react-data-table-component'
import { useForm, useFieldArray } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { dataNascimentoZod, emailZod, nomeCompletoZod, telefoneZod, ruaZod, bairroZod, numeroCasaZod, idZod } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MyDialog, MyDialogContent } from './my_dialog'


const TForm =  z.object({
  nomeCompleto: nomeCompletoZod,
  telefone: telefoneZod,
  email: emailZod,
  parentescoId: z.number(),
  bairro: bairroZod,
  rua: ruaZod,
  numeroCasa: numeroCasaZod,
  id: idZod
})


const TFormUpdate =  z.object({
  nomeCompleto: nomeCompletoZod,
  telefone: telefoneZod,
  email: emailZod,
  parentescoId: z.number(),
  bairro: bairroZod,
  rua: ruaZod,
  numeroCasa: numeroCasaZod,
  responsavelId: idZod,
  alunoId: idZod
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

   const formUpdate  = useForm<z.infer<typeof TFormUpdate>>({
    mode: 'all', 
    resolver: zodResolver(TFormUpdate)
   })
   
   const formDelete  = useForm<z.infer<typeof TFormDelete>>({
    mode: 'all', 
    resolver: zodResolver(TFormDelete)
   })

    const [updateTable, setUpdateTable] = React.useState(false)
    const [showModal, setShowModal] = React.useState(false);
    const [modalMessage, setModalMessage] = React.useState('');
    const [estado, setEstado] = React.useState(false);
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

    await fetch(`http://localhost:8000/api/alunos/${data.id}/responsaveis`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
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
          if (resp.message != null) {
            setModalMessage(resp.message);  
          }else{
            setModalMessage(resp.message);
          }
            console.log(resp)
        })
        .catch((error) => console.log(`error: ${error}`))
        setUpdateTable(!updateTable)
        //console.log("olá")
        
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
            if (resp.message != null) {
              setModalMessage(resp.message);  
            }else{
              setModalMessage(resp.message);
            }
        })
          .catch((error) => console.log(`error: ${error}`))
          setUpdateTable(!updateTable)
      }

/*Buscar dados do parentetesco*/
const[parentesco, setParentesco] = React.useState([]);
React.useEffect(()=>{
    const search = async () => {
        const resp = await fetch(`http://localhost:8000/api/parentescos/`);
        const respJson = await resp.json()
        const conv1 = JSON.stringify(respJson.data)
        const conv2 = JSON.parse(conv1)
        setParentesco(conv2)
    }
    search()
},[])
    const[nome, setNome] = React.useState();
    const[bairro, setBairro] = React.useState();
    const[rua, setRua] = React.useState();
    const[casa, setCasa] = React.useState();
    const[telefone,setTelefone] = React.useState();
    const[email,setEmail] = React.useState();
    const[eoq, setEoq] = React.useState();
    const [dados, setDados] = React.useState([])
    const [dataApi, setDataApi] = React.useState([])
    const[buscar, setBuscar] = React.useState(0);
    const URL = `http://localhost:8000/api/responsaveis/${buscar}`
    React.useEffect(()=>{
        const search = async () => {
          const resp = await fetch (URL);
          const respJson = await resp.json();
          
          console.log(respJson)
          setEoq(respJson.parentesco)
          setNome(respJson.nomeCompleto)
          setBairro(respJson.endereco.bairro)
          setRua(respJson.endereco.rua)
          setCasa(respJson.endereco.numeroCasa)
          setTelefone(respJson.contacto.telefone)
          setEmail(respJson.contacto.email)
          const obj = [{
            id: respJson.id,
            nomeCompleto: respJson.nomeCompleto,
            parentesco: respJson.parentesco
          }]
          setDados(obj)
          setDataApi(obj)
          setEstado(true)
        }
        search()
    },[buscar])

    const changeResource = (id)=>{
      setBuscar(id)
    }

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
            cell: (row) => (<div className='flex flex-row space-x-2'onClick={()=>{
              changeResource(row.id)
              if(estado){
                formUpdate.setValue('nomeCompleto', nome)
                formUpdate.setValue('telefone', telefone)
                formUpdate.setValue('email', email)
                formUpdate.setValue('bairro', bairro)
                formUpdate.setValue('rua', rua)
                formUpdate.setValue('numeroCasa', parseInt(casa))
                formUpdate.setValue('responsavelId', row.id)
                setEstado(false)
              }
              }}>
            <Dialog >
      <DialogTrigger asChild >
    <div title='actualizar' className='relative flex justify-center items-center' >
    <EditIcon className='w-5 h-4 absolute text-white'/> 
      <Button className='h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm border-blue-600'></Button>
      </div>
      
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <DialogTitle>Actualizar Registro</DialogTitle>
        <DialogDescription>
        <p>altere uma informação do registro click em <span className='font-bold text-green-500'>actualizar</span> quando terminar.</p>
        </DialogDescription>
      </DialogHeader>
      <Form {...formUpdate} >
     <form onSubmit={formUpdate.handleSubmit(handleSubmitUpdate)} >
     <div className="w-full flex flex-col justify-between  ">
        <fieldset>
            <legend className='font-robotoSlab text-sm'>Dados Pessoal</legend>
            <div className='w-full flex flex-col '>
            <div className="w-full flex flex-row justify-between space-x-2 ">
            <div className='w-full'>
          <Label htmlFor="name" className="text-right">
            Name 
          </Label>
          <FormField
          control={formUpdate.control}
          name="nomeCompleto"
          render={({field})=>(
            <FormItem>
            <FormControl>
          <Input 
            className="w-full py-5"
            
            {...field} 
            
          />
          </FormControl>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}
           />
        </div>
        <div className='w-full'>
          <Label htmlFor="genero" className="text-right">
            Parentesco
          </Label>
          <FormField
              control={formUpdate.control}
              name="parentescoId"
              render={({field})=>(
          <FormItem>
          <FormControl>
          <select {...field} className='w-full py-3 rounded-sm ring-1 ring-gray-300 bg-white text-gray-500 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                      <option value="">Selecione o grau</option>
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
        <legend className='font-robotoSlab text-sm'>
            Localização</legend>
            <div className="w-full flex flex-row justify-between space-x-2">
            <div className='w-full'>
          <Label htmlFor="bairro" className="text-right">
            Bairro
          </Label>
         
            <FormField
          control={formUpdate.control}
          name="bairro"
          render={({field})=>(
            <FormControl>
                <FormItem>
          <Input id="bairro" type='text' {...field} className="w-full"/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/></div>
            <div className='w-full'>
          <Label htmlFor="rua" className="text-right">
            Rua
          </Label>
         
            <FormField
          control={formUpdate.control}
          name="rua"
          render={({field})=>(
            <FormControl>
        <FormItem>
          <Input id="rua" type='text' {...field} className="w-full"/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/>
        </div>
        <div className='w-full'>
          <Label htmlFor="casa" className="text-right">
            Número da Casa
          </Label>
         
            <FormField
          control={formUpdate.control}
          name="numeroCasa"
          render={({field})=>(
            <FormControl>
            <FormItem>
         
          <Input id="casa" type='number' {...field} className="w-full"  min="1"  onChange={(e)=>{ field.onChange(parseInt(e.target.value))}}/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/>
        </div></div>
        </fieldset>
        <fieldset>
        <legend className='font-robotoSlab text-sm'>
            Contacto</legend>
            <div className="w-full flex flex-row justify-between space-x-2">
        <div className='w-full'>
        <Label htmlFor="tel" className="text-right">
            Telefone
          </Label>
      <FormField
          control={formUpdate.control}
          name="telefone"
          render={({field})=>(
            <FormControl>
                <FormItem>
          <Input
            id="tel"
            className="w-full"
          {...field}/>
           <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/></div>
        <div className='w-full'>
        <Label htmlFor="email" className="text-right">
            @Email
          </Label>
      <FormField
          control={formUpdate.control}
          name="email"
          render={({field})=>(
            <FormItem>
            <FormControl>
          <Input
            id="email"
            className="w-full"
          {...field}/>
          </FormControl>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
         </div></div></fieldset>
         
      </div>
      
      <DialogFooter>
        <Button className='bg-green-500 border-green-500 text-white hover:bg-green-500 font-semibold ' type='submit'>Actualizar</Button>
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
        <DialogTitle>{row.nomeCompleto}, {eoq}</DialogTitle>
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
            <div>
                <Label className='font-poppins'>email</Label>
                <p className='font-thin text-sm'>{email}</p>
            </div>
            </div>
            </div>
            </fieldset>
            
        </div>
      </div>
      <DialogFooter>
        <p className='font-lato italic text-blue-600 text-xs cursor-pointer'>Todos os dados do encarregado<InfoIcon className='w-2 h-2'/>.</p>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <Dialog >
      <DialogTrigger asChild onClick={()=>{
              formDelete.setValue('responsavelId', row.id)
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
        
        const handleFilter =  (event) => {
          setBuscar(parseInt(event.target.value.trim()))
        }
    
      
       const handleSort = (column, sortDirection) => {
        console.log({column, sortDirection})
       }
    
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
        <DialogTitle>Cadastrar Registro</DialogTitle>
        <DialogDescription>
        <p>preencha o formulário e em seguida click em <span className='font-bold text-blue-500'>cadastrar</span> quando terminar.
        </p>
        </DialogDescription>
      </DialogHeader>
     
      <Form {...form} >
     <form onSubmit={form.handleSubmit(handleSubmitCreate)} >
     <div className="w-full flex flex-col justify-between  ">
        <fieldset>
            <legend className='font-robotoSlab text-sm'>Dados Pessoal</legend>
            <div className='w-full flex flex-col '>
            <div className="w-full flex flex-row justify-between space-x-2 ">
            <div className='w-full'>
          <Label htmlFor="name" className="text-right">
            Name 
          </Label>
          <FormField
          control={form.control}
          name="nomeCompleto"
          render={({field})=>(
            <FormItem>
            <FormControl>
          <Input 
            className="w-full py-5"
            
            {...field} 
            
          />
          </FormControl>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}
           />
        </div>
        <div className='w-full'>
          <Label htmlFor="genero" className="text-right">
            Parentesco
          </Label>
          <FormField
              control={form.control}
              name="parentescoId"
              render={({field})=>(
          <FormItem>
          <FormControl>
          <select {...field} className='w-full py-3 rounded-sm ring-1 ring-gray-300 bg-white text-gray-500 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                      <option value="">Selecione o grau</option>
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
        <legend className='font-robotoSlab text-sm'>
            Localização</legend>
            <div className="w-full flex flex-row justify-between space-x-2">
            <div className='w-full'>
          <Label htmlFor="bairro" className="text-right">
            Bairro
          </Label>
         
            <FormField
          control={form.control}
          name="bairro"
          render={({field})=>(
            <FormControl>
                <FormItem>
          <Input id="bairro" type='text' {...field} className="w-full"/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/></div>
            <div className='w-full'>
          <Label htmlFor="rua" className="text-right">
            Rua
          </Label>
         
            <FormField
          control={form.control}
          name="rua"
          render={({field})=>(
            <FormControl>
        <FormItem>
          <Input id="rua" type='text' {...field} className="w-full"/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/>
        </div>
        <div className='w-full'>
          <Label htmlFor="casa" className="text-right">
            Número da Casa
          </Label>
         
            <FormField
          control={form.control}
          name="numeroCasa"
          render={({field})=>(
            <FormControl>
            <FormItem>
         
          <Input id="casa" type='number' {...field} className="w-full"  min="1"  onChange={(e)=>{ field.onChange(parseInt(e.target.value))}}/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/>
        </div></div>
        </fieldset>
        <fieldset>
        <legend className='font-robotoSlab text-sm'>
            Contacto</legend>
            <div className="w-full flex flex-row justify-between space-x-2">
        <div className='w-full'>
        <Label htmlFor="tel" className="text-right">
            Telefone
          </Label>
      <FormField
          control={form.control}
          name="telefone"
          render={({field})=>(
            <FormControl>
                <FormItem>
          <Input
            id="tel"
            className="w-full"
          {...field}/>
           <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/></div>
        <div className='w-full'>
        <Label htmlFor="email" className="text-right">
            @Email
          </Label>
      <FormField
          control={form.control}
          name="email"
          render={({field})=>(
            <FormItem>
            <FormControl>
          <Input
            id="email"
            className="w-full"
          {...field}/>
          </FormControl>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
         </div></div></fieldset>
         <div className='w-full mb-3'>
          <Label htmlFor="id" className="text-right">
            ID do Aluno
          </Label>
         
            <FormField
          control={form.control}
          name="id"
          render={({field})=>(
            <FormControl>
            <FormItem>
          <Input id="id" type='number' {...field} className="w-full" min={0} onChange={(e)=>{field.onChange(parseInt( e.target.value))}}/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/>
        </div>
      </div>
      
      <DialogFooter>
        <Button className='bg-blue-500 border-blue-500 text-white hover:bg-blue-500 font-semibold' type='submit'>Cadastrar</Button>
      </DialogFooter>
      </form>
      </Form>
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
        <Button className='bg-green-400 hover:bg-green-400 font-poppins text-md border-green-400 font-medium h-9 w-20' onClick={() => setShowModal(false)}>Fechar</Button>
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
 ) ;
}