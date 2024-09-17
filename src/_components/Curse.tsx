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
import { AlertCircleIcon, CheckCircleIcon, EditIcon, PrinterIcon, SaveIcon, Trash} from 'lucide-react'
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


const TFormCreate =  z.object({
  nome: nomeCursoZod,
  descricao: descricaoZod,
  duracao: duracaoZod,
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
const [showModal, setShowModal] = React.useState(false);
const [modalMessage, setModalMessage] = React.useState('');
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
    setShowModal(true);  
    if (resp.message != null) {
      setModalMessage(resp.message);  
    }else{
      setModalMessage(resp.message);
    }
  })
  .catch((error) => console.log(`error: ${error}`))
  setUpdateTable(!updateTable)
  //console.log(data)
}

const[buscar, setBuscar] = React.useState();
const[nome, setNome] = React.useState();
const[descricao, setDescricao] = React.useState();
const[duracao,setDuracao] = React.useState();
const[id,setId] = React.useState();
const[estado, setEstado] = React.useState(false);
React.useEffect(()=>{
    const search = async () => {
        const resp = await fetch(`http://localhost:8000/api/cursos/${buscar}`);
        const receve = await resp.json()
        setNome(receve.nome)
        setDescricao(receve.descricao)
        setDuracao(receve.duracao)
        setId(receve.id)
        //console.log(receve)
        setEstado(true);
    }
    search()
},[buscar])

const changeResource = (id)=>{
    setBuscar(id)
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
    /*vincular curso à classe*/       
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
            setShowModal(true);  
            if (resp.message != null) {
              let index = parseInt(Object.keys(resp.errors.disciplinas)[0]);
              setModalMessage(resp.errors.disciplinas[index]+"\n Disciplina: "+data.nomeDisciplinas[index]);  
            }else{
              setModalMessage(resp.message);
            }
          })
          .catch((error) => console.log(`error: ${error}`))
      }

      const handleSubmitUnConnect = async (data: z.infer<typeof TFormUnConnect>,e) => {
        /*desvincular curso à classe*/       
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
                setShowModal(true);  
                if (resp.message != null) {
                  let index = parseInt(Object.keys(resp.errors.disciplinas)[0]);
                  setModalMessage(resp.errors.disciplinas[index]+"\n Disciplina: "+data.nomeDisciplinas[index]);  
                }else{
                  setModalMessage(resp.message);
                }
              })
              .catch((error) => console.log(`error: ${error}`))
          }

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
              formUpdate.setValue('descricao', descricao)
              formUpdate.setValue('duracao', duracao)
              formUpdate.setValue('id', row.id)
            }
            setEstado(false)
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
                  <DialogTitle>Actualizar Curso</DialogTitle>
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
                name="nome"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="name"
                    className="w-full" {...field}
                  />
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>
                
              </div>
              <div className="w-full">
                <Label htmlFor="username" className="text-right">
                  Descrição
                </Label>
                <FormField
                control={formUpdate.control}
                name="descricao"
                render={({field})=>(
                  <FormItem>
                  <Textarea className='w-full border-gray-300 placeholder:text-gray-500' placeholder="Dê uma descrição ao curso." {...field}/>
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>
                
              
              </div>
              <div className="w-full">
              <Label htmlFor="username" className="text-right">
                Anos de Duração
                </Label>
                  
                <FormField
                control={formUpdate.control}
                name="duracao"
                render={({field})=>(
                  <FormItem>
                  <Input type="number" className='w--full border-gray-300 placeholder:text-gray-700' {...field} onChange={(e)=>{field.onChange(parseInt(e.target.value))}}/>
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
                    <DialogTitle>Vincular Curso de {row.nome}</DialogTitle>
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
                  formConnect.setValue('idCursos', row.id);
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
                    <DialogTitle>Desvincular Curso de {row.nome}</DialogTitle>
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
                  formUnConnect.setValue('idCursos', row.id);
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
           <h4 className="font-medium leading-none">Dados do Curso</h4>
           <p className="text-sm text-muted-foreground">
             Inspecione os dados do curso
           </p>
         </div>
         <div className="grid gap-2">
           
           <div className="grid grid-cols-3 items-center gap-4">
             <Label htmlFor="height">Descrição</Label>
             <p className='text-xs'>{descricao}</p>
           </div>
           <div className="grid grid-cols-3 items-center gap-4">
             <Label htmlFor="height">Duração</Label>
             <p className='text-xs'>{duracao} Anos</p>
           </div>
         </div>
       </div>
     </PopoverContent>
   </Popover>
           </div>
           
    </div>
            ),
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
        const URL = "http://localhost:8000/api/cursos"
       
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
       <Dialog>
    <DialogTrigger asChild>
    <div title='cadastrar' className='relative flex justify-center items-center'>
    <Cursos className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
      <Button className='h-9 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm'></Button>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <DialogTitle>Cadastrar Curso</DialogTitle>
        <DialogDescription>
        <p>
          preencha o formulário e em seguida click em <span className='font-bold text-blue-500'>cadastrar</span> quando terminar.
        </p>
        </DialogDescription>
      </DialogHeader>
      <Form {...formCreate} >
     <form onSubmit={formCreate.handleSubmit(handleSubmitCreate)} >
     <div className="flex flex-col w-full py-4 bg-white">
        <div className="w-full">
          <Label htmlFor="name" className="text-right">
            Nome
          </Label>
          <FormField
          control={formCreate.control}
          name="nome"
          render={({field})=>(
            <FormItem>
            <Input
              id="name"
              className="w-full" {...field}
            />
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
          
        </div>
        <div className="w-full">
          <Label htmlFor="username" className="text-right">
            Descrição
          </Label>
          <FormField
          control={formCreate.control}
          name="descricao"
          render={({field})=>(
            <FormItem>
             <Textarea className='w-full border-gray-300 placeholder:text-gray-500' placeholder="Dê uma descrição ao curso." {...field}/>
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
          
        
        </div>
        <div className="w-full">
        <Label htmlFor="username" className="text-right">
           Anos de Duração
          </Label>
             
          <FormField
          control={formCreate.control}
          name="duracao"
          render={({field})=>(
            <FormItem>
             <Input type="number" className='w--full border-gray-300 placeholder:text-gray-700' {...field} onChange={(e)=>{field.onChange(parseInt(e.target.value))}}/>
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
      }>
</DataTable>
</div>
)
}