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
import { AlertCircleIcon, CheckCircleIcon, FolderOpenIcon, SaveIcon} from 'lucide-react'
import DataTable from 'react-data-table-component'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { dataNascimentoZod, emailZod, nomeCompletoZod, telefoneZod, disciplinas, idZod } from '@/_zodValidations/validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Select from 'react-select';
import { MyDialog, MyDialogContent } from './my_dialog'
import InputMask from 'react-input-mask'
import { AroundDiv, CombineButton, EditButton, InfoButton, LibraryButton, TrashButton, UserPlusButton } from './MyButton'

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
      }
const handleSubmitUnConnect = async (data: z.infer<typeof TFormUnConnect>,e) => {
        /*desvincular professor à disciplina*/       
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
     }

     /*Área q implementa o código pra pesquisar cursos*/
const [ano, setAno] = React.useState();
const [turma, setTurma] = React.useState([]);
const [idClasse, setIdClasse] = React.useState(0);
const [grade, setGrade] = React.useState([]);
const [dataApiCursos, setDataApiCursos] = React.useState([]);

const URLCURSO = `http://localhost:8000/api/ano-lectivos/${ano}/
classes`;
const URLLECTIVO = "http://localhost:8000/api/ano-lectivos"
const URLTURMA = `http://localhost:8000/api/classes/${idClasse}/turmas`
React.useEffect( () => {
  const respFetchCursos = async () => {
      //Buscar Ano Lectivos
      const resplectivo = await fetch (URLLECTIVO);
      const resplectivoJson = await resplectivo.json();
      const convlectivo1 = JSON.stringify(resplectivoJson.data)
      const convlectivo2 = JSON.parse(convlectivo1)
      var meuarray = convlectivo2.filter((c)=>{
        return c.activo === true
      })
      setAno(meuarray[parseInt(String(Object.keys(meuarray)))].id);

      const resp = await fetch (URLCURSO);
      const respJson = await resp.json();
      const conv1 = JSON.stringify(respJson.data);
      const conv2 = JSON.parse(conv1);
      let nArray = Object.values(conv2.cursos)
      setDataApiCursos(nArray);
      
      //Buscar Turmas
      if (idClasse > 0)
      {
        const respturma = await fetch (URLTURMA);
        const respturmaJson = await respturma.json();
        const convturma1 = JSON.stringify(respturmaJson.data)
        const convturma2 = JSON.parse(convturma1)
        setTurma(convturma2)
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
              formClasse.setValue('idProfessor', row.id)
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
      <div title='actualizar' className={AroundDiv} >
        <EditButton/>
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
      <DialogFooter>
        <Button title='actualizar' className='bg-green-500 border-green-500 text-white hover:bg-green-500 w-12' type='submit'><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
      </DialogFooter>
      </form></Form>
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
                  <DialogTitle>Vincular Professor(a) {row.nomeCompleto}</DialogTitle>
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
                formConnect.setValue('idProfessor', row.id);
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
                  <DialogTitle>Desvincular Professor(a) {row.nomeCompleto}</DialogTitle>
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
                formUnConnect.setValue('idProfessor', row.id);
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
        <DialogTitle>Informações sobre {row.nomeCompleto}</DialogTitle>
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
                <p className='font-thin text-sm'>{row.nomeCompleto}</p>
            </div>
            <div>
                 <Label className='font-poppins'>Data de Nasc. </Label>		
                  <p className='font-thin text-sm'>{row.dataNascimento}</p>
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
        <fieldset>
            <legend className='font-robotoSlab text-sm'>Disciplinas Curricular</legend>
            <div className="w-full flex flex-col justify-between px-2">
            <div>
                <p className='font-thin text-sm'>{disciplinaProf.map((value)=>{return (
                <ol type='A'><li>{value.nome}</li></ol>)})}</p>
            </div>
            </div>
            </fieldset>
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
        </div>
      </div>
      <DialogFooter>
      </DialogFooter>
    </DialogContent>
  </Dialog>

           </div>
            
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
    fixedHeaderScrollHeight='300px'
    pagination
    onSort={handleSort}
    subHeader
   subHeaderComponent={ 
       <div className='flex flex-row space-x-2'><input className=' rounded-sm border-2 border-gray-400 placeholder:text-gray-400 placeholder:font-bold outline-none py-1 indent-2' type='text' placeholder='Pesquisar aqui...' onChange={handleFilter}/>
      <Dialog >
    <DialogTrigger asChild >
    <div title='Add classes' className={AroundDiv} >
        <LibraryButton/>
    </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[685px] overflow-y-scroll h-[640px] bg-white">
      <DialogHeader>
        <DialogTitle>Inserir na Classe</DialogTitle>
        <DialogDescription>
        <p>Adiciona as classes que um professor lecionará no ano acádemico corrente.
        </p>
        </DialogDescription>
      </DialogHeader>
     
      <Form {...formClasse} >
     <form onSubmit={formClasse.handleSubmit(handleSubmitClasse)} >
     <fieldset>
            <legend className='bg-blue-600 w-full h-9 pl-2 mr-2 text-white flex items-center'><p>Informações Essenciais</p></legend>
            <div className='flex flex-col space-y-3 mb-5'>
                <div className='flex flex-col'>
                <FormLabel>Cursos*</FormLabel>
                    <select className='w-full py-3 rounded-sm ring-1 ring-gray-300 bg-white text-gray-500 pl-3' onChange={handleGrade}>
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
                        <FormLabel>Classes*</FormLabel>
                        <FormControl>
                          <select {...field} className='w-full py-3 rounded-sm ring-1 ring-gray-300 bg-white text-gray-500 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))
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
                        <FormLabel>Turmas*</FormLabel>
                        <FormControl>
                        <select {...field} className='w-full py-3 rounded-sm ring-1 ring-gray-300 bg-white text-gray-500 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
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
                    <div className='w-full'>
              <Label htmlFor="id" className="text-right">
                ID do Professor
              </Label>
            
                <FormField
              control={formClasse.control}
              name="idProfessor"
              render={({field})=>(
                <FormControl>
                <FormItem>
              <Input id="id" type='number' {...field} className="w-full" min={0} onChange={(e)=>{
                formClasse.setValue('idProfessor', parseInt(e.target.value))
                field.onChange(parseInt( e.target.value))}}/>
              <FormMessage className='text-red-500 text-xs'/>
              </FormItem>
              </FormControl>
            )}/>
            </div>
                    <div className="w-full">
                    <FormField
              control={formClasse.control}
              name="disciplinaId"
              render={({field})=>(
              <FormItem>
                <Label htmlFor="disciplina" className="text-right">
                Disciplinas Curricular
              </Label>
                  <FormControl>
                  <FormControl>
                        <select {...field} className='w-full py-3 rounded-sm ring-1 ring-gray-300 bg-white text-gray-500 pl-3' onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
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
                </fieldset>
      
      <DialogFooter>
        <Button className='bg-blue-600 border-blue-600 text-white hover:bg-blue-600 font-semibold w-12' type='submit' 
          ><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
      </DialogFooter>
      </form>
      </Form>
    </DialogContent>
  </Dialog>

       <Dialog >
    <DialogTrigger asChild>
    <div title='cadastrar' className={AroundDiv}>
      <UserPlusButton/>
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
      <div className='relative flex justify-center items-center' >
      <Button className='bg-blue-500 border-blue-500 text-white hover:bg-blue-500 font-semibold w-12' title='cadastrar' onClick={()=>{form.setValue('disciplinas', selectedValues)}}type='submit'><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
      </div>
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