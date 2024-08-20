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
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { EditIcon, PrinterIcon, Trash, CombineIcon} from 'lucide-react'
import { InfoIcon } from 'lucide-react'
import { UserPlus } from 'lucide-react'
import { GraduationCap as Cursos } from 'lucide-react';
import DataTable from 'react-data-table-component'
import { Textarea } from '@/components/ui/textarea'
import { dataNascimentoZod, emailZod, nomeCompletoZod, telefoneZod, nomeCursoZod, descricaoZod, duracaoZod } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'



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
  idDisciplina: z.number(),
  idCurso: z.number()
})

type FormPropsCreate =  z.infer<typeof TFormCreate>;
export default function Curse(){

  const formCreate  = useForm<z.infer<typeof TFormCreate>>({
    mode: 'all', 
    resolver: zodResolver(TFormCreate)
   })

   const handleSubmitCreate = async (data: z.infer<typeof TFormCreate>,e) => {
          
    await fetch(`http://localhost:8000/api/disciplinas`,{
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
    const[descricao, setDescricao] = React.useState();
    const[messageDisc, setMessageDisc] = React.useState();
    const[id,setId] = React.useState();

    React.useEffect(()=>{
        const search = async () => {
            const resp = await fetch(`http://localhost:8000/api/disciplinas/${buscar}`);
            const receve = await resp.json()
            setNome(receve.nome)
            setDescricao(receve.descricao)
            setId(receve.id)
            console.log(receve)
            if (receve.descricao)
            {
              setMessageDisc(receve.descricao)
            }
        }
        search()
    },[buscar])
 
    const changeResource=(id)=>{
        setBuscar(id)
    }


    const formUpdate  = useForm<z.infer<typeof TFormUpdate>>({
      mode: 'all', 
      resolver: zodResolver(TFormUpdate)
     })

     const [updateTable, setUpdateTable] = React.useState(false)
   const handleSubmitUpdate = async (data: z.infer<typeof TFormUpdate>) => {
          
    await fetch(`http://localhost:8000/api/disciplinas/${data.id}`,{
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

	/*Área q implementa o código pra pesquisar cursos*/
	      const [dataCursos, setDataCursos] = React.useState([]);
        const [nomeCurso, setNomeCurso] = React.useState([]);
        const [idCurso, setIdCurso] = React.useState();
        const [dataApiCursos, setDataApiCursos] = React.useState([]);
        const URLCURSO = "http://localhost:8000/api/cursos"
       
       useEffect( () => {
            const respFetchCursos = async () => {
                  const resp = await fetch (URLCURSO);
                  const respJson = await resp.json();
                  const conv1 = JSON.stringify(respJson.data)
                  const conv2 = JSON.parse(conv1)
                  setDataApiCursos(conv2)
                  
            } 
             respFetchCursos()
       },[])
    
        const handleFilterCurses =  (event) => {
            const newData = dataApiCursos.filter( row => {
                return row.nome.toLowerCase().includes(event.target.value.toLowerCase().trim())
            })
            setDataCursos(newData[0]);
            setNomeCurso(newData[0].nome);
            setIdCurso(newData[0].id);            
        }

      const formConnect  = useForm<z.infer<typeof TFormConnect>>({
          mode: 'all', 
          resolver: zodResolver(TFormConnect)
         })
      
      const handleSubmitConnect = async (data: z.infer<typeof TFormConnect>,e) => {
        /*vincular disciplina ao curso*/       
        const cursos = 
        {
          cursos: [data.idCurso]
        }
      
        await fetch(`http://localhost:8000/api/disciplinas/${data.idDisciplina}/cursos`,{
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(cursos)
              })
              .then((resp => resp.json()))
              .then((resp) =>{ console.log(resp)})
              .catch((error) => console.log(`error: ${error}`))
              console.log(cursos)
        /*vincular curso a disciplina      
          const disciplinas = [{
                disciplinas: data.idDisciplina
              }] 
          await fetch(`http://localhost:8000/api/cursos/${data.idCurso}/disciplinas`,{
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(disciplinas)
              })
              .then((resp => resp.json()))
              .then((resp) =>{ console.log(resp)})
              .catch((error) => console.log(`error: ${error}`))
              console.log(data)
              
            }*/
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
            selector: row => row.nome,
            sortable:true
         },
        { 
            name: 'Descrição',
            selector: row => row.descricao,
            sortable:true
        },
        {
            name: 'Ação',
            cell: (row) => (<div className='flex flex-row space-x-2'><EditIcon className='w-5 h-4 absolute text-white'/> 
            <Dialog >
          <DialogTrigger asChild onClick={()=>{
              formUpdate.setValue('nome', nome)
              formUpdate.setValue('descricao', descricao)
              formUpdate.setValue('id', row.id)
            }}>
          <div title='actualizar' className='relative flex justify-center items-center'>
          <EditIcon className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
            <Button className='h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm'></Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                  <DialogTitle>Actualizar Disciplina</DialogTitle>
                  <DialogDescription>
                  Actualiza uma disciplina aqui, click em actualizar quando terminar.
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
              
      </div>
      <DialogFooter>
        <Button type="submit">Actualizar Disciplina</Button>
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
            <h4 className="font-medium leading-none">Dados da Disiciplina</h4>
            <p className="text-sm text-muted-foreground">
              Inspecione os dados da displina
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Nome</Label>
              <p>{nome}</p>
            </div>
            <div className="w-full">
              <Label htmlFor="height">Descrição</Label>
              <p className='text-xs w-full'>{descricao}</p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
            </div>
            <div title='excluir' className='relative flex justify-center items-center cursor-pointer' ><Trash className='w-5 h-4 absolute text-white'/> <button className='py-3 px-5 rounded-sm bg-red-600  border-red-600'></button></div> 
            
        <Dialog >
          <DialogTrigger asChild >
          <div title='vincular' className='relative flex justify-center items-center'>
          <CombineIcon className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
            <Button className='h-7 px-5 bg-yellow-600 text-white font-semibold hover:bg-yellow-600 rounded-sm border-yellow-600'></Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                  <DialogTitle>Vincular Disciplina</DialogTitle>
                  <DialogDescription>
                  Essa secção tem como objectivo relacionar disciplinas em cursos especifícos.
                  </DialogDescription>
                </DialogHeader>
                <Form {...formConnect} >
              <form onSubmit={formConnect.handleSubmit(handleSubmitConnect)
              
              } >
               
              <div className="flex flex-col w-full py-4 bg-white">              
              <div className="w-full">
                <Label htmlFor="username" className="text-right">
                  Procurar Cursos
                </Label>
                <Input
                    id="name"
                    className="w-full italic"
                    placeholder='search by...'
                    onChange={handleFilterCurses}
                  />
              </div>
             <div>
              <p>{nomeCurso}
              </p>
              <p className='text-red-500 text-font-med'>
                <ul>
                  <li>{messageDisc}</li>
                </ul>
              </p>
             </div>
              
      </div>
      <DialogFooter>
        <Button type="submit" onClick={()=>{
                formConnect.setValue('idCurso', idCurso);
                formConnect.setValue('idDisciplina', row.id);
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
        const URL = "http://localhost:8000/api/disciplinas?page_size=15"
       
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
       <Dialog >
    <DialogTrigger asChild>
    <div title='cadastrar' className='relative flex justify-center items-center'>
    <Cursos className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
      <Button className='h-9 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm'></Button>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <DialogTitle>Cadastrar Disciplina</DialogTitle>
        <DialogDescription>
        Cadastre aqui uma nova disciplina, click em cadastrar quando terminar.
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
      </div>
      <DialogFooter>
        <Button type="submit">Cadastrar Disciplina</Button>
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