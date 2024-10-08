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
import { InfoIcon } from 'lucide-react'
import { GraduationCap as Cursos } from 'lucide-react';
import DataTable from 'react-data-table-component'
import {anoLectivo, classe, anoLectivoId, cursoId, custoMatricula } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm} from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MyDialog, MyDialogContent } from './my_dialog'
import { table } from 'console'



const TFormCreate =  z.object(
{
  nome: classe,
  cursoId: cursoId,
  valorMatricula: custoMatricula
})

const TFormUpdate =  z.object({
  nome: classe,
  //anoLectivoId: anoLectivoId, O id do anoLectivo é actualizado de forma automático por mei dum algoritmo
  cursoId: cursoId,
  valorMatricula: custoMatricula,
  id: z.number()
})

export default function Grade(){

const formCreate  = useForm<z.infer<typeof TFormCreate>>({
  mode: 'all', 
  resolver: zodResolver(TFormCreate)
})

const formUpdate  = useForm<z.infer<typeof TFormUpdate>>({
  mode: 'all', 
  resolver: zodResolver(TFormUpdate)
  })

   const [updateTable, setUpdateTable] = React.useState(false)
   const[estado, setEstado] = React.useState(false);
   const [showModal, setShowModal] = React.useState(false);
   const [modalMessage, setModalMessage] = React.useState(''); 
const handleSubmitCreate = async (data: z.infer<typeof TFormCreate>,e) => {
      
await fetch(`http://localhost:8000/api/classes/`,{
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
          console.log(resp)
  })
  .catch((error) => console.log(`error: ${error}`))
  setUpdateTable(!updateTable)
}



const handleSubmitUpdate = async (data: z.infer<typeof TFormUpdate>,e) => {

  const dados = {
    nome: data.nome,
    cursoId: data.cursoId,
    valorMatricula: data.valorMatricula 
  }
  await fetch(`http://localhost:8000/api/classes/${data.id}`,{
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
}
/*Buscar dados do Ano Academico, Curso*/
const[idAno,setIdAno] = React.useState();
const[bNomeCurso, setBNomeCurso] = React.useState([]);
const URLCURSO = `http://localhost:8000/api/cursos/`

React.useEffect(()=>{
    const search = async () => {
        const resp = await fetch(`http://localhost:8000/api/ano-lectivos/`);//Pelo facto de nao colocar a bara no final todos estados sao retornados como false "STRANGE"
        const receve = await resp.json()
        const convlectivo1 = JSON.stringify(receve.data)
        const convlectivo2 = JSON.parse(convlectivo1)
        
        
        var meuarray = convlectivo2.filter((c)=>{
          return c.activo === true
        })
        
        setIdAno(meuarray[parseInt(String(Object.keys(meuarray)))].id)
        console.log(idAno)
        const respC = await fetch(URLCURSO);
        const receveC = await respC.json()
        const convC = JSON.stringify(receveC.data)
        const convC2 = JSON.parse(convC)
        setBNomeCurso(convC2)
        setEstado(true)
        
    }
    search()
},[])

const[buscar, setBuscar] = React.useState();
const [dados, setDados] = React.useState([])
const [dataApi, setDataApi] = React.useState([])
const URLCLASSE = `http://localhost:8000/api/ano-lectivos/${idAno}/classes`
React.useEffect(()=>{
  const search = async () => {
      const resp = await fetch(URLCLASSE);
      const receve = await resp.json()
      const conv1 = JSON.stringify(receve.data)
      const conv2 = JSON.parse(conv1)
      let nArray = Object.values(conv2.cursos)
      setDataApi(nArray);
  }
  search()
},[idAno])

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
          name: 'Classes',
          selector: row => row.nome,
          sortable:true
        },
        {
            name: 'Ação',
            cell: (row) => (<div className='flex flex-row space-x-2'  onClick={()=>{
              changeResource(row.id)
              if(estado){
              formUpdate.setValue('id', row.id)
            }
            setEstado(false)
            }}><EditIcon className='w-5 h-4 absolute text-white'/> 
            <Dialog >
          <DialogTrigger asChild>
          <div title='actualizar' className='relative flex justify-center items-center'>
          <EditIcon className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
            <Button  className='h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm'></Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                  <DialogTitle>Actualizar Classe</DialogTitle>
                  <DialogDescription>
                  <p>altere uma informação do registro click em <span className='font-bold text-green-500'>actualizar</span> quando terminar.</p>
                  </DialogDescription>
                </DialogHeader>
                <Form {...formUpdate} >
              <form onSubmit={formUpdate.handleSubmit(handleSubmitUpdate)} >
            
              <div className="flex flex-col w-full py-4 bg-white">
                <div className="w-full">
                <Label htmlFor="nome" className="text-right">
                  Nome
                </Label>
                <FormField
                control={formUpdate.control}
                name="nome"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="nome"
                    type='text' {...field} className="w-full"
                    />
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>
              </div>
              <div className="w-full">
        <Label htmlFor="valorMatricula" className="text-right">
            Custo
          </Label>
          <FormField
          control={formUpdate.control}
          name="valorMatricula"
          render={({field})=>(
            <FormItem>
            <Input id="valorMAtricula" type='number' {...field} className="w-full"
            min="0"
            onChange={(e)=>{field.onChange(parseInt( e.target.value))}}/>
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
              <div className="w-full">
        <FormField
          control={formUpdate.control}
          name={'cursoId'}
          render={({field})=>(
          <FormItem>
            <Label htmlFor="curso" className="text-right">
            Curso
          </Label>
              <FormControl>
              <select id='curso' {...field} className='w-full py-3 rounded-md ring-1 bg-white text-gray-500 ring-gray-300 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                        <option>Selecione o curso</option>
                        {
                                    bNomeCurso.map((field)=>{
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
      <Button title='actualizar' className='bg-green-500 border-green-500 text-white hover:bg-green-500 font-semibold w-12' type='submit'><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
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
        
        /*Estilizacao da linhas da tabela */
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
          
            const curso = Object.values(dataApi).find(curso => curso.nome === event.target.value);
            if(curso)
            {
              let i = curso.classes.map( classe =>
                {
                  return classe;
                })
                setDados(i)
            }
        }

       const handleSort = (column, sortDirection) => {
        console.log({column, sortDirection})
       }
    

    return (
    
         <div className='w-full h-72'>
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
       <div className='flex flex-row space-x-2'>
       
       <select className='w-full py-3 rounded-md ring-1 bg-white text-gray-500 ring-gray-300 pl-3'  onChange={handleFilter} >
          <option>Selecione o curso</option>
          {
              dataApi.map((field)=>{
                  return <option>{field.nome}</option>
              })
          }
    </select>
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
        <DialogTitle>Cadastrar Classe</DialogTitle>
        <DialogDescription>
        <p>preencha o formulário e em seguida click em <span className='font-bold text-blue-500'>cadastrar</span> quando terminar.
        </p>
        </DialogDescription>
      </DialogHeader>
      <Form {...formCreate} >
     <form onSubmit={formCreate.handleSubmit(handleSubmitCreate)} >
     <div className="flex flex-col w-full py-4 bg-white">
        <div className="w-full">
          <Label htmlFor="nome" className="text-right">
            Nome
          </Label>
          <FormField
          control={formCreate.control}
          name="nome"
          render={({field})=>(
            <FormItem>
            <Input
              id="nome"
              type='text' {...field} className="w-full"
              />
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className="w-full">
        <Label htmlFor="valorMatricula" className="text-right">
            Custo
          </Label>
          <FormField
          control={formCreate.control}
          name="valorMatricula"
          render={({field})=>(
            <FormItem>
            <Input id="valorMAtricula" type='number' {...field} className="w-full"
            min="0"
            onChange={(e)=>{field.onChange(parseInt( e.target.value))}}/>
            <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
        )}/>
        </div>
        <div className="w-full">
        <FormField
          control={formCreate.control}
          name={'cursoId'}
          render={({field})=>(
          <FormItem>
            <Label htmlFor="curso" className="text-right">
            Curso
          </Label>
              <FormControl>
              <select id='curso' {...field} className='w-full py-3 rounded-md ring-1 bg-white text-gray-500 ring-gray-300 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                        <option>Selecione o curso</option>
                        {
                                    bNomeCurso.map((field)=>{
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
      <p className='font-poppins lowercase'>Actualize a página (F5) e pesquise pelo curso!</p>
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
)
}