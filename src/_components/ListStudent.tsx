import * as React from 'react'
import { useEffect } from 'react'
import { EditIcon, Info } from 'lucide-react'
import Table from './Table'
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
import { InfoIcon } from 'lucide-react'
import { UserPlus } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, 
FormLabel, 
FormMessage} from '@/components/ui/form'
import { useDispatch, useSelector } from 'react-redux'
import { selectStudent, selectStudentId, updateStudent } from '@/_redux/studentUpdateSlice'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver} from '@hookform/resolvers/zod'
import { z } from 'zod'
import {nomeCompletoZod,  dataNascimentoZod, generoZod, numeroBiZod, bairroZod, ruaZod, numeroCasaZod, telefoneZod, emailZod} from '../_zodValidations/validations'

const TForm =  z.object({
    nomeCompleto: nomeCompletoZod,
    nomeCompletoPai: nomeCompletoZod,
    nomeCompletoMae: nomeCompletoZod,
    dataNascimento: dataNascimentoZod,
    genero: generoZod,
    bairro: bairroZod,
    rua: ruaZod,
    numeroCasa: z.number(),
    telefone: telefoneZod,
    email: emailZod,
    id: z.number()
  })

  type FormProps =  z.infer<typeof TForm>;


export default function ListStudent(){
    const form  = useForm<z.infer<typeof TForm>>({
        mode: 'all', 
        resolver: zodResolver(TForm)
       })

       const [showModal, setShowModal] = React.useState(false);
       const [modalMessage, setModalMessage] = React.useState('');  
       const [updateTable, setUpdateTable] = React.useState(false)
        const handleSubmitUpdate = async (data: z.infer<typeof TForm>,e) => {
          
          const dados = 	{
            nomeCompleto: data.nomeCompleto,
            nomeCompletoPai: data.nomeCompletoPai,
            nomeCompletoMae: data.nomeCompletoMae,
            dataNascimento: data.dataNascimento,
            genero: data.genero,
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
          await fetch(`http://localhost:8000/api/alunos/${data.id}`,{
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(dados)
              })
              .then((resp => resp.json()))
              .then((resp) =>{ 
                setShowModal(true);
                setModalMessage(resp.message);
               console.log(resp.message);
              })
              .catch((error) => console.log(`error: ${error}`))
              setUpdateTable(true)
          }

    const[buscar, setBuscar] = React.useState(2);
    const[nome, setNome] = React.useState();
    const[pai, setPai] = React.useState();
    const[mae, setMae] = React.useState();
    const[bi, setBi] = React.useState();
    const[nasc, setNasc] = React.useState();
    const[genero,setGenero] = React.useState();
    const[bairro,setBairro] = React.useState();
    const[rua,setRua] = React.useState();
    const[casa,setCasa] = React.useState();
    const[telefone,setTelefone] = React.useState();
    const[email,setEmail] = React.useState();

    React.useEffect(()=>{
        const search = async () => {
            const resp = await fetch(`http://localhost:8000/api/alunos/${buscar}`);
            const receve = await resp.json()
            console.log(receve)
            setNome(receve.nomeCompleto)
            setPai(receve.nomeCompletoPai)
            setMae(receve.nomeCompletoMae)
            setBi(receve.numeroBi)
            setNasc(receve.dataNascimento)
            setGenero(receve.genero)
            setBairro(receve.endereco.bairro)
            setRua(receve.endereco.rua)
            setCasa(receve.endereco.numeroCasa)
            setTelefone(receve.contacto.telefone)
            setEmail(receve.contacto.email)
            
        }
        search()
    },[buscar])
    const changeResource=(id)=>{
        setBuscar(id)
    }
    const navigate = useNavigate()
    const updatePage = () => {
        
        navigate('/StudentUpdatePage')
    }
    const columns = 
[
    { 
        name: 'Id',
        selector: row => row.id,
        sortable:true,
        sortField: "id"
     },
    { 
        name: 'Nome',
        selector: row => row.nomeCompleto,
        sortable:true,
        sortField: "nome"
     },
    { 
        name: 'Número de Bi',
        selector: row => row.numeroBi,
        sortable:true
    },
    { 
        name: 'Data de Nascimento',
        selector: row => row.dataNascimento,
        sortable:true
    },
    {
        name: 'Ação',
        cell: (row) => (<div className='flex flex-row  cursor-pointer space-x-2'  >
             <Dialog >
    <DialogTrigger asChild onClick={()=>{
        form.setValue('nomeCompleto', nome)
        form.setValue('genero', genero)
        form.setValue('dataNascimento', nasc)
        form.setValue('nomeCompletoPai', pai)
        form.setValue('nomeCompletoMae', mae)
        form.setValue('bairro', bairro)
        form.setValue('rua', rua)
        form.setValue('numeroCasa', parseInt(casa))
        form.setValue('telefone', telefone)
        form.setValue('email', email)
        form.setValue('id', row.id)
      }}>
    <div title='actualizar' className='relative flex justify-center items-center' >
    <EditIcon className='w-5 h-4 absolute text-white font-extrabold'/>
      <button className='h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm' ></button>
      </div>
      
    </DialogTrigger>
    <DialogContent className="sm:max-w-[625px] overflow-y-scroll h-[550px] bg-white">
      <DialogHeader>
        <DialogTitle>Actualizar Aluno</DialogTitle>
        <DialogDescription>
        Actualiza o registro do aluno aqui.
        </DialogDescription>
      </DialogHeader>
     
      <Form {...form} >
     <form onSubmit={form.handleSubmit(handleSubmitUpdate)} >
     <div className="w-full flex flex-col justify-between  ">
     <FormField
          control={form.control}
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
            className="w-full"
            
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
            Gênero
          </Label>
         
            <FormField
          control={form.control}
          name="genero"
          render={({field})=>(
            <FormItem>
            <FormControl>
          <select {...field} id='genero' className='w-full py-3 bg-white border-gray-3s00 rounded-md'>
              <option value="M">M</option>
              <option value="F">F</option>
          </select>
          </FormControl>
           <FormMessage className='text-red-500 text-xs'/>
           </FormItem>
        )}/></div></div>
        <div className="flex w-full flex-col text-left">
        <Label htmlFor="nasc" >
            Data de nascimento
          </Label>
         
            <FormField
          control={form.control}
          name="dataNascimento"
          render={({field})=>(
           <FormControl>
          <FormItem>
          <Input type='date' id="nasc" {...field} className="w-full"/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>

        )}/>
          </div>
        <div className="w-full flex flex-row justify-between space-x-2">
        <div className='w-full'>
          <Label htmlFor="pai" className="text-right">
            Nome do pai
          </Label>
         
            <FormField
          control={form.control}
          name="nomeCompletoPai"
          render={({field})=>(
            <FormControl>
                <FormItem>
          <Input id="pai" type='text' {...field} className="w-full"/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/></div>
        <div className='w-full'>
          <Label htmlFor="mae" className="text-right">
            Nome da mãe
          </Label>
         
            <FormField
          control={form.control}
          name="nomeCompletoMae"
          render={({field})=>(
            <FormControl>
            <FormItem>
          <Input id="mae" type='text' {...field} className="w-full"/>
          <FormMessage className='text-red-500 text-xs'/>
          </FormItem>
          </FormControl>
        )}/></div></div></div>
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
          <Input id="casa" type='number' {...field} className="w-full"  onChange={(e)=>{field.onChange(parseInt( e.target.value))}}/>
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
        </div>
      
      
      <DialogFooter>
        <Button className='bg-green-500 border-green-500 text-white hover:bg-green-500' type='submit'>Guardar Mudanças</Button>
      </DialogFooter>
      </form>
      </Form>
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
        <DialogTitle>Informações sobre {row.nomeCompleto}</DialogTitle>
        <DialogDescription >
        As informações relevantes do aluno, são listadas aqui!
        </DialogDescription>
      </DialogHeader>
     
      <div className="grid gap-4 py-4 bg-white">
        <div className="flex flex-col w-full"><fieldset>
            <legend className='font-robotoSlab text-sm'>Dados Pessoal</legend>
            <div className='w-full flex flex-col space-y-3'>
            <div className="w-full flex flex-row justify-between px-2">
            <div>
                <Label className='font-poppins'>nome completo</Label>
                <p className='font-thin text-sm'>{nome}</p>
            </div>
            <div>
                 <Label className='font-poppins'>número do bi</Label>		
                  <p className='font-thin text-sm'>{bi}</p>
            </div>
            </div>
            <div className="w-full flex flex-row justify-between px-2">
            <div>
                <Label className='font-poppins'>nome do pai</Label>	
                <p className='font-thin text-sm'>{pai}</p>
            </div>
            <div>
                <Label className='font-poppins'>nome da mãe</Label>
                <p className='font-thin text-sm'>{mae}</p>
            </div>
            </div>
            <div className="w-full flex flex-row justify-between px-2">
            <div>
                
                <Label className='font-poppins'>gênero</Label>
                <p className='font-thin text-sm'>{genero}</p>
            </div>
            <div>
                <Label className='font-poppins'>data de nascimento</Label>
                <p className='font-thin text-sm'>{nasc}</p>
            </div>
            </div>
            </div>
            
        </fieldset>
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
        <p className='font-lato italic text-blue-600 text-xs cursor-pointer'>Todos os dados do aluno<InfoIcon className='w-2 h-2'/>.</p>
      </DialogFooter>
    </DialogContent>
  </Dialog>
        </div>),
    }, 
];
    const [dados, setDados] = React.useState([])
    const [dataApi, setDataApi] = React.useState([])
    const URL = "http://localhost:8000/api/alunos"
   
   useEffect( () => {
        const respFetch = async () => {
              const resp = await fetch (URL);
              const respJson = await resp.json();
              const conv1 = JSON.stringify(respJson.data)
              const conv2 = JSON.parse(conv1)
              setDados(conv2)
              setDataApi(conv2)
              setUpdateTable(false)
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


    return (
    <>
    <Table title="Lista dos Estudantes" dados={dados} handleFilter={handleFilter} columns={columns}  handleRows={handleRows} handleSort={handleSort}/>
    {showModal && 
  <Dialog open={showModal} onOpenChange={setShowModal}>
    <DialogTrigger asChild>
    <div className='relative flex justify-center items-center'>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <DialogTitle>Resposta</DialogTitle>
        <DialogDescription>
          {modalMessage}
        </DialogDescription>
      </DialogHeader>
         </DialogContent>
        </Dialog>
    }
    </>)
}