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
import { useEffect} from 'react'
import { AlertCircleIcon, AlertTriangle, CheckCircleIcon, SaveIcon, Search} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { dataNascimentoZod, emailZod, nomeCompletoZod, telefoneZod, disciplinas, idZod } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Select from 'react-select';
import { MyDialog, MyDialogContent } from './my_dialog'
import InputMask from 'react-input-mask'
import { AroundDiv, CombineButton, EditButton, InfoButton, LibraryButton, TrashButton, UserPlusButton } from './MyButton'
import { tdStyle, thStyle, trStyle, tdStyleButtons } from './table'
import Header from './Header'
import { useHookFormMask, withMask } from 'use-mask-input'

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

const TFormClasse =  z.object({
  idProfessor: idZod,
  disciplinaId: idZod,
  classeId: idZod,
  turmaId: idZod
})

/*Vinculo de professor e disciplina*/
const TFormConnect =  z.object({
  idProfessor: z.number(),
  disciplinas: disciplinas,
  nomeDisciplinas: z.array(z.string())
})

/*Desvinculo de professor e disciplina*/
const TFormUnConnect =  z.object({
  idProfessor: z.number(),
  disciplinas: disciplinas,
  nomeDisciplinas: z.array(z.string())
})

type FormProps =  z.infer<typeof TForm>;
type FormPropsUpdate =  z.infer<typeof TFormUpdate>;
export default function Teacher (){
  
  const form  = useForm<z.infer<typeof TForm>>({
    mode: 'all', 
    resolver: zodResolver(TForm)
   })

   const {formState:{ errors }, register} = form;
   const registerWithMask = useHookFormMask(register);

   const formUpdate  = useForm<z.infer<typeof TFormUpdate>>({
    mode: 'all', 
    resolver: zodResolver(TFormUpdate)
   })
   const upWithMask = useHookFormMask(formUpdate.register)

   const formConnect  = useForm<z.infer<typeof TFormConnect>>({
    mode: 'all', 
    resolver: zodResolver(TFormConnect)
   })

   const formUnConnect  = useForm<z.infer<typeof TFormUnConnect>>({
    mode: 'all', 
    resolver: zodResolver(TFormUnConnect)
   })

   const formClasse  = useForm<z.infer<typeof TFormClasse>>({
    mode: 'all', 
    resolver: zodResolver(TFormClasse)
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
            formClasse.setValue('idProfessor', buscar)
            formUpdate.setValue('nomeCompleto', receve.nomeCompleto)
            formUpdate.setValue('dataNascimento', receve.dataNascimento)
            formUpdate.setValue('telefone', receve.contacto.telefone)
            if(receve.contacto.email != null){
              formUpdate.setValue('email', receve.contacto.email)}else{
                formUpdate.setValue('email', '')
              }
            formUpdate.setValue('id', receve.id)
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
    /*vincular professor à disciplina*/       
    const disciplinas = 
    {
      disciplinas: data.disciplinas
    }
  
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
              let index = parseInt(Object.keys(resp.errors.disciplinas)[0]);
              setModalMessage(resp.errors.disciplinas[index]+"\n Disciplina: "+data.nomeDisciplinas[index]);
            }else{
              setModalMessage(resp.message);
            }
            console.log(resp)
            //resp.errors.forEach((v)=> { return console.log(v)})
          })
          .catch((error) => console.log(`error: ${error}`))
          setUpdateTable(!updateTable)
      }
  const handleSubmitUnConnect = async (data: z.infer<typeof  TFormUnConnect>,e) => {
        const disciplinas = 
        {
          disciplinas: data.disciplinas
        }
        await fetch(`http://localhost:8000/api/professores/${data.idProfessor}/disciplinas`,{
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
                console.log(resp)
              })
             .catch((error) => console.log(`error: ${error}`))
             setUpdateTable(!updateTable)
  }

  const [ano, setAno] = React.useState();
  const [turma, setTurma] = React.useState([]);
  const [idClasse, setIdClasse] = React.useState(0);
  const [grade, setGrade] = React.useState([]);
  const [dataApiCursos, setDataApiCursos] = React.useState([]);
  const URLCURSO = `http://localhost:8000/api/ano-lectivos/${ano}/classes`;
  const URLLECTIVO = "http://localhost:8000/api/ano-lectivos"
  const URLTURMA = `http://localhost:8000/api/classes/${idClasse}/turmas`
  React.useEffect( () => {
    const respFetchCursos = async () => {
        //Buscar Ano Lectivos
        const resplectivo = await fetch (URLLECTIVO);
        const resplectivoJson = await resplectivo.json();
        var meuarray = resplectivoJson.data.find((c)=>{
          return c.activo === true
        })
        setAno(meuarray.id);

        const resp = await fetch (URLCURSO);
        const respJson = await resp.json();
        let nArray = Object.values(respJson.data.cursos)
        setDataApiCursos(nArray);
        
        if (idClasse > 0)
        {
          const respturma = await fetch (URLTURMA);
          const respturmaJson = await respturma.json();
          setTurma(respturmaJson.data)
          }
      } 
      respFetchCursos()
  },[ano, idClasse])

  const handleGrade =  (event) => {
    const curso = Object.values(dataApiCursos).find(curso => curso.nome === event.target.value);
    if(curso)
    {
      let i = curso.classes.map( classe =>
        {
          return classe;
        })
        setGrade(i)
    }
  }
    const [disciplinaProf, setDisciplinaProf] = React.useState([]);
    const [classeProf, setClasseProf] = React.useState([]);
    const URLDISCPROF = `http://localhost:8000/api/professores/${formClasse.getValues('idProfessor')}/disciplinas`;
    const URLCLASSPROF = `http://localhost:8000/api/professores/${formClasse.getValues('idProfessor')}/classes`;

    React.useEffect( () => {
      const respFetch = async () =>{
          const resp = await fetch (URLDISCPROF);
          const respJson = await resp.json();
          const conv = JSON.stringify(respJson.data)
          const conv2 = JSON.parse(conv)
          setDisciplinaProf(conv2);

          const  respI = await fetch (URLCLASSPROF);
          const respJsonI = await respI.json();
          const convI = JSON.stringify(respJsonI.data);
          const conv2I = JSON.parse(convI);
          setClasseProf(conv2I);
          conv2I.forEach(element => {
            console.log("Curso: "+element.curso.nome+"\nClasse: "+element.nome)
          });
          //console.log(conv2I);
        }
          respFetch();
    }, [formClasse.getValues('idProfessor')])
     const handleSubmitClasse = async (data: z.infer<typeof TFormClasse>,e) => {

      const classes = {
        disciplinaId: data.disciplinaId,
        classeId: data.classeId,
        turmaId: data.turmaId
      };
    
      await fetch(`http://localhost:8000/api/professores/${data.idProfessor}/classes`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(classes)
            })
            .then((resp => resp.json()))
            .then((resp) =>{ 
              setShowModal(true);  
              if (resp.message != null) {
                setModalMessage("Disciplina: "+resp.errors.disciplinaId[0]);
                console.log(resp.errors.disciplinaId[0])
              }else{
                setModalMessage(resp.message);
              }
              
            })
            .catch((error) => console.log(`error: ${error}`))
            setUpdateTable(!updateTable)
        }

      //Vincular um professor a multiplas disciplinas
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
    const URL = "http://localhost:8000/api/professores?page_size=21"
    
       useEffect( () => {
            const respFetch = async () => {
                  const resp = await fetch (URL);
                  const respJson = await resp.json();
                  const conv1 = JSON.stringify(respJson.data)
                  const conv2 = JSON.parse(conv1)
                  conv2.sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto))
                  setDados(conv2)
                  setDataApi(conv2)
            } 
             respFetch()
       },[updateTable])

        const columns = ['Id', 'Nome', 'Data de Nasc.', 'Acção'];
        
        const handleFilter = (event) => {
           const valores = dataApi.filter((element) =>{ return (element.nomeCompleto.toLowerCase().includes(event.target.value.toLowerCase().trim())) });
           setDados(valores)
       }
    
    return(<section className="m-0 w-screen h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300  grid-flow-col grid-cols-3">
    <Header title={false}/>
       
         <div className='flex flex-col space-y-2 justify-center items-center w-full'> 
         <div className='animate-fade-left animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-in flex flex-col space-y-2 justify-center w-[90%] z-10'>
          <div className='flex flex-row space-x-2'>
            <div className='relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96'>
                <Search className='absolute text-gray-300'/>            
                <input className=' pl-6 rounded-md border-2 border-gray-400 placeholder:text-gray-400 placeholder:font-bold outline-none py-2 w-full indent-2' type='text' placeholder='Procure por registros...' onChange={handleFilter}/>
            </div>
            
        
          <Dialog >
    <DialogTrigger asChild>
    <div title='cadastrar' className={AroundDiv}>
      <UserPlusButton/>
    </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <DialogTitle className='text-sky-800 text-xl'>Cadastrar Registro</DialogTitle>
        <DialogDescription>
          <p className='text-base text-gray-800'>
          preencha o formulário e em seguida click em <span className='font-bold text-sky-700'>cadastrar</span> quando terminar.
        </p>
        </DialogDescription>
      </DialogHeader>
      <Form {...form} >
     <form onSubmit={form.handleSubmit(handleSubmitCreate)} >
      <div className="flex flex-col w-full py-4 bg-white">
        <div className="w-full">
          <Label htmlFor="name"className='text-sky-700 text-lg font-semibold'>Nome Completo<span className='text-red-500'>*</span>
          </Label>
          <FormField
          control={form.control}
          name="nomeCompleto"
          render={({field})=>(
          <FormItem>
           <FormControl>
           <Input type='text' {...field} 
            className={errors.nomeCompleto?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
            'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}/>
          </FormControl>
          <FormMessage className='text-red-500 text-base'/>
          </FormItem>
        )}
           />         
          <Label htmlFor="date"className='text-sky-700 text-lg font-semibold'>Data de Nasc.<span className='text-red-500'>*</span>
          </Label>
            <FormField
          control={form.control}
          name="dataNascimento"
          render={({field})=>(
            <FormItem>
            <FormControl>
            <Input  id="date" type='date' {...field}  
            className={errors.dataNascimento?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
            'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}/>
          </FormControl>
          <FormMessage className='text-red-500 text-base'/>
          </FormItem>
        )}/>
          <Label htmlFor="email"className='text-sky-700 text-xl font-semibold'>Email<span className='text-red-500'>*</span>
          </Label>
      <FormField
          control={form.control}
          name="email"
          render={({field})=>(
            <FormItem>
            <FormControl>
            <Input  id="email" type='email' {...field}
            className={errors.email?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
            'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}/>
          
          </FormControl>
          <FormMessage className='text-red-500 text-base'/>
          </FormItem>
        )}/>
          <Label htmlFor="tel"className='text-sky-700 text-lg font-semibold'>Telefone<span className='text-red-500'>*</span>
          </Label>
      <FormField
          control={form.control}
          name="telefone"
          render={({field})=>(
            <FormItem>
            <FormControl>
            <Input {...registerWithMask('telefone',['999999999'], {required: true})} className={errors.telefone?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
            'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}/>
            </FormControl>
          <FormMessage className='text-red-500 text-base'/>
          </FormItem>
        )}/>
        </div>
        <div className='flex flex-col w-full'>
        <FormField
              control={form.control}
              name="disciplinas"
              render={({field})=>(
              <FormItem>
                <Label htmlFor="disciplina"className='text-sky-700 text-lg font-semibold'>Leciona<span className='text-red-500'>*</span>
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
                <FormMessage className='text-red-500 text-base'/>
              </FormItem>)
              }
              />
          </div>
      </div>
      <DialogFooter>
      <div className='relative flex justify-center items-center' >
      <Button className='bg-blue-500 border-blue-500 text-white hover:bg-blue-500 font-semibold w-12' title='cadastrar' onClick={()=>{form.setValue('disciplinas', selectedValues)}}type='submit'><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
      </div>
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
                        <td rowSpan={4} colSpan={4} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
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
                            <td className={tdStyle}>{item.dataNascimento}</td>
                            <td className={tdStyleButtons}    onClick={()=>{
                              changeResource(item.id)
                            }}>
                                <Dialog >
                                        <DialogTrigger asChild >
                                        <div title='actualizar' className={AroundDiv} >
                                          <EditButton/>
                                        </div>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[425px] bg-white">
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
                                      <FormField
                                            control={formUpdate.control}
                                            name="id"
                                            render={({field})=>(
                                              <FormControl>
                                            <Input 
                                            type='hidden'
                                            
                                              className={"w-full"}
                                              
                                              {...field} 
                                              
                                              onChange={(e)=>{field.onChange(parseInt( e.target.value))}}
                                            
                                            />
                                            </FormControl>
                                          )}
                                            />
                                    
                                        <div className="flex flex-col w-full py-4 bg-white">
                                          <div className="w-full">
                                  <Label htmlFor="name"className='text-sky-700 text-lg font-semibold'>Nome Completo<span className='text-red-500'>*</span>
                                  </Label>
                                  <FormField
                                  control={formUpdate.control}
                                  name="nomeCompleto"
                                  render={({field})=>(
                                  <FormItem>
                                  <FormControl>
                                  <Input 
                                    id="name"
                                    className={formUpdate.formState.errors.nomeCompleto?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                                    'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}
                                    {...field}
                                  />
                                  </FormControl>
                                  <FormMessage className='text-red-500 text-xs'/>
                                  </FormItem>
                                )}
                                  />
                                   <Label htmlFor="date"className='text-sky-700 text-lg font-semibold'>Data de Nasc.<span className='text-red-500'>*</span>
                                    </Label>
                                  
                                      <FormField
                                    control={formUpdate.control}
                                    name="dataNascimento"
                                    render={({field})=>(
                                      <FormItem>
                                      <FormControl>
                                    <Input id="date" type='date' {...field} className={formUpdate.formState.errors.dataNascimento?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                                    'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}/>
                                    </FormControl>
                                    <FormMessage className='text-red-500 text-xs'/>
                                    </FormItem>
                                  )}/>
                                      <Label htmlFor="email"className='text-sky-700 text-lg font-semibold'>Email<span className='text-red-500'>*</span>
                                    </Label>
                                        <FormField
                                            control={formUpdate.control}
                                            name="email"
                                            render={({field})=>(
                                              <FormItem>
                                              <FormControl>
                                            <Input
                                              id="email" type='text'
                                          className={formUpdate.formState.errors.email?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                                              'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}
                                            {...field}/>
                                            </FormControl>
                                            <FormMessage className='text-red-500 text-xs'/>
                                            </FormItem>
                                          )}/>
                          <Label htmlFor="tel"className='text-sky-700 text-lg font-semibold'>Telefone<span className='text-red-500'>*</span>
                                    </Label>
                        <FormField
                            control={formUpdate.control}
                            name="telefone"
                            render={({field})=>(
                              <FormItem>
                              <FormControl>
                              <Input {...upWithMask('telefone',['999999999'], {required: true})} className={formUpdate.formState.errors.telefone?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2':
                              'w-full text-md border-2 border-gray-300 text-gray-600 focus:text-sky-600 focus:font-semibold focus:border-sky-500 py-4 mb-2'}/>
                                            </FormControl>
                                            <FormMessage className='text-red-500 text-xs'/>
                                            </FormItem>
                                          )}/>
                                          </div>
                                        </div>
                                        <DialogFooter>
                                          <Button title='actualizar' className='bg-green-500 border-green-500 text-white hover:bg-green-500 w-12' type='submit'><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
                                        </DialogFooter>
                                        </form></Form>
                                      </DialogContent>
                                </Dialog>
                                <Dialog >
                            <DialogTrigger asChild >
                            <div title='Add classes' className={AroundDiv} >
                                <LibraryButton/>
                            </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[485px] overflow-y-scroll h-[570px] bg-white">
                              <DialogHeader>
                              <DialogTitle className='text-sky-800 text-xl'>Delegar Turma</DialogTitle>
                                  <DialogDescription>
                                    <p className='text-base text-gray-800'>
                                    Adicione nessa secção as turmas que um professor poderá lecionar.
                                  </p>
                                  </DialogDescription>
                            </DialogHeader>
                              <Form {...formClasse} >
                            <form onSubmit={formClasse.handleSubmit(handleSubmitClasse)} >
                            <div className='flex flex-col space-y-3 mb-5'>
                                <div className='flex flex-col'>
                                  <Label htmlFor="curso"className='text-sky-700 text-lg font-semibold'>Cursos<span className='text-red-500'>*</span>
                              </Label>
                              <select id='cursos' className={'w-full bg-white text-lg border-2 border-gray-300 text-gray-600 focus:text-sky-700 focus:font-semibold focus:border-sky-500 py-2 focus:outline-none rounded-md'} onChange={handleGrade}>
                                    <option >Selecione o curso</option>
                                    {
                                          dataApiCursos.map((field)=>{
                                              return <option >{field.nome}</option>
                                          })
                                    }
                                </select>
                                    
                              </div>
                              <div className='flex flex-col w-full'>
                              <FormField
                              control={formClasse.control}
                              name='classeId'
                              render={({field})=>(
                              <FormItem>
                               <Label htmlFor="classe"className='text-sky-700 text-lg font-semibold'>Classes<span className='text-red-500'>*</span>
                                    </Label>
                                  <FormControl>
                                    <select id='classe' {...field} className={
                      formClasse.formState.errors.classeId?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-lg border-2 border-red-300 text-red-600 focus:text-red-700 focus:font-semibold focus:border-red-500 py-2 focus:outline-none rounded-md bg-white':
                      'w-full bg-white text-lg border-2 border-gray-300 text-gray-600 focus:text-sky-700 focus:font-semibold focus:border-sky-500 py-2 focus:outline-none rounded-md'} onChange={(e)=>{field.onChange(parseInt(e.target.value))
                                      setIdClasse(parseInt(e.target.value, 10) || 0)
                                    }}>
                                  <option >Selecione a classe</option>
                                  {
                                        grade.map((field)=>{
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
                                            <div className='flex flex-col w-full'>
                                <FormField
                                control={formClasse.control}
                                name='turmaId'
                                render={({field})=>(
                                <FormItem>
                                    <Label htmlFor="turma"className='text-sky-700 text-lg font-semibold'>Turmas<span className='text-red-500'>*</span>
                                    </Label>
                                    <FormControl>
                                    <select id='turma' {...field} className={
                      formClasse.formState.errors.turmaId?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-lg border-2 border-red-300 text-red-600 focus:text-red-700 focus:font-semibold focus:border-red-500 py-2 focus:outline-none rounded-md bg-white':
                      'w-full bg-white text-lg border-2 border-gray-300 text-gray-600 focus:text-sky-700 focus:font-semibold focus:border-sky-500 py-2 focus:outline-none rounded-md'} onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                                    <option >Selecione a turma</option>
                                    {
                                          turma.map((field)=>{
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
                          control={formClasse.control}
                          name="disciplinaId"
                          render={({field})=>(
                          <FormItem>
                           <Label htmlFor="disciplina"className='text-sky-700 text-lg font-semibold'>Disciplinas Curriculares<span className='text-red-500'>*</span>
                                    </Label>
                              <FormControl>
                              <FormControl>
                                    <select id='disciplina' {...field} className={
                      formClasse.formState.errors.disciplinaId?.message ? 'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-lg border-2 border-red-300 text-red-600 focus:text-red-700 focus:font-semibold focus:border-red-500 py-2 focus:outline-none rounded-md bg-white':
                      'w-full bg-white text-lg border-2 border-gray-300 text-gray-600 focus:text-sky-700 focus:font-semibold focus:border-sky-500 py-2 focus:outline-none rounded-md'} onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                                    <option >Selecione a disciplina</option>
                                    {
                                          disciplinaProf.map((field)=>{
                                              return <option value={`${field.id}`}>{field.nome}</option>
                                          })
                                    }
                                </select>
                                    </FormControl>
                              </FormControl>
                            <FormMessage className='text-red-500 text-xs'/>
                          </FormItem>)
                          }
                          />
                          </div>
                          
                                      </div>
                              
                              <DialogFooter>
                                <Button className='bg-blue-600 border-blue-600 text-white hover:bg-blue-600 font-semibold w-12' onClick={()=>{ formClasse.setValue('idProfessor', item.id);}} type='submit' 
                                  ><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
                              </DialogFooter>
                              </form>
                              </Form>
                            </DialogContent>
                              </Dialog>
                                <Dialog >
                                      <DialogTrigger asChild >
                                      <div title='vincular' className={AroundDiv}>
                                      <CombineButton/>
                                      </div>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[425px] bg-white">
                                            <DialogHeader>
                                              <DialogTitle>Vincular Professor(a) {item.nomeCompleto}</DialogTitle>
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
                                    <Button type="submit" title='vincular' className='bg-blue-500 border-blue-500 text-white hover:bg-blue-500 hover:text-white w-12' onClick={()=>{
                                            formConnect.setValue('disciplinas', selectedValues)
                                            formConnect.setValue('nomeDisciplinas', selectedLabels)
                                            formConnect.setValue('idProfessor', item.id);
                                          }}><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
                                  </DialogFooter>
                                  </form></Form>
                                </DialogContent>
                               </Dialog>
                                <Dialog >
                                  <DialogTrigger asChild >
                                  <div title='desvincular' className={AroundDiv}>
                                      <TrashButton/>
                                  </div>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px] bg-white">
                                        <DialogHeader>
                                          <DialogTitle>Desvincular Professor(a) {item.nomeCompleto}</DialogTitle>
                                          <DialogDescription>
                                          Essa secção tem como objectivo desvicular relação já existente entre professores e algumas disciplinas especifícas.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <Form {...formUnConnect} >
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
                                <Button type="submit" title='desvincular' className='bg-red-500 border-red-500 text-white hover:bg-red-500 hover:text-white w-12' onClick={()=>{
                                        formUnConnect.setValue('disciplinas', selectedValues)
                                        formUnConnect.setValue('nomeDisciplinas', selectedLabels)
                                        formUnConnect.setValue('idProfessor', item.id);
                                      }}><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
                              </DialogFooter>
                              </form></Form>
                            </DialogContent>
                            </Dialog>
                              <div  className='relative flex justify-center items-center cursor-pointer'>
                            <Dialog >
                                <DialogTrigger asChild>
                                <div title='ver dados' className={AroundDiv}>
                                  <InfoButton/>
                                </div>

                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] bg-white">
                                <DialogHeader>
                                  <DialogTitle>Informações sobre {item.nomeCompleto}</DialogTitle>
                                  <DialogDescription >
                                  As informações relevantes do professor, são listadas aqui!
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 py-4 bg-white">
                                  <div className="flex flex-col w-full"><fieldset>
                                      <legend className='font-robotoSlab text-sm'>Dados Pessoal</legend>
                                      <div className='w-full flex flex-col space-y-3'>
                                      <div className="w-full flex flex-row justify-between px-2">
                                      <div>
                                          <Label className='font-poppins'>Nome Completo</Label>
                                          <p className='font-thin text-sm'>{item.nomeCompleto}</p>
                                      </div>
                                      <div>
                                            <Label className='font-poppins'>Data de Nasc. </Label>		
                                            <p className='font-thin text-sm'>{item.dataNascimento}</p>
                                      </div>
                                      </div>
                                      <fieldset>
                                      <legend className='font-robotoSlab text-sm'>Contacto</legend>
                                      <div className="w-full flex flex-col justify-between px-2">
                                      <div>
                                          <Label className='font-poppins'>Telefone</Label>	
                                          <p className='font-thin text-sm'>{telefone}</p>
                                      </div>
                                      <div>
                                        {email &&
                                          (<> <Label className='font-poppins'>E-mail</Label>
                                          <p className='font-thin text-sm text-wrap'>{email}</p></>)
                                        }
                                      </div>
                                      </div>
                                      </fieldset>
                                      </div>
                                  </fieldset>
                                  {disciplinaProf.length > 0 && 
                                  <fieldset>
                                      <legend className='font-robotoSlab text-sm'>Disciplinas Curricular</legend>
                                      <div className="w-full flex flex-col justify-between px-2">
                                      <div>
                                          <p className='font-thin text-sm'>{disciplinaProf.map((value)=>{return (
                                          <ol type='A'><li>{value.nome}</li></ol>)})}</p>
                                      </div>
                                      </div>
                                      </fieldset>
                                      }
                                      {classeProf.length > 0 && 
                                      <fieldset>
                                    <legend className='font-robotoSlab text-sm'>Classes Ministradas</legend>
                                    <div className="w-full flex flex-col justify-between px-2">
          <div>
                {classeProf.map((e)=>{
                  return (<>
                  <Label className='font-poppins'>Curso: {e.curso.nome}, {"("+e.nome+" classe);"}
                  </Label>
                  <br/>
                  </>
                  )
                })}
          </div>
                                    </div>
                                    </fieldset>
                                    }
                                  </div>
                                </div>
                                <DialogFooter>
                                </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className='sticky bottom-0 bg-white"'>
                <tr>
                    <td colSpan={4} className="py-2 text-blue-500">
                        Total de registros: {dados.length}
                    </td>
                </tr>
            </tfoot>
            </table>
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
   </section>
 )     
}