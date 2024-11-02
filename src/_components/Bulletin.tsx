import { AlertTriangle, Check, Edit,Save, SaveIcon, Search } from 'lucide-react';
import * as React from 'react';
import { tdStyle, thStyle, trStyle } from './table';
import { idZod } from '@/_zodValidations/validations';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import Header from './Header';
import IPPUImage from './../assets/images/IPPU.png'
import './stepper.css';
import { animateBounce, animateFadeLeft, animatePing, animateShake } from '@/AnimationPackage/Animates';
import MostrarDialog from './MostrarDialog';
import { getTrimestres } from '@/_tanstack/Trimestres';
import { useQueries } from '@tanstack/react-query';
import { getDisciplinasProfessores, getTurmasProfessores } from '@/_tanstack/Professor';
import { getTurmasClasse } from '@/_tanstack/Turmas';

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

   const { watch, formState:{ errors }} = formStepOne;

   const [fieldCursoId, fieldDisciplinaId,  fieldTrimestreId, fieldTurmaId] = watch(["cursoId", "disciplinaId", "trimestreId", "turmaId"])

   const [showDialog, setShowDialog] = React.useState(false);
   const [dialogMessage, setDialogMessage] = React.useState<string | null>(null);

  const handleSubmitNota = async (data: z.infer<typeof TForm>) => {
    await fetch ("http://localhost:8000/api/notas/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((resp => resp.json()))
    .then((resp) =>{ 
      
      if (resp.statusCode != 200) {
        setDialogMessage(resp.message);
        setShowDialog(true);
        buscarAlunos()
      }else{
        setDialogMessage(null);
        setShowDialog(true);
      }
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
      
      if (resp.message != null) {
        setDialogMessage(resp.message);
        setShowDialog(true);
      }else{
        setDialogMessage(null);
        setShowDialog(true);
      }
      buscarAlunos()
    })
    .catch((error) => console.log(`error: ${error}`))
  }

  const [idAno, setIdAno] = React.useState<number>(0);
  React.useEffect(() => {
    const search = async () => {
      const resp = await fetch(`http://localhost:8000/api/ano-lectivos/`);
        const receve = await resp.json()
        var meuarray = receve?.data?.find((c)=>{
          return c?.activo === true
        })
        setIdAno(meuarray?.id)
    };
    search();
  }, []);

  const [{data: trimestres}, {data: cursos}, {data: disciplinas}, {data: turmas}] = useQueries(
    { 
      queries: 
      [
        {queryKey: ["trimestresBulletin"] , queryFn: getTrimestres},
        {queryKey: ["professoresCursosBulletin", 1], queryFn: ()=>getTurmasProfessores(1)},
        {queryKey: ["professoresDisciplinasBulletin", 1], queryFn: ()=>getDisciplinasProfessores(1)},
        {queryKey: ["turmasClasseBulletin", fieldCursoId], queryFn: ()=>getTurmasClasse(fieldCursoId), enabled: !!fieldCursoId},
      ]
    }
  )

  const [nomeDisciplina, setNomeDisciplina] = React.useState<string>('');  
  const selecionarDisciplina = (e) =>{
    setNomeDisciplina(e.target.options[e.target.selectedIndex].text);
  }

  type ruleDados = {
    id: number;
    nomeCompleto: string;
    estado: string;
    condicao: string;
    disciplina: string;
  };
  
  const [dados, setDados] = React.useState<ruleDados[]>([]);
  async function buscarAlunos(){
    
    const URLClasse = `http://localhost:8000/api/classes/${fieldCursoId}/alunos?turmaId=${fieldTurmaId}`;
  
    const responseClasse = await fetch(URLClasse);
    const responseJsonClasse = await responseClasse.json();
    
    const newData = await Promise.all(
      responseJsonClasse?.data?.map(async (item) => {
        const URL = `http://localhost:8000/api/alunos/${item.id}/notas?trimestreId=${fieldTrimestreId}&classeId=${fieldCursoId}`;
        const response = await fetch(URL);
        const responseJson = await response.json();
        
        const exite = responseJson?.data?.find(item=>{
          return item?.disciplina === nomeDisciplina
        })
        let estado = exite?.disciplina ? exite?.nota + 'V'  : 'indefinido';
        let condicao = exite?.disciplina !== null
          ? (exite?.nota > 9 ? 'positiva' : 'negativa')
          : 'negativa';

        let disciplina = exite?.disciplina ?  exite?.disciplina : 'Inválido';
      
        return { ...item, estado, condicao, disciplina };
      
      })
    );
    if (newData?.length === 0){
     const newData = await Promise.all(
        responseJsonClasse?.data?.map(async (item) => {
          let estado = 'indefinido';
          let condicao = 'negativa';
          let disciplina = 'Inválido';
          return { ...item, estado, condicao, disciplina };
        }))
        setDados(newData); 
    }else{
      setDados(newData); 
    }
    console.log(dados)
    
  };
  
  React.useEffect(()=>{buscarAlunos()},[fieldTurmaId, fieldCursoId, fieldDisciplinaId])

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
                      }}>
                        <option >Selecione o trimestre</option>
                        {
                        trimestres?.data?.data?.map((field)=>{
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
                            
                        disciplinas?.data?.data?.map((field)=>{
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
                       
                      }}>
                        <option >Selecione a classe</option>
                        {
                        cursos?.data?.data?.map((field)=>{
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
                    }}
                    className={
                      errors.turmaId?.message && `${animateShake} select-error`}
                     >
                        <option >Selecione a turma</option>
                        {
                            
                        turmas?.data?.data?.map((field)=>{
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
                        if (dados?.length > 0)
                        {
                        currentStep === step.length ?
                        setComplete(true) :
                        setCurrentStep(prev => prev + 1);
                        }else{
                          setDialogMessage("A Turma Selecionada Não Possui Alunos Cadastrados");
                          setShowDialog(true);           
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
                <th className={thStyle}>Id</th>
                <th className={thStyle}>Nome</th>
                <th className={thStyle}>Disciplina</th>
                <th className={thStyle}>Nota</th>
                <th className={thStyle}>Acção</th>
            </tr>
          </thead>
          <tbody>
            {dados?.length === 0 ? (
              <tr className='w-96 h-32'>
                <td rowSpan={4} colSpan={4} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                  <div>
                    <AlertTriangle className="animate-bounce animate-infinite animate-duration-[550ms] animate-delay-[400ms] animate-ease-out inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12"/>
                    <p>Nenhum Registro Foi Encontrado</p>
                  </div>
                </td>
              </tr>
            ) : dados?.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
               
                <td className={tdStyle}>{item.id}</td>
                <td className={tdStyle}>{item.nomeCompleto}</td>
                <td className={tdStyle}>{item.disciplina}</td>
                {item.estado === 'indefinido' ?
                <td>{item.estado}</td> :
                item.condicao === 'positiva' ? 
                <td className='text-green-500'>{item.estado}</td> :
                <td className='text-red-500'>{item.estado}</td>
                }
                
                <td className={tdStyle} >
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
                form.setValue('classeId', fieldCursoId);
                form.setValue('trimestreId', fieldTrimestreId);
                form.setValue('disciplinaId', fieldDisciplinaId);
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
                                Actualiza aqui a nota do boletim.<br/>
                                <span className='text-xs'>
                                 <span className='text-red-500 font-medium'>Nota:</span> Tome atenção nos filtros selecionados, trimestre, disciplina e classe.</span>
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
                            formUpdate.setValue('classeId', fieldCursoId);
                            formUpdate.setValue('trimestreId', fieldTrimestreId);
                            formUpdate.setValue('disciplinaId', fieldDisciplinaId);
                          }}><SaveIcon className='w-5 h-5 absolute text-white font-extrabold'/></Button>
                  </DialogFooter>
                  </form></Form>
                </DialogContent>
                  </Dialog>
                  }
                    </div>
                  </td>
              </tr>
            ))}
          </tbody>
          <tfoot className='sticky bottom-0 bg-white'>
            <tr>
              <td colSpan={5} className="py-2 text-blue-500">
                Total de registros: {dados?.length}
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
       <MostrarDialog show={showDialog} message={dialogMessage} onClose={() => setShowDialog(false)} />
    </>
  );
}
