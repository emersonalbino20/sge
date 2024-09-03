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
import { EditIcon, PrinterIcon, Trash} from 'lucide-react'
import { InfoIcon } from 'lucide-react'
import { GraduationCap as Cursos } from 'lucide-react';
import DataTable from 'react-data-table-component'
import {anoLectivo, classe, anoLectivoId, cursoId, custoMatricula, sala, capacidade, localizacao, terminoturno, inicioturno } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm} from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'



const TFormCreate =  z.object(
{
  nome: sala,/*A validacao da sala é equicalente com o turno*/
  classeId: z.number(),
  salaId: z.number(),
  turnoId: z.number()
})

const TFormUpdate =  z.object({
  nome: sala,
  classeId: z.number(),
  salaId: z.number(),
  turnoId: z.number(),
  id: z.number()
})

export default function Curse(){

const formCreate  = useForm<z.infer<typeof TFormCreate>>({
  mode: 'all', 
  resolver: zodResolver(TFormCreate)
})

const handleSubmitCreate = async (data: z.infer<typeof TFormCreate>,e) => {
      
await fetch(`http://localhost:8000/api/turmas/`,{
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

const[buscar, setBuscar] = React.useState();
const[nome, setNome] = React.useState();
const[classe, setClasse] = React.useState();
const[sala, setSala] = React.useState();
const[turno, setTurno] = React.useState();
const[id,setId] = React.useState();

React.useEffect(()=>{
    const search = async () => {
        const resp = await fetch("http://localhost:8000/api/turmas/1");
        const receve = await resp.json()
        setNome(receve.nome)
        setClasse(receve.classeId)
        setSala(receve.salaId)
        setTurno(receve.turnoId)
        setId(receve.id)
        //console.log(receve)
    }
    search()
},[buscar])


const changeResource = (id)=>{
    setBuscar(id)
}

const formUpdate  = useForm<z.infer<typeof TFormUpdate>>({
  mode: 'all', 
  resolver: zodResolver(TFormUpdate)
  })

const [updateTable, setUpdateTable] = React.useState(false)
const handleSubmitUpdate = async (data: z.infer<typeof TFormUpdate>,e) => {
  await fetch(`http://localhost:8000/api/turnos/${data.id}`,{
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
}

/*Buscar dados da Classe*/
const[nomeClasse,setNomeClasse] = React.useState();
const[idClasse,setIdClasse] = React.useState();
React.useEffect(()=>{
    const search = async () => {
        const resp = await fetch(`http://localhost:8000/api/clases/1`);
        const receve = await resp.json()
        setNomeClasse(receve.data[0].nome)
        setIdClasse(receve.data[0].id)
        //console.log(receve.data[0].nome)
    }
    search()
},[])

/*Buscar dados da sala, turno*/
const[salas,setSalas] = React.useState([]);
const[turnos, setTurnos] = React.useState([]);
const URLSALA = "http://localhost:8000/api/salas"
const URLTURNO = "http://localhost:8000/api/turnos"
React.useEffect(()=>{
    const search = async () => {
        const respSala = await fetch(URLSALA);
        const receveSala = await respSala.json()
        const convsala1 = JSON.stringify(receveSala.data)
        const convsala2 = JSON.parse(convsala1)
        setSalas(convsala2)

        const respTurno = await fetch(URLTURNO);
        const receveTurno = await respTurno.json()
        const convTurno = JSON.stringify(receveTurno.data)
        const convTurno2 = JSON.parse(convTurno)
        setTurnos(convTurno2)
    }
    search()
},[])
    const columns = 
    [
        { 
            name: 'Id',
            selector: row => row.id,
            sortable:true
         },
         { 
          name: 'Turmas',
          selector: row => row.nome,
          sortable:true
        },
        { 
            name: 'Classe',
            selector: row => row.classe,
            sortable:true
         },
        { 
            name: 'Sala',
            selector: row => row.sala,
            sortable:true
        },
        {
            name: 'Ação',
            cell: (row) => (<div className='flex flex-row space-x-2'><EditIcon className='w-5 h-4 absolute text-white'/> 
            <Dialog >
          <DialogTrigger asChild onClick={()=>{
              changeResource(row.id)
              formUpdate.setValue('nome', nome)
              formUpdate.setValue('salaId', sala)
              formUpdate.setValue('classeId', classe)
              formUpdate.setValue('turnoId', turno)
              formUpdate.setValue('id', row.id)
            }}>
          <div title='actualizar' className='relative flex justify-center items-center'>
          <EditIcon className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
            <Button  className='h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm'></Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                  <DialogTitle>Actualizar Turma</DialogTitle>
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
                <Label htmlFor="classe" className="text-right">
                  Id da Classe
                </Label>
                <FormField
                control={formUpdate.control}
                name="classeId"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="classe"
                    type='number' {...field} className="w-full"
                    min="0"
                    onChange={(e)=>{field.onChange(parseInt( e.target.value))}}/>
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>
              </div>
              <div className="w-full">
              <Label htmlFor="turno" className="text-right">
                  Id do Turno
                </Label>
                <FormField
                control={formUpdate.control}
                name="turnoId"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="turno"
                    type='number' {...field} className="w-full"
                    min="0"
                    onChange={(e)=>{field.onChange(parseInt( e.target.value))}}/>
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>               
              
              </div>
              <div className="w-full">
              <Label htmlFor="sala" className="text-right">
                  Id da Sala
                </Label>
                <FormField
                control={formUpdate.control}
                name="salaId"
                render={({field})=>(
                  <FormItem>
                  <Input
                    id="sala"
                    type='number' {...field} className="w-full"
                    min="0"
                    onChange={(e)=>{field.onChange(parseInt( e.target.value))}}/>
                  <FormMessage className='text-red-500 text-xs'/>
                </FormItem>
              )}/>               
              
              </div>
      </div>
      <DialogFooter>
      <Button className='bg-green-500 border-green-500 text-white hover:bg-green-500 font-semibold' type='submit'>Actualizar</Button>
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
            <h4 className="font-medium leading-none">Dados da Sala</h4>
            <p className="text-sm text-muted-foreground">
              Inspecione os dados
            </p>
          </div>
          <div className="grid gap-2">
          <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Classe</Label>
              <p>{classe}</p>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Sala</Label>
              <p>{sala}</p>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Turno</Label>
              <p className='text-xs'>{turno}</p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
            </div>
            <div title='excluir' className='relative flex justify-center items-center cursor-pointer' ><Trash className='w-5 h-4 absolute text-white'/> <button className='py-3 px-5 rounded-sm bg-red-600  border-red-600'></button></div>
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
        const one = 1;
        const URL = `http://localhost:8000/api/turmas/${one}`
       
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
    
        const handleRows = ({selectedRows}) => {
            setTimeout(()=>{
               changeResource(selectedRows[0].id)
            },1000)  
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
   selectableRows
   selectableRowsSingle
   onSelectedRowsChange={handleRows}
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
        <DialogTitle>Cadastrar Turma</DialogTitle>
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
            <FormField
              control={formCreate.control}
              name={'classeId'}
              render={({field})=>(
              <FormItem>
                <Label htmlFor="classe" className="text-right">
                Classe
              </Label>
                  <FormControl>
                  <select id='classe' {...field} className='w-full py-3 rounded-md ring-1 bg-white text-gray-500 ring-gray-300 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                            <option>Selecione a classe</option>
                            <option value={1}>"Nao existe endpoint"</option>
                      </select>
                  </FormControl>
                <FormMessage className='text-red-500 text-xs'/>
              </FormItem>)
              }
              />
              </div>
              
              <div className="w-full">
              <FormField
              control={formCreate.control}
              name={'turnoId'}
              render={({field})=>(
              <FormItem>
                <Label htmlFor="turno" className="text-right">
                Turno
              </Label>
                  <FormControl>
              <select id='turno' {...field} className='w-full py-3 rounded-md ring-1 bg-white text-gray-500 ring-gray-300 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                            <option>Selecione o turno</option>
                            {
                                    turnos.map((field)=>{
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
              control={formCreate.control}
              name={'salaId'}
              render={({field})=>(
              <FormItem>
                <Label htmlFor="sala" className="text-right">
                Sala
              </Label>
                  <FormControl>
              <select id='sala' {...field} className='w-full py-3 rounded-md ring-1 bg-white text-gray-500 ring-gray-300 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                            <option>Selecione a sala</option>
                            {
                                    salas.map((field)=>{
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
)
}