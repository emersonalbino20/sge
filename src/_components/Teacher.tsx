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
import { CombineIcon, EditIcon, PlusIcon, PrinterIcon } from 'lucide-react'
import { InfoIcon } from 'lucide-react'
import { UserPlus } from 'lucide-react'
import DataTable from 'react-data-table-component'
import { useForm, useFieldArray } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { dataNascimentoZod, emailZod, nomeCompletoZod, telefoneZod } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const TForm =  z.object({
  nomeCompleto: nomeCompletoZod,
  dataNascimento: dataNascimentoZod,
  telefone: telefoneZod,
  email: emailZod,
})

type TFormUpdate = {
  nome: string,
  dataNascimento: string,
  telefone: string,
  email: string,
  
}
const TFormUpdate =  z.object({
  nomeCompleto: nomeCompletoZod,
  dataNascimento: dataNascimentoZod,
  telefone: telefoneZod,
  email: emailZod,
  id: z.number()
})

/*Vinculo de professor e disciplina*/
const TFormConnect =  z.object({
  idProfessor: z.number(),
  idDisciplina: z.number()
})
type FormProps =  z.infer<typeof TForm>;
type FormPropsUpdate =  z.infer<typeof TFormUpdate>;
export default function Teacher (){
  
  const form  = useForm<z.infer<typeof TForm>>({
    mode: 'all', 
    resolver: zodResolver(TForm)
   })

   const formUpdate  = useForm<z.infer<typeof TFormUpdate>>({
    mode: 'all', 
    resolver: zodResolver(TFormUpdate)
   })

   const handleSubmitCreate = async (data: z.infer<typeof TForm>,e) => {
          
    await fetch(`http://localhost:8000/api/professores/`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then((resp => resp.json()))
        .then((resp) =>{ console.log(resp)})
        .catch((error) => console.log(`error: ${error}`))
        console.log(data)
        
    }

    const[buscar, setBuscar] = React.useState(2);
    const[nome, setNome] = React.useState();
    const[nasc, setNasc] = React.useState();
    const[telefone,setTelefone] = React.useState();
    const[email,setEmail] = React.useState();

    React.useEffect(()=>{
        const search = async () => {
            const resp = await fetch(`http://localhost:8000/api/professores/${buscar}`);
            const receve = await resp.json()
            console.log(receve.id)
            setNome(receve.nomeCompleto)
            setNasc(receve.dataNascimento)
            setTelefone(receve.contacto.telefone)
            setEmail(receve.contacto.email)
        }
        search()
    },[buscar])
    const changeResource=(id)=>{
        setBuscar(id)
    }


    const [updateTable, setUpdateTable] = React.useState(false)
   const handleSubmitUpdate = async (data: z.infer<typeof TFormUpdate>) => {
          
    await fetch(`http://localhost:8000/api/professores/${data.id}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then((resp => resp.json()))
        .then((resp) =>{ console.log(resp)})
        .catch((error) => console.log(`error: ${error}`))
        setUpdateTable(true)
        console.log(data)
        
    }

    /*Área q implementa o código pra pesquisar disciplinas*/
    const [dataDisciplina, setDataDisciplina] = React.useState([]);
    const [nomeDisciplina, setNomeDisciplina] = React.useState([]);
    const [idDisciplina, setIdDisciplina] = React.useState();
    const [dataApiDisciplina, setDataApiDisciplina] = React.useState([]);
    const URLDISCIPLINA = "http://localhost:8000/api/disciplinas"
   
   useEffect( () => {
        const respFetchDisciplinas = async () => {
              const resp = await fetch (URLDISCIPLINA);
              const respJson = await resp.json();
              const conv1 = JSON.stringify(respJson.data)
              const conv2 = JSON.parse(conv1)
              setDataApiDisciplina(conv2)
              
        } 
         respFetchDisciplinas()
   },[])

    const handleFilterDisciplina =  (event) => {
        const newData = dataApiDisciplina.filter( row => {
            return row.nome.toLowerCase().includes(event.target.value.toLowerCase().trim())
        })
        setDataDisciplina(newData[0]);
        setNomeDisciplina(newData[0].nome);
        setIdDisciplina(newData[0].id);            
    }

  const formConnect  = useForm<z.infer<typeof TFormConnect>>({
      mode: 'all', 
      resolver: zodResolver(TFormConnect)
     })
  
  const handleSubmitConnect = async (data: z.infer<typeof TFormConnect>,e) => {
    /*vincular professor à disciplina*/       
    const disciplinas = 
    {
      disciplinas: [data.idDisciplina]
    }
  
    await fetch(`http://localhost:8000/api/professores/${data.idProfessor}/disciplinas`,{
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(disciplinas)
          })
          .then((resp => resp.json()))
          .then((resp) =>{ console.log(resp)})
          .catch((error) => console.log(`error: ${error}`))
          console.log(disciplinas)
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
            name: 'Data de Nascimento',
            selector: row => row.dataNascimento,
            sortable:true
        },
        {
            name: 'Ação',
            cell: (row) => (<div className='flex flex-row space-x-2'>
            <Dialog >
      <DialogTrigger asChild onClick={()=>{
              formUpdate.setValue('nomeCompleto', nome)
              formUpdate.setValue('dataNascimento', nasc)
              formUpdate.setValue('telefone', telefone)
              formUpdate.setValue('email', email)
              formUpdate.setValue('id', row.id)
            }}>
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
          <Label htmlFor="name" className="text-right">
            Nome
          </Label>
          <FormField
          control={formUpdate.control}
          name="nomeCompleto"
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
          <Label htmlFor="date" className="text-right">
            Data de Nasc
          </Label>
         
            <FormField
          control={formUpdate.control}
          name="dataNascimento"
          render={({field})=>(
            <FormItem>
            <FormControl>
          <Input id="date" type='date' {...field} className="w-full"/>
          </FormControl>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        
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
         <Label htmlFor="tel" className="text-right">
            Telefone
          </Label>
      <FormField
          control={formUpdate.control}
          name="telefone"
          render={({field})=>(
            <FormItem>
            <FormControl>
          <Input
            id="tel"
            className="w-full"
          {...field}/>
          </FormControl>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
      </div>
      <DialogFooter><Button className='bg-green-500 border-green-500 text-white hover:bg-green-500 font-semibold' type='submit'>Actualizar</Button>
      </DialogFooter>
      </form></Form>
    </DialogContent>
  </Dialog>
 
           
            <div title='ver dados' className='relative flex justify-center items-center cursor-pointer'>
           
            <Popover >
      <PopoverTrigger asChild className='bg-white'>

      <div className='relative flex justify-center items-center cursor-pointer'>  <InfoIcon className='w-5 h-4 absolute text-white'/> 
        <Button className='h-7 px-5 bg-green-600 text-white font-semibold hover:bg-green-600 rounded-sm border-green-600'></Button>
        </div>
      </PopoverTrigger >
      <PopoverContent className="w-80 bg-white">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dados Pessoal</h4>
            <p className="text-sm text-muted-foreground">
              Inspecione os dados do professor
            </p>
          </div>
          <div className="grid gap-2">
            
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Nome</Label>
              <p>{nome}</p>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Data de Nasc.</Label>
              <p>{nasc}</p>
            </div>
            
          </div>
        </div>
      </PopoverContent>
    </Popover>
            </div>
            <Dialog >
          <DialogTrigger asChild >
          <div title='vincular' className='relative flex justify-center items-center'>
          <CombineIcon className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
            <Button className='h-7 px-5 bg-yellow-600 text-white font-semibold hover:bg-yellow-600 rounded-sm border-yellow-600'></Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                  <DialogTitle>Vincular Professor</DialogTitle>
                  <DialogDescription>
                  Essa secção tem como objectivo relacionar professores em alguma disciplina especifíca.
                  </DialogDescription>
                </DialogHeader>
                <Form {...formConnect} >
              <form onSubmit={formConnect.handleSubmit(handleSubmitConnect)
              
              } >
               
              <div className="flex flex-col w-full py-4 bg-white">              
              <div className="w-full">
                <Label htmlFor="username" className="text-right">
                  Procurar Disciplina
                </Label>
                <Input
                    id="name"
                    className="w-full italic"
                    placeholder='search by...'
                    onChange={handleFilterDisciplina}
                  />
              </div>
             <div>
              <p>{nomeDisciplina}</p>
             </div>
          </div>
      <DialogFooter>
        <Button type="submit" onClick={()=>{
                formConnect.setValue('idDisciplina', idDisciplina);
                formConnect.setValue('idProfessor', row.id);
              }}>Vincular</Button>
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
        
        const [dados, setDados] = React.useState([])
        const [dataApi, setDataApi] = React.useState([])
        const URL = "http://localhost:8000/api/professores?page_size=7"
       
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
                return row.nomeCompleto.toLowerCase().includes(event.target.value.toLowerCase().trim())
            })
            setDados(newData)
        }
    
        const handleRows = ({selectedRows}) => {
            setTimeout(()=>{
                changeResource(selectedRows[0].id)
            },1000)
            
            
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
    selectableRows
    selectableRowsSingle
    onSelectedRowsChange={handleRows}
    onSort={handleSort}
    subHeader
   subHeaderComponent={ 
       <div className='flex flex-row space-x-2'><input className=' rounded-sm border-2 border-gray-400 placeholder:text-gray-400 placeholder:font-bold outline-none py-1 indent-2' type='text' placeholder='Pesquisar aqui...' onChange={handleFilter}/>
       
       <div className='relative flex justify-center items-center'>
           <PrinterIcon className='w-5 h-4 absolute text-white font-extrabold'/>
           <button className='py-4 px-5 bg-green-700 border-green-700 rounded-sm ' onClick={() => window.print()}></button>
       </div>
       
       <Dialog >
    <DialogTrigger asChild>
    <div title='cadastrar' className='relative flex justify-center items-center'>
    <UserPlus className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
      <Button className='h-9 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm'></Button>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <DialogTitle>Cadastrar Registro</DialogTitle>
        <DialogDescription>
          <p>
          preencha o formulário e em seguida click em <span className='font-bold text-blue-500'>cadastrar</span> quando terminar.
        </p>
        </DialogDescription>
      </DialogHeader>
      <Form {...form} >
     <form onSubmit={form.handleSubmit(handleSubmitCreate)} >
      <div className="flex flex-col w-full py-4 bg-white">
        <div className="w-full">
          <Label htmlFor="name" className="text-right">
            Nome
          </Label>
          <FormField
          control={form.control}
          name="nomeCompleto"
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
          <Label htmlFor="date" className="text-right">
            Data de Nasc
          </Label>
         
            <FormField
          control={form.control}
          name="dataNascimento"
          render={({field})=>(
            <FormItem>
            <FormControl>
          <Input id="date" type='date' {...field} className="w-full"/>
          </FormControl>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        
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
         <Label htmlFor="tel" className="text-right">
            Telefone
          </Label>
      <FormField
          control={form.control}
          name="telefone"
          render={({field})=>(
            <FormItem>
            <FormControl>
          <Input
            id="tel"
            className="w-full"
          {...field}/>
          </FormControl>
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
       </div>
      
   }
>
</DataTable>
</div>
 ) ;
}