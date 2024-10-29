import { AlertCircleIcon, AlertTriangle, Check, CheckCircleIcon, Edit, InfoIcon, Save, SaveIcon, Search } from 'lucide-react';
import * as React from 'react';
import { tdStyle, thStyle, trStyle } from './table';
import { idZod } from '@/_zodValidations/validations';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MyDialog, MyDialogContent } from './my_dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import Header from './Header';
import IPPUImage from './../assets/images/IPPU.png'
import './stepper.css';
import { animateBounce, animateFadeLeft, animatePing, animateShake } from '@/AnimationPackage/Animates';

const TForm = z.object({
  alunoId: idZod,
  classeId: idZod,
  disciplinaId: idZod,
  trimestreId: idZod,
  nota: z.number(),
});

const TFormUpdate = z.object({
  alunoId: idZod,
  classeId: idZod,
  disciplinaId: idZod,
  trimestreId: idZod,
  nota: z.number(),
});

const TFormStepOne = z.object({
  cursoId: idZod,
  classeId: idZod,
  disciplinaId: idZod,
  trimestreId: idZod,
  turmaId: idZod
})


export default function Bulletin() {
  
  const form  = useForm<z.infer<typeof TForm>>({
    mode: 'all', 
    resolver: zodResolver(TForm)
   })

   const formUpdate  = useForm<z.infer<typeof TFormUpdate>>({
    mode: 'all', 
    resolver: zodResolver(TFormUpdate)
   })

   const formStepOne = useForm<z.infer<typeof TFormStepOne>>({
    mode: 'all', 
    resolver: zodResolver(TFormStepOne)
   })

   const {control, watch, formState:{ errors, isValid }, register} = formStepOne;

   const [fieldCursoId, fieldDisciplinaId, fieldClasseId, fieldTrimestreId, fieldTurmaId] = watch(["cursoId", "disciplinaId","classeId", "trimestreId", "turmaId"])

   const [showModal, setShowModal] = React.useState(false);
   const [modalMessage, setModalMessage] = React.useState('');  

  const handleSubmitNota = async (data: z.infer<typeof TForm>) => {
    await fetch ("http://localhost:8000/api/notas/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((resp => resp.json()))
    .then((resp) =>{ 
      setShowModal(true);
      if (resp.statusCode != 200) {
        setModalMessage(resp.message);  
      }else{
        setModalMessage(null);
      }
      console.log(resp)
    })
    .catch((error) => console.log(`error: ${error}`))
  }

  const handleSubmitNotaUpdate = async (data: z.infer<typeof TFormUpdate>) => {
    const dados = {
      classeId: data.classeId,
      disciplinaId: data.disciplinaId,
      trimestreId: data.trimestreId,
      nota: data.nota}
    await fetch (`http://localhost:8000/api/alunos/${data.alunoId}/notas`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    }).then((resp => resp.json()))
    .then((resp) =>{ 
      setShowModal(true);
      if (resp.message != null) {
        setModalMessage(resp.message);  
      }else{
        setModalMessage(null);
      }
      console.log(resp)
    })
    .catch((error) => console.log(`error: ${error}`))
  }

  const [cursos, setCursos] = React.useState([]);
  const [disciplinas, setDisciplinas] = React.useState([]);
  
  const [trimestres , setTrimestres] = React.useState([]);
  const [disciplinaId, setDisciplinaId] = React.useState(null);
  const [trimestreId, setTrimestreId] = React.useState(null);
  
  
  const [idAno, setIdAno] = React.useState<number>(0);
  const columnsClasse = ['Id', 'Nome', 'Nota', 'Acção'];
  React.useEffect(() => {
    const search = async () => {
      const URL = "http://localhost:8000/api/professores/48/classes";
      const response = await fetch(URL);
      const responseJson = await response.json();
      setCursos(responseJson.data);

      const URLDISC = "http://localhost:8000/api/professores/48/disciplinas";
      const responseDisc = await fetch(URLDISC);
      const responseDiscJson = await responseDisc.json();
      setDisciplinas(responseDiscJson.data);

      const URLTRIMESTRES = "http://localhost:8000/api/trimestres/";
      const responseTrimestres = await fetch(URLTRIMESTRES);
      const responseTrimestresJson = await responseTrimestres.json();
      setTrimestres(responseTrimestresJson.data);

      const resp = await fetch(`http://localhost:8000/api/ano-lectivos/`);
        const receve = await resp.json()
        var meuarray = receve.data.find((c)=>{
          return c.activo === true
        })
        setIdAno(meuarray.id)
    };
    search();
  }, []);


  
  const [classes, setClasses] = React.useState([]);
  const [turmas, setTurmas] = React.useState([]);
  const buscarClasses = async (id) => {
    const URL = `http://localhost:8000/api/cursos/${id}/classes`;
    const response = await fetch(URL);
    const responseJson = await response.json();
    setClasses(responseJson.data);
    
  }

  const [nomeDisciplina, setNomeDisciplina] = React.useState<string>('');  
  const selecionarDisciplina = (e) =>{
    setDisciplinaId(parseInt(e.target.value, 10) || 0)
    
    setNomeDisciplina(e.target.options[e.target.selectedIndex].text);
  }

  let [classeId, setClasseId] = React.useState(null);
  const buscarTurmas = async (id) => {
    setClasseId(id);
    const URL = `http://localhost:8000/api/classes/${id}/turmas`;

    const response = await fetch(URL);
    const responseJson = await response.json();
    setTurmas(responseJson.data)
  }

  type ruleDados = {
    id: number;
    nomeCompleto: string;
    estado: string;
  };
  
  const [dados, setDados] = React.useState<ruleDados[]>([]);
  
  const buscarAlunos = async (id) => {
    
    const URLClasse = `http://localhost:8000/api/classes/${classeId}/alunos?turmaId=${id}`;
  
    const responseClasse = await fetch(URLClasse);
    const responseJsonClasse = await responseClasse.json();
  
    const newData = await Promise.all(
      responseJsonClasse.data.map(async (item) => {
        const URL = `http://localhost:8000/api/alunos/${item.id}/notas?trimestreId=${trimestreId}&classeId=${classeId}`;
        
        const response = await fetch(URL);
        const responseJson = await response.json();
        
        
        const estado = responseJson.data && responseJson.data.length > 0
          ? (responseJson.data[0].disciplina === nomeDisciplina ? responseJson.data[0].nota + 'V'  : 'indefinido')
          : 'indefinido';
  
        return { ...item, estado };
      })
    );
    setDados(newData); 
   
  };
  
 

const [buscarNotas, setBuscarNotas] = React.useState([]);
const clickBuscarNotas = async (idAluno) => {
    const URL = `http://localhost:8000/api/alunos/${idAluno}/notas?trimestreId=${trimestreId}&classeId=${classeId}`;
    const response = await fetch(URL);
    const responseJson = await response.json();
    setBuscarNotas(responseJson.data);
  };

  
 /*
 const handleFilterClasse = (event) => {
    const valores = dados.filter((element) =>{ return (element.nomeCompleto.toLowerCase().includes(event.target.value.toLowerCase().trim())) });
    setDados(valores)
}*/
    const step = ['Filtrar Turmas', 'Inserir Nota'];
    const[ currentStep, setCurrentStep ] = React.useState<number>(1);
    const[ complete, setComplete ] = React.useState<boolean>(false);

  return (<>
      
    { idAno == 0 ? <div className='w-screen min-h-screen bg-scroll bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300 flex items-center justify-center'>
      <div className='w-full text-center text-4xl text-red-600 md:text-2xl lg:text-2xl'>
          <div >
          <AlertTriangle className={`${animateBounce} inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12`}/>
              <p className='text-red-500'>SELECIONE O ANO LECTIVO</p>
              <p className='text-red-500 italic font-semibold text-sm cursor-pointer'><Link to={'/AcademicYearPage'}>Selecionar agora</Link></p>
          </div>
      </div>
        </div> : (
      <section className="m-0 w-screen h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300  grid-flow-col grid-cols-3">
         <Header title={false}/> 
         <div className='flex flex-col space-y-2 justify-center items-center w-full'>
         <div className='flex justify-center items-center text-sm'>
            <div className='flex justify-between'>{
            step?.map((step, i) => 
                (
                    <div key={i} className={`step-item ${currentStep === i + 1 ? 'active' : '' } ${ (i + 1 < currentStep || complete) && 'complete'}`}>
                        <div className='step'>{ 
                        (i + 1 < currentStep || complete) ?
                        <Check/> : i + 1 }</div>
                        <p className='text-gray-500 text-base sm:text-xs md:text-[14px] lg:text-[16px] xl:text-lg'>{step}</p>
                    </div>
                    
                )
                )}
              </div>
            </div>
            {currentStep === 1 && ( <div className={`${animateFadeLeft} max-w-md sm:w-[260px] md:w-[300px] lg:w-[380px] xl:w-[400px] p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8`}>
            <Form {...formStepOne} >
        <form >
                <div className="space-y-3 -m-2 -mt-6 -mb-4 sm:max-w-[425px]">
                    <div className='flex justify-between -mb-6'>
                      <h1></h1>
                      <img src={IPPUImage} className="h-20 w-20" alt="Ulumbo Logo" />
                    </div>
                    <div >
                        <FormField
                     control={formStepOne.control}
                    name='trimestreId'
                    render={({field})=>(
                    <FormItem>
                         <label>Trimestres<span className='text-red-500'>*</span></label>
                        <FormControl>
                    <select {...field}
                    className={
                      errors.trimestreId?.message && `${animateShake} select-error`}
                      onChange={(e)=>{field.onChange(parseInt(e.target.value))
                        setTrimestreId(parseInt(e.target.value, 10) || 0)
                      }}>
                        <option >Selecione o trimestre</option>
                        {
                        trimestres.map((field)=>{
                            return (<option value={`${field.id}`}>{field.numero}° Trimestre</option>
                            )
                        })
                                    
                        }
                    </select>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>)
                    }
                    />
                        </div>
                        <div>
                    <FormField
                     control={formStepOne.control}
                    name='disciplinaId'
                    render={({field})=>(
                    <FormItem>
                         <label >Disciplinas<span className='text-red-500'>*</span></label>
                        <FormControl>
                    <select {...field}
                   onChange={(e)=>{field.onChange(parseInt(e.target.value))
                    selecionarDisciplina(e)
                  }}
                    className={
                      errors.disciplinaId?.message && `${animateShake} select-error`}>
                        <option >Selecione a disciplina</option>
                        {
                            
                        disciplinas.map((field)=>{
                            return (<option value={`${field.id}`}>{field.nome}
                            </option>
                            )
                        })
                                    
                        }
                    </select>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>)
                    }
                    />
                        </div>
                    <div>
                     <FormField
                     control={formStepOne.control}
                    name='cursoId'
                    render={({field})=>(
                    <FormItem>
                         <label >Classes<span className='text-red-500'>*</span></label>
                        <FormControl>
                    <select {...field}
                
                    className={
                      errors.cursoId?.message && `${animateShake} select-error`} 
                      onChange={(e)=>{field.onChange(parseInt(e.target.value))
                        buscarTurmas(e.target.value)
                      }}>
                        {
                        cursos.map((field)=>{
                            return (<option value={`${field.id}`}>{field.nome} Classe ({field.curso.nome})
                            </option>
                            )
                        })
                                    
                        }
                    </select>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>)
                    }
                    />
                    </div>
                    <div>
                        <FormField
                     control={formStepOne.control}
                    name='turmaId'
                    render={({field})=>(
                    <FormItem>
                         <label >Turmas<span className='text-red-500'>*</span></label>
                        <FormControl>
                    <select {...field}
                    onChange={(e)=>{field.onChange(parseInt(e.target.value))
                    buscarAlunos(e.target.value)
                    }}
                    className={
                      errors.turmaId?.message && `${animateShake} select-error`}
                     >
                        <option >Selecione a turma</option>
                        {
                            
                        turmas.map((field)=>{
                            return (<option value={`${field.id}`}>{field.nome}
                            </option>
                            )
                        })
                                    
                        }
                    </select>
                        </FormControl>
                        <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>)
                    }
                    />
                        </div>
                      <button type='button' onClick={()=>{
                      const isStep1Valid = !errors.cursoId && !errors.disciplinaId && !errors.trimestreId && !errors.turmaId && fieldCursoId && fieldDisciplinaId && fieldTrimestreId && fieldTurmaId;
                      if (isStep1Valid) {
                        if (dados.length > 0)
                        {
                        currentStep === step.length ?
                        setComplete(true) :
                        setCurrentStep(prev => prev + 1);
                        }else{
                          setShowModal(true);
                          setModalMessage("A Turma Selecionada Não Possui Alunos Cadastrados")
                        }
                      }else{setCurrentStep(1)}
                      
                      }} className='active:animate-ping animate-once animate-duration-500 animate-delay-400 animate-ease-out bg-sky-700 hover:bg-sky-600 text-base sm:text-sm md:text-[10px] lg:text-[12px] xl:text-[16px] text-white font-semibold px-3 py-1 sm:py-[2px] lg:py-1 xl:py-2 border-sky-700'>Próximo</button>
                </div>
                </form>
                </Form>
            </div>)}
            {currentStep === 2 && (
          <div className="animate-fade-left animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-in flex flex-col space-y-2 justify-center w-[90%] z-10">
         <div className='relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96 mb-4'>
         <Search className='absolute text-gray-300 w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7'/>            
         <Input className=' pl-6 indent-2' type='text' placeholder='Procure por registros...' />
     </div><div className='overflow-x-auto overflow-y-auto w-full  h-80 md:h-1/2 lg:h-[500px]'>
          <table className="w-full bg-white border border-gray-200 table-fixed">
          <thead className='sticky top-0 z-10'>
            <tr className={trStyle}>
              {columnsClasse.map((element, index) => (
                <th key={index} className={thStyle}>{element}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dados.length === 0 ? (
              <tr className='w-96 h-32'>
                <td rowSpan={4} colSpan={4} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                  <div>
                    <AlertTriangle className="animate-bounce animate-infinite animate-duration-[550ms] animate-delay-[400ms] animate-ease-out inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12"/>
                    <p>Nenhum Registro Foi Encontrado</p>
                  </div>
                </td>
              </tr>
            ) : dados.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
               
                <td className={tdStyle}>{item.id}</td>
                <td className={tdStyle}>{item.nomeCompleto}</td>
                <td>{item.estado}</td>
                <td className={tdStyle} onClick={()=>{clickBuscarNotas(item.id)}}>
                  <div className='flex flex-row space-x-2'>
                  {item.estado === 'indefinido' ?
                  <Dialog>
            <DialogTrigger asChild >
            <div title='vincular' className='relative flex justify-center items-center'>
            <Save className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
            <button className='h-7 px-5 bg-green-600 text-white font-semibold hover:bg-green-600 border-green-600 rounded-sm' ></button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                  <DialogHeader>
                    <DialogTitle>Adicionar nota ao {item.nomeCompleto}</DialogTitle>
                    <DialogDescription>
                    Essa secção tem como objectivo atribuir uma nota trimestral ao aluno.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitNota)} >
                <div className="flex flex-col w-full py-4 bg-white">              
                <div className="w-full">
               
                
                <FormField
                            control={form.control}
                            name='nota'
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Nota*</FormLabel>
                                <FormControl>
                      <Input className='border-2 rounded-md font-mono' type="number" {...field} onChange={(e)=>{ field.onChange(parseFloat(e.target.value))}} min={0} max={20} step={0.01}  />
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
          <Button type="submit" title='vincular' className='bg-blue-500 border-blue-500 text-white hover:bg-blue-500 hover:text-white w-12'  onClick={()=>{form.setValue('alunoId', item.id);
                form.setValue('classeId', parseInt(classeId));
                form.setValue('trimestreId', parseInt(trimestreId));
                form.setValue('disciplinaId', parseInt(disciplinaId));
                }}><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
        </DialogFooter>
        </form>
        </Form>
      </DialogContent>
                  </Dialog>
                  :
                  <Dialog>
                      <DialogTrigger asChild >
                      <div title='vincular' className='relative flex justify-center items-center'>
                      <Edit className='w-5 h-4 absolute text-white font-extrabold cursor-pointer'/>
                        <Button className='h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm border-blue-600'></Button>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-white">
                            <DialogHeader>
                              <DialogTitle>Actualizar Nota {item.nomeCompleto}</DialogTitle>
                              <DialogDescription>
                                Actualiza aqui a nota do boletim.
                                <span className='text-xs'>Nota: Tome atenção nos filtros selecionados, trimestre, disciplina e classe.</span>
                              </DialogDescription>
                            </DialogHeader>
                            <Form {...formUpdate} >
                          <form onSubmit={formUpdate.handleSubmit(handleSubmitNotaUpdate)
                          
                          } >
                         <FormField
                      control={formUpdate.control}
                      name="nota"
                      render={({field})=>(
                      <FormItem>
                      <FormControl>
                      <Input className='border-2 rounded-md font-mono' type="number" {...field} onChange={(e)=>{ field.onChange(parseFloat(e.target.value))}} min={0} max={20} step={0.01}  />
                    </FormControl>
                    <FormMessage className='text-red-500 text-xs'/>
                    </FormItem>
                        )}
                          />
                  <DialogFooter>
                    <Button title='vincular' type="submit" className='bg-blue-500 border-blue-500 text-white hover:bg-blue-500 hover:text-white w-12'  onClick={()=>{
                            formUpdate.setValue('alunoId', item.id);
                            formUpdate.setValue('classeId', parseInt(classeId));
                            formUpdate.setValue('trimestreId', parseInt(trimestreId));
                            formUpdate.setValue('disciplinaId', parseInt(disciplinaId));
                          }}><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
                  </DialogFooter>
                  </form></Form>
                </DialogContent>
                  </Dialog>
                  }
                  <Dialog >
              <DialogTrigger asChild>
              <div title='ver dados' className='relative flex justify-center items-center'>
              <InfoIcon className='w-5 h-4 absolute text-white font-extrabold'/>
                <button className='h-7 px-5 bg-green-600 text-white font-semibold hover:bg-green-600 rounded-sm border-green-600' ></button>
                </div>
                
              </DialogTrigger>
              <DialogContent className="h-[470px] w-[325px] overflow-y-auto bg-white">
                <DialogHeader>
                  <DialogTitle>Informações sobre {item.nomeCompleto}</DialogTitle>
                  <DialogDescription >
                  As informações sobre as notas do aluno são listadas aqui!
                  </DialogDescription>
                </DialogHeader>
                {buscarNotas.length > 0 && (buscarNotas.map((item, index) => (
                  <ul key={index}>
                    <li><span className='font-semibold'>Trimestre: </span>{item.trimestre}</li>
                    <li><span className='font-semibold'>Disciplina: </span>{item.disciplina}</li>
                    <li><span className='font-semibold'>Nota: </span>{item.nota}</li>
                  </ul>
                )))}
                {buscarNotas.length === 0 && (
                  <div className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                  <div>
                    <AlertTriangle className="animate-bounce animate-infinite animate-duration-[550ms] animate-delay-[400ms] animate-ease-out inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12"/>
                    <p>Nenhuma Nota Registrada</p>
                  </div>
                </div>
                )}
                
                <DialogFooter>
                </DialogFooter>
              </DialogContent>
                  </Dialog>
                    </div>
                  </td>
              </tr>
            ))}
          </tbody>
          <tfoot className='sticky bottom-0 bg-white'>
            <tr>
              <td colSpan={4} className="py-2 text-blue-500">
                Total de registros: {dados.length}
              </td>
            </tr>
          </tfoot>
        </table>
        {currentStep > 1 && 
    <button type='button' onClick={()=>{
        currentStep === step.length && setComplete(false);
        
        currentStep > 1 && setCurrentStep(prev => prev - 1);
    }} className={`${animatePing} responsive-button bg-gray-700 hover:bg-gray-600 text-white font-semibold border-gray-700`}>Voltar</button>
    }
        </div>
        
        </div> )}
        <div className='w-full flex items-center justify-between'>
        </div>
       </div>   
        </section>
       
      )}
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

    </>
  );
}
