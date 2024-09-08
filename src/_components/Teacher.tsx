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
import { AlertCircleIcon, CheckCircleIcon, Check, CombineIcon, EditIcon, PlusIcon, PrinterIcon } from 'lucide-react'
import { InfoIcon } from 'lucide-react'
import { UserPlus } from 'lucide-react'
import DataTable from 'react-data-table-component'
import { useForm, useFieldArray } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { dataNascimentoZod, emailZod, nomeCompletoZod, telefoneZod, disciplinas } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Select from 'react-select';
import { MyDialog, MyDialogContent } from './my_dialog'
import InputMask from 'react-input-mask'

const TForm =  z.object({
  nomeCompleto: nomeCompletoZod,
  dataNascimento: dataNascimentoZod,
  telefone: telefoneZod,
  email: emailZod,
  disciplinas: disciplinas
})

const TFormUpdate =  z.object({
  nomeCompleto: nomeCompletoZod,
  dataNascimento: dataNascimentoZod,
  telefone: telefoneZod,
  email: emailZod,
  disciplinas: disciplinas,
  id: z.number()
})

/*Vinculo de professor e disciplina*/
const TFormConnect =  z.object({
  idProfessor: z.number(),
  disciplinas: disciplinas
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

   const formConnect  = useForm<z.infer<typeof TFormConnect>>({
    mode: 'all', 
    resolver: zodResolver(TFormConnect)
   })

   const [updateTable, setUpdateTable] = React.useState(false)
   const[estado, setEstado] = React.useState(false);
   const [showModal, setShowModal] = React.useState(false);
   const [modalMessage, setModalMessage] = React.useState('');  
   const handleSubmitCreate = async (data: z.infer<typeof TForm>,e) => {

    const dados = {
      nomeCompleto: data.nomeCompleto,
      dataNascimento: data.dataNascimento,
      contacto: {
        telefone: data.telefone,
        email: data.email,
      },
      disciplinas: data.disciplinas
    }
          
    await fetch(`http://localhost:8000/api/professores/`,{
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
          console.log(resp)
        })
        .catch((error) => console.log(`error: ${error}`))
        setUpdateTable(!updateTable) 
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
            setNome(receve.nomeCompleto)
            setNasc(receve.dataNascimento)
            setTelefone(receve.contacto.telefone)
            setEmail(receve.contacto.email)
            setEstado(true);
        }
        search()
    },[buscar])

    const changeResource= (id)=>{
        setBuscar(id)
    }


  
   const handleSubmitUpdate = async (data: z.infer<typeof TFormUpdate>) => {
          
    const dados = {
      nomeCompleto: data.nomeCompleto,
      dataNascimento: data.dataNascimento,
      contacto: {
        telefone: data.telefone,
        email: data.email,
      }
    }
    await fetch(`http://localhost:8000/api/professores/${data.id}`,{
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
        console.log(data)
        
    }

    /*Área q implementa o código pra pesquisar disciplinas*/
    const [disciplina, setDisciplina] = React.useState([]);
    const URLDISCIPLINA = "http://localhost:8000/api/disciplinas"
   
    useEffect( () => {
      const respFetch = async () => {
            const resp = await fetch (URLDISCIPLINA);
            const respJson = await resp.json();
            const conv1 = JSON.stringify(respJson.data)
            const conv2 = JSON.parse(conv1)
            setDisciplina(conv2)
      } 
      respFetch()
   },[])

    
  
  
  const handleSubmitConnect = async (data: z.infer<typeof TFormConnect>,e) => {
    /*vincular professor à disciplina*/       
    const disciplinas = 
    {
      disciplinas: data.disciplinas
    }
    //console.log(data.disciplinas)
  
    await fetch(`http://localhost:8000/api/professores/${data.idProfessor}/disciplinas`,{
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(disciplinas)
          })
          .then((resp => resp.json()))
          .then((resp) =>{ 
            setShowModal(true);  
            if (resp.message != null) {
              setModalMessage(resp.errors.disciplinas[0]);  
            }else{
              setModalMessage(resp.message);
            }
          })
          .catch((error) => console.log(`error: ${error}`))
      }

      //Vincular um professor a multiplas disciplinas
      const[selectedValues, setSelectedValues] = React.useState([]);
      const disciplinaOptions = disciplina.map((c)=>{return {value: c.id, label: c.nome}});
      const handleChange = (selectedOptions) => {
        // Extrair valores e labels
        const values = selectedOptions.map(option => option.value);
        setSelectedValues(values);
      };
      
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
            cell: (row) => (<div className='flex flex-row space-x-2'  onClick={()=>{
              changeResource(row.id)
              if(estado){
              formUpdate.setValue('nomeCompleto', nome)
              formUpdate.setValue('dataNascimento', nasc)
              formUpdate.setValue('telefone', telefone)
              formUpdate.setValue('email', email)
              formUpdate.setValue('id', row.id)
            }
            setEstado(false)
            }}>
         <Dialog >
      <DialogTrigger asChild >
    <div title='actualizar' className='relative flex justify-center items-center' >
    <EditIcon className='w-5 h-4 absolute text-white'/> 
      <Button className='h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm border-blue-600' ></Button>
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
          <Input id="date" type='date' {...field} className="w-full" max="2002-12-31" min="1960-01-01"/>
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
            id="email" type='text'
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
            <InputMask
                mask="999999999"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
            >
                {(inputProps) => (
                    <Input
                        {...inputProps}
                        className={'placeholder-gray-200 placeholder-opacity-55'
                        }
                        type="text"
                    />
                )}
            </InputMask>
          </FormControl>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
      </div>
      <DialogFooter><Button className='bg-green-500 border-green-500 text-white hover:bg-green-500' type='submit'>Actualizar</Button>
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
          <div className="flex flex-col space-y-2">
            <div className="w-full flex space-x-2">
              <Label htmlFor="height">Telf:</Label>
              <p className='text-sm lowercase'>{telefone}</p>
            </div>
            <div className="w-full flex space-x-2">
              <Label htmlFor="height">Email:</Label>
              <p className='text-sm lowercase'>{email}</p>
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
                  name="disciplinas"
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
        <Button type="submit" onClick={()=>{
                formConnect.setValue('disciplinas', selectedValues)
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
        const URL = "http://localhost:8000/api/professores"
       
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
    defaultSortFieldId={1}
    fixedHeader
    fixedHeaderScrollHeight='400px'
    pagination
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
          <Input id="date" type='date' {...field} className="w-full" max="2002-12-31" min="1960-01-01"/>
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
            <InputMask
                mask="999999999"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
            >
                {(inputProps) => (
                    <Input
                        {...inputProps}
                        className={'placeholder-gray-200 placeholder-opacity-55'
                        }
                        type="text"
                    />
                )}
            </InputMask></FormControl>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className='flex flex-col w-full'>
        <FormField
              control={form.control}
              name="disciplinas"
              render={({field})=>(
              <FormItem>
                <Label htmlFor="disciplina" className="text-right">
                Leciona
              </Label>
                  <FormControl>
                  <Select
                  name="disciplinas"
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
      </div>
      <DialogFooter>
      <Button className='bg-blue-500 border-blue-500 text-white hover:bg-blue-500 font-semibold ' onClick={()=>{form.setValue('disciplinas', selectedValues)}}type='submit'>Cadastrar</Button>
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
 ) ;
}