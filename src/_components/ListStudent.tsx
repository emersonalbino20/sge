import { AlertTriangle, Check, EditIcon, FolderOpenIcon, InfoIcon, SaveIcon, Search } from 'lucide-react';
import * as React from 'react';
import { tdStyle, thStyle, trStyle } from './table';
import { bairroZod, dataNascimentoZod, emailZod, generoZod, idZod, nomeCompletoZod, ruaZod, telefoneZod } from '@/_zodValidations/validations';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import Header from './Header';
import IPPUImage from './../assets/images/IPPU.png'
import './stepper.css';
import { animateBounce, animateFadeLeft, animatePing, animateShake } from '@/AnimationPackage/Animates';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCursos } from '@/_tanstack/Cursos';
import { getClassesId } from '@/_tanstack/Classes';
import { getTurmasId } from '@/_tanstack/Turmas';
import { getTrimestres } from '@/_tanstack/Trimestres';
import { collectErrorMessages, confirmacaoAluno, getAlunosClassesMatriculasCurso, getAlunosId, getAlunosMatriculas, getAlunosNotas, getAlunosPorTurma, putAlunos } from '@/_tanstack/Alunos';
import { getPagamentos } from '@/_tanstack/Pagamentos';
import { getTurnos } from '@/_tanstack/Turnos';
import { useHookFormMask } from 'use-mask-input'
import axios from 'axios';
import { setCookies } from '@/_cookies/Cookies';
import MostrarDialog from './MostrarDialog';

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

const TFormConfirmacao =  z.object({
  classeId: idZod,
  turmaId: idZod,
  turnoId: idZod,
  metodoPagamentoId: idZod,
  id: z.number()
})

const TFormStepOne = z.object({
  cursoId: idZod,
  classeId: idZod,
  disciplinaId: idZod,
  trimestreId: idZod,
  turmaId: idZod
})


export default function ListStudent() {
   const formStepOne = useForm<z.infer<typeof TFormStepOne>>({
    mode: 'all', 
    resolver: zodResolver(TFormStepOne)
   })
   const { watch, formState:{ errors } } = formStepOne;
   
   const form  = useForm<z.infer<typeof TForm>>({
    mode: 'all', 
    resolver: zodResolver(TForm)
   })

  const upWithMask = useHookFormMask(form.register)
  const queryClient = useQueryClient();
  const {data: alunosTurma} = useQuery({ queryKey: ["alunosTurmaId", formStepOne.getValues('classeId'), formStepOne.getValues('turmaId')] , queryFn: ()=>getAlunosPorTurma(formStepOne.getValues('classeId'), formStepOne.getValues('turmaId')), enabled: !!formStepOne.getValues('classeId')
  });

  const [showDialog, setShowDialog] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState<string | null>(null);
  
  const formConfirmacao  = useForm<z.infer<typeof TFormConfirmacao>>({
    mode: 'all', 
    resolver: zodResolver(TFormConfirmacao),
   })
   const fieldClassesAluno = formConfirmacao.watch('classeId');
   
   const {mutate: postMutationConfirmacaoAlunos} = useMutation({
    mutationFn: confirmacaoAluno,
    onSuccess: (response) => {
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    
    window.open(url, '_blank');
    



      queryClient.invalidateQueries({queryKey: ["alunosTurmaId", formStepOne.getValues('classeId'), formStepOne.getValues('turmaId')]});
    },
    onError: (error) => {
      
      if(axios.isAxiosError(error)){
      if (error.response && error.response.data) {
       
        
        setDialogMessage("Matricula Já existe");
        setShowDialog(true);
       }
      }}
  });

   const handleSubmitCreateConfirmacao = async (data: z.infer<typeof TFormConfirmacao>,e) => {
    e.preventDefault();
    postMutationConfirmacaoAlunos(data)
   }

   const {mutate: putMutationAlunos} = useMutation({
    mutationFn: putAlunos,
    onSuccess: () => {
     
      queryClient.invalidateQueries({queryKey: ["alunosTurmaId", formStepOne.getValues('classeId'), formStepOne.getValues('turmaId')]});
      setDialogMessage(null);
      setShowDialog(true); 
    },
    onError: (error) => {
      if(axios.isAxiosError(error)){
      if (error.response && error.response.data) {
        const err = error.response.data?.errors;
        const errorMessages = collectErrorMessages(err);
        
        setDialogMessage(errorMessages[0]);
        setShowDialog(true);
       }
      }}
  });

   const handleSubmitUpdate = async (data: z.infer<typeof TForm>,e) => {
    e.preventDefault();
    putMutationAlunos(data);
  }

   const [fieldCursoId, fieldClasseId, fieldTrimestreId, fieldTurmaId] = watch(["cursoId", "classeId", "trimestreId", "turmaId"])

   


  const { data: trimestres } = useQuery({ queryKey: ["trimestres"] , queryFn: ()=>getTrimestres(),
    });

  const { data: cursos } = useQuery({ queryKey: ["cursos"] , queryFn: ()=>getCursos(),
    });
  
  const { data: pagamentos } = useQuery({ queryKey: ["pagamentos"] , queryFn: ()=>getPagamentos(),
  });

  const { data: turnos } = useQuery({ queryKey: ["turnos"] , queryFn: ()=>getTurnos(),
  });

  const {data: classes} = useQuery({ queryKey: ["classesId", formStepOne.getValues('cursoId')] , queryFn: ()=>getClassesId(formStepOne.getValues('cursoId')), enabled: !!formStepOne.getValues('cursoId')
  });
    
  const {data: turmas} = useQuery({ queryKey: ["turmaId", formStepOne.getValues('classeId')] , queryFn: ()=>getTurmasId(formStepOne.getValues('classeId')), enabled: !!formStepOne.getValues('classeId')
  });

  const [alunoId, setAlunoId] = React.useState<number>(null);
  const {data: alunosNotas} = useQuery({ queryKey: ["alunosNotasId", alunoId, formStepOne.getValues('trimestreId'), formStepOne.getValues('classeId')] , queryFn: ()=>getAlunosNotas(alunoId, formStepOne.getValues('trimestreId'), formStepOne.getValues('classeId')), enabled: !!alunoId
  });

  const {data: alunosPorId, isFetched: alunosIdFetched} = useQuery({ queryKey: ["alunosPorId", alunoId] , queryFn: ()=>getAlunosId(alunoId), enabled: !!alunoId
  });
  React.useEffect(()=>{
      form.setValue('nomeCompleto', alunosPorId?.data.nomeCompleto)
      form.setValue('genero', alunosPorId?.data.genero)
      form.setValue('dataNascimento', alunosPorId?.data.dataNascimento)
      form.setValue('nomeCompletoPai', alunosPorId?.data.nomeCompletoPai)
      form.setValue('nomeCompletoMae', alunosPorId?.data.nomeCompletoMae)
      form.setValue('bairro', alunosPorId?.data.endereco.bairro)
      form.setValue('rua', alunosPorId?.data.endereco.rua)
      form.setValue('numeroCasa', parseInt(alunosPorId?.data.endereco.numeroCasa))
      form.setValue('telefone', alunosPorId?.data.contacto.telefone)
      if(alunosPorId?.data.contacto.email !== null){
      form.setValue('email', alunosPorId?.data.contacto.email)}else{
        form.setValue('email', '')
      }
    form.setValue('id', alunosPorId?.data.id);
    formConfirmacao.setValue('id', alunosPorId?.data.id);
  }, [alunoId, alunosIdFetched])

const {data: alunosPorMatricula} = useQuery({ queryKey: ["alunosPorMatricula", alunoId] , queryFn: ()=>getAlunosMatriculas(alunoId), enabled: !!alunoId
});

const {data: classesAluno} = useQuery({ queryKey: ["classesAluno", formStepOne.getValues('cursoId')], queryFn: ()=>getAlunosClassesMatriculasCurso(formStepOne.getValues('cursoId')), enabled: !!formStepOne.getValues('cursoId')
});

const {data: turmasAluno} = useQuery({ queryKey: ["turmaAlunoId", fieldClassesAluno] , queryFn: ()=>getTurmasId(fieldClassesAluno), enabled: !!fieldClassesAluno
});

const changeResource=(id)=>{
  setAlunoId(id)
  setCookies('idAluno', id , 1, false) 
}
  const [idAno, setIdAno] = React.useState<number>(0);
  React.useEffect(() => {
    const search = async () => {
      const resp = await fetch(`http://localhost:8000/api/ano-lectivos/`);
        const receve = await resp.json()
        const meuarray = receve.data.find((c)=>{
          return c.activo === true
        })
        setIdAno(meuarray.id)
    };
    search();
  }, []);

  const [searchTerm, setSearchTerm] = React.useState("");
  const handleFilterChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredTurmas = alunosTurma?.data?.data?.filter((turma) =>{
    return turma.nomeCompleto.toLowerCase().includes(searchTerm)}
  );

  const step = ['Filtrar Turmas', 'Inserir Nota'];
  const[ currentStep, setCurrentStep ] = React.useState<number>(1);
  const[ complete, setComplete ] = React.useState<boolean>(false);

  const fieldDivStyle = 'text-lg sm:text-base md:text-[14px] lg:text-[16px] xl:text-xl text-sky-600 mb-2 font-semibold';
  return (<>
      
    { idAno === 0 ? <div className='w-screen min-h-screen bg-scroll bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300 flex items-center justify-center'>
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
                        trimestres?.data?.data.map((field)=>{
                            return (<option key={field.id} value={`${field.id}`}>{field.numero}° Trimestre</option>
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
                         <label >Cursos<span className='text-red-500'>*</span></label>
                        <FormControl>
                    <select {...field}
                
                    className={
                      errors.cursoId?.message && `${animateShake} select-error`} 
                      onChange={(e)=>{field.onChange(parseInt(e.target.value))
                      }}>
                        {
                        cursos?.data?.data.map((field)=>{
                            return (<option key={field.id} value={`${field.id}`}>{field.nome} 
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
                    name='classeId'
                    render={({field})=>(
                    <FormItem>
                         <label >Classes<span className='text-red-500'>*</span></label>
                        <FormControl>
                    <select {...field}
                
                    className={
                      errors.classeId?.message && `${animateShake} select-error`} 
                      onChange={(e)=>{field.onChange(parseInt(e.target.value))
                      }}>
                         <option >Selecione a classe</option>
                        {
                        classes?.data?.data?.map((field)=>{
                            return (<option key={field.id} value={`${field.id}`}>{field.nome} Classe
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
                            
                        turmas?.data?.data.map((field)=>{
                            return (<option key={field.id} value={`${field.id}`}>{field.nome}
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
                      const isStep1Valid = !errors.cursoId && !errors.trimestreId && !errors.turmaId && !errors.classeId && fieldCursoId && fieldTrimestreId && fieldTurmaId && fieldClasseId;
                      if (isStep1Valid) {
                        if (alunosTurma?.data?.data.length > 0)
                        {
                        currentStep === step.length ?
                        setComplete(true) :
                        setCurrentStep(prev => prev + 1);
                        }else{

                          setDialogMessage("A Turma Selecionada Não Possui Alunos Cadastrados");
                          setShowDialog(true);
                        }
                      }else{setCurrentStep(1)}
                      
                      }} className={`${animatePing} responsive-button bg-sky-700 hover:bg-sky-600 border-sky-700`}>Próximo</button>
                </div>
                </form>
                </Form>
            </div>)}
            {currentStep === 2 && (
          <div className="animate-fade-left animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-in flex flex-col space-y-2 justify-center w-[90%] z-10">
         <div className='relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96 mb-4'>
         <Search className='absolute text-gray-300 w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7'/>            
         <Input className=' pl-6 indent-2' type='text' value={searchTerm} onChange={handleFilterChange} placeholder='Procure por registros...' />
     </div><div className='overflow-x-auto overflow-y-auto w-full  h-80 md:h-1/2 lg:h-[500px]'>
          <table className="w-full bg-white border border-gray-200 table-fixed">
          <thead className='sticky top-0 z-10'>
            <tr className={trStyle}>
                <th  className={thStyle}>Id</th>
                <th  className={thStyle}>Nome</th>
                <th  className={thStyle}>Acção</th>
            </tr>
          </thead>
          <tbody>
            {filteredTurmas.length === 0 ? (
              <tr className='w-96 h-32'>
                <td rowSpan={3} colSpan={3} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                  <div>
                  <AlertTriangle className={`${animateBounce} inline-block triangle-alert`}/>
                              <p className='text-red-500'>Nenum Registro Foi Encontrado</p>
                  </div>
                </td>
              </tr>
            ) : filteredTurmas.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
               
                <td className={tdStyle}>{item.id}</td>
                <td className={tdStyle}>{item.nomeCompleto}</td>
                <td className={tdStyle}  onClick={()=>{changeResource(item.id)}}>
                  <div className='flex flex-row space-x-2'>

                  <Dialog >
                    <DialogTrigger asChild >
                    <div title='actualizar' className='relative flex justify-center items-center' >
                    <EditIcon className='w-5 h-4 absolute text-white font-extrabold'/>
                      <Button className='h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm' ></Button>
                      </div>
                      
                    </DialogTrigger>
                    <DialogContent className="max-w-[425px] sm:w-[260px] md:w-[600px] lg:w-[780px] xl:w-[400px] overflow-y-scroll h-[500px] bg-white">
                      <DialogHeader>
                      <DialogTitle className='text-sky-800 text-xl'>Actualização do Registro</DialogTitle>
                    <DialogDescription>
                      <p className='text-base text-gray-800'>
                     secção reservada para actualizar os dados do aluno click em <span className='font-bold text-sky-700'>actualizar</span> quando terminar.
                    </p>
                    </DialogDescription>
                      </DialogHeader>
                      <Form {...form} >
                    <form onSubmit={form.handleSubmit(handleSubmitUpdate)} >
                    <div className="w-full flex flex-col justify-between ">
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
                            <div className={`${fieldDivStyle}`}>Dados Pessoal</div>
                            <div className='w-full flex flex-col '>
                            <div className="w-full flex flex-row justify-between space-x-2 mb-2">
                            <div className='w-full'>
                            <label htmlFor="nome">Nome<span className='text-red-500'>*</span></label>
                          <FormField
                          control={form.control}
                          name="nomeCompleto"
                          render={({field})=>(
                            <FormItem>
                            <FormControl>
                          <Input id='nome'
                            className={form.formState.errors.nomeCompleto?.message && 
                              `${animateShake} input-error`}
                            
                            {...field} 
                            
                          />
                          </FormControl>
                          <FormMessage className='text-red-500 text-xs'/>
                          </FormItem>
                        )}
                          />
                        </div>
                        <div className='w-full'>
                        <label htmlFor="genero">Gênero<span className='text-red-500'>*</span></label>
                        
                            <FormField
                          control={form.control}
                          name="genero"
                          render={({field})=>(
                            <FormItem>
                            <FormControl>
                          <select {...field} id='genero' className={
                      form.formState.errors.genero?.message && `${animateShake} select-error`}>
                              <option value="M">M</option>
                              <option value="F">F</option>
                          </select>
                          </FormControl>
                          <FormMessage className='text-red-500 text-xs'/>
                          </FormItem>
                        )}/></div></div>
                        <div className="flex w-full flex-col text-left mb-2">
                        <label htmlFor="nasc">Data de Nasc.<span className='text-red-500'>*</span></label>
                            <FormField
                          control={form.control}
                          name="dataNascimento"
                          render={({field})=>(
                          <FormControl>
                          <FormItem>
                          <Input type='date'  id="nasc" {...field} className={form.formState.errors.dataNascimento?.message &&`${animateShake} input-error`}/>
                          <FormMessage className='text-red-500 text-xs'/>
                          </FormItem>
                          </FormControl>

                        )}/>
                          </div>
                        <div className="w-full flex flex-row justify-between space-x-2">
                        <div className='w-full'>
                        <label htmlFor="pai">Nome do Pai<span className='text-red-500'>*</span></label>
                            <FormField
                          control={form.control}
                          name="nomeCompletoPai"
                          render={({field})=>(
                            <FormControl>
                                <FormItem>
                          <Input id="pai" type='text' {...field} className={form.formState.errors.nomeCompletoPai?.message && `${animateShake} input-error`}/>
                          <FormMessage className='text-red-500 text-xs'/>
                          </FormItem>
                          </FormControl>
                        )}/></div>
                        <div className='w-full'>
                        <label htmlFor="mae">Nome da Mãe<span className='text-red-500'>*</span></label>
                          <FormField
                          control={form.control}
                          name="nomeCompletoMae"
                          render={({field})=>(
                            <FormControl>
                            <FormItem>
                          <Input id="mae" type='text' {...field} className={form.formState.errors.nomeCompletoMae?.message && `${animateShake} input-error`}/>
                          <FormMessage className='text-red-500 text-xs'/>
                          </FormItem>
                          </FormControl>
                        )}/></div></div></div>
                        </fieldset>
                        <fieldset>
                        <div className={`${fieldDivStyle}`}>Localização</div>
                            <div className="w-full flex flex-row justify-between space-x-2">
                            <div className='w-full'>
                            <label htmlFor="bairro">Bairro<span className='text-red-500'>*</span></label>
                        
                            <FormField
                          control={form.control}
                          name="bairro"
                          render={({field})=>(
                            <FormControl>
                                <FormItem>
                          <Input id="bairro" type='text' {...field} className={form.formState.errors.bairro?.message && `${animateShake} input-error`}/>
                          <FormMessage className='text-red-500 text-xs'/>
                          </FormItem>
                          </FormControl>
                        )}/></div>
                            <div className='w-full'>
                            <label htmlFor="name">Rua<span className='text-red-500'>*</span></label>
                            <FormField
                          control={form.control}
                          name="rua"
                          render={({field})=>(
                            <FormControl>
                        <FormItem>
                          <Input id="rua" type='text' {...field} className={form.formState.errors.rua?.message && `${animateShake} input-error`}/>
                          <FormMessage className='text-red-500 text-xs'/>
                          </FormItem>
                          </FormControl>
                        )}/>
                        </div>
                        <div className='w-full'>
                        <label htmlFor="name">N.Residência<span className='text-red-500'>*</span></label>
                            <FormField
                          control={form.control}
                          name="numeroCasa"
                          render={({field})=>(
                            <FormControl>
                            <FormItem>
                          <Input id="casa" type='number' {...field} className={form.formState.errors.numeroCasa?.message && `${animateShake} input-error`}onChange={(e)=>{field.onChange(parseInt( e.target.value))}}/>
                          <FormMessage className='text-red-500 text-xs'/>
                          </FormItem>
                          </FormControl>
                        )}/>
                        </div></div>
                        </fieldset>
                        <fieldset>
                         
                        <div className={`${fieldDivStyle}`}>Contacto</div>
                            <div className="w-full flex flex-row justify-between space-x-2">
                        <div className='w-full'>
                        <label htmlFor="tel">Telefone<span className='text-red-500'>*</span></label>
                      <FormField
                          control={form.control}
                          name="telefone"
                          render={({field})=>(
                            <FormControl>
                                <FormItem>
                                <Input id='tel' {...upWithMask('telefone',['999999999'], {required: true})} className={form.formState.errors.telefone?.message && `${animateShake} input-error`}/>
                          <FormMessage className='text-red-500 text-xs'/>
                          </FormItem>
                          </FormControl>
                        )}/></div>
                        <div className='w-full'>
                        <label htmlFor="email">Email</label>
                      <FormField
                          control={form.control}
                          name="email"
                          render={({field})=>(
                            <FormItem>
                            <FormControl>
                          <Input
                            id="email"
                            className={form.formState.errors.email?.message && `${animateShake} input-error`}
                          {...field} />
                          </FormControl>
                          <FormMessage className='text-red-500 text-xs'/>
                          </FormItem>
                        )}/>
                        </div></div></fieldset>
                        </div>
                      
                      <DialogFooter>
                        <Button title='actualizar' className='responsive-button bg-green-500 border-green-500 text-white hover:bg-green-500' type='submit'><SaveIcon className='w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7 absolute text-white font-extrabold'/></Button>
                      </DialogFooter>
                      </form>
                      </Form>
                    </DialogContent>
                  </Dialog>

                  <Dialog >
            <DialogTrigger asChild >
            <div title='confirmação' className='relative flex justify-center items-center' >
            <FolderOpenIcon className='w-5 h-4 absolute text-white font-extrabold'/>
              <button className='h-7 px-5 bg-amber-400 text-white font-semibold hover:bg-amber-400 border-amber-400 rounded-sm' ></button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-[425px] sm:w-[260px] md:w-[600px] lg:w-[780px] xl:w-[400px] overflow-y-scroll h-[500px] -mb-2 bg-white">
              <DialogHeader>
              <DialogTitle className='text-sky-800 text-xl'>Confirmação da Matrícula</DialogTitle>
                <DialogDescription>
                  <p className='text-base text-gray-800'>
                  confirma a matrícula {alunosPorId?.data?.genero === 'M' ? 'do aluno' : 'da aluna'} <span className='font-bold uppercase'>{alunosPorId?.data?.nomeCompleto}</span> n. bi: <span className='font-bold'>{alunosPorId?.data?.numeroBi}</span> para o ano corrente.</p>
                </DialogDescription>
              </DialogHeader>
            
              <Form {...formConfirmacao} >
            <form onSubmit={formConfirmacao.handleSubmit(handleSubmitCreateConfirmacao)} >
                    <div className='flex flex-col space-y-3 mb-5'>
                      
                        <div className='flex flex-col w-full'>
                            <FormField
                            control={formConfirmacao.control}
                            name='classeId'
                            render={({field})=>(
                            <FormItem>
                               <label htmlFor="classe">Classes<span className='text-red-500'>*</span>
                                    </label>
                                <FormControl>
                                  <select {...field} className={formConfirmacao.formState.errors.classeId?.message && `${animateShake} select-error`} onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                                <option >Selecione a classe</option>
                                {
                                      classesAluno?.data?.data.map((field)=>{
                                          return <option key={field} value={`${field.id}`}>{field.nome} Classes</option>
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
                            control={formConfirmacao.control}
                            name='turmaId'
                            render={({field})=>(
                            <FormItem>
                                <label htmlFor="turma">Turmas<span className='text-red-500'>*</span>
                                    </label>
                                <FormControl>
                                <select {...field} className={formConfirmacao.formState.errors.turmaId?.message && `${animateShake} select-error`}onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                                <option >Selecione a turma</option>
                                {
                                      turmasAluno?.data?.data.map((field)=>{
                                          return <option key={field} value={`${field.id}`}>{field.nome}</option>
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
                            control={formConfirmacao.control}
                            name='turnoId'
                            render={({field})=>(
                            <FormItem>
                               <label htmlFor="turno">Turnos<span className='text-red-500'>*</span>
                                    </label>
                                <FormControl>
                                <select {...field} className={formConfirmacao.formState.errors.turnoId?.message && `${animateShake} select-error`} onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                                <option >Selecione a turma</option>
                                {
                                      turnos?.data?.data.map((field)=>{
                                          return <option key={field} value={`${field.id}`}>{field.nome}</option>
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
                            control={formConfirmacao.control}
                            name='metodoPagamentoId'
                            render={({field})=>(
                            <FormItem>
                                <label htmlFor="pagamento">Pagar em<span className='text-red-500'>*</span>
                                    </label>
                                <FormControl>
                                <select id='pagamento' {...field} className={formConfirmacao.formState.errors.metodoPagamentoId?.message && `${animateShake} select-error`}onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                                <option >Selecione o método</option>
                                {
                                      pagamentos?.data?.data.map((field)=>{
                                          return <option key={field} value={`${field.id}`}>{field.nome}</option>
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
                <Button title='nova matrícula' className='responsive-button bg-blue-600 border-blue-600 text-white hover:bg-blue-600 font-semibold w-12' type='submit'><SaveIcon className='w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7 w-5 h-5 absolute text-white font-extrabold'/></Button>
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
              <DialogContent className="max-w-[425px] sm:w-[260px] md:w-[600px] lg:w-[780px] xl:w-[400px] overflow-y-scroll h-[500px] bg-white">
                <DialogHeader>
                  <DialogTitle>Informações sobre {item.nomeCompleto}</DialogTitle>
                  <DialogDescription >
                  <p>As informações relevantes do aluno, são listadas aqui! <Link to={'/PersonInchargePage'}><p className='text-red-600 font-semibold italic'>Click Aqui Pra ver os dados do encarregado</p> </Link></p>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4 bg-white">
                  <div className="flex flex-col w-full"><fieldset>
                      <legend className='text-sm text-gray-700'>Dados Pessoal</legend>
                      <div className='w-full flex flex-col space-y-3'>
                      <div className="w-full flex flex-row justify-between px-2">
                      <div>
                          <label >nome completo</label>
                          <p className='font-thin text-sm'>{alunosPorId?.data?.nomeCompleto}</p>
                      </div>
                      <div>
                          <label className='font-poppins'>número do bi</label>		
                            <p className='font-thin text-sm'>{alunosPorId?.data?.numeroBi}</p>
                      </div>
                      </div>
                      <div className="w-full flex flex-row justify-between px-2">
                      <div>
                          <label className='font-poppins'>nome do pai</label>	
                          <p className='font-thin text-sm'>{alunosPorId?.data?.nomeCompletoPai}</p>
                      </div>
                      <div>
                          <label className='font-poppins'>nome da mãe</label>
                          <p className='font-thin text-sm'>{alunosPorId?.data?.nomeCompletoMae}</p>
                      </div>
                      </div>
                      <div className="w-full flex flex-row justify-between px-2">
                      <div>
                          <label className='font-poppins'>gênero</label>
                          <p className='font-thin text-sm'>{alunosPorId?.data?.genero}</p>
                      </div>
                      <div>
                          <label className='font-poppins'>data de nascimento</label>
                          <p className='font-thin text-sm'>{alunosPorId?.data?.dataNascimento}</p>
                      </div>
                      </div>
                      </div>
                      
                  </fieldset>
                  <fieldset>
                      <legend className=' text-sm text-gray-800'>Localização</legend>
                      <div className="w-full flex flex-row justify-between px-2">
                      <div className="w-full flex flex-row justify-between px-2">
                      <div>
                          <label className='font-poppins'>número da casa</label>
                          <p className='font-thin text-sm'>{alunosPorId?.data?.endereco.numeroCasa}</p>
                      </div>
                      <div>
                          <label className='font-poppins'>bairro</label>
                          <p className='font-thin text-sm'>{alunosPorId?.data?.endereco.bairro}</p>
                      </div>
                      <div>
                          <label className='font-poppins'>rua</label>
                          <p className='font-thin text-sm'>{alunosPorId?.data?.endereco.rua}</p>
                      </div>
                      </div>
                      </div>
                  </fieldset>
                      <fieldset>
                          <legend className='font-robotoSlab text-sm text-gray-800'>Contacto</legend>
                      <div className="w-full flex flex-row justify-between px-2">
                      <div className="w-full flex flex-row justify-between px-2">
                      <div>
                          <label className='font-poppins'>Telefone</label>
                          <p className='font-thin text-sm'>{alunosPorId?.data?.contacto.telefone}</p>
                      </div>
                      {alunosPorId?.data?.email && 
                      <div>
                          <label className='font-poppins'>email</label>
                          <p className='font-thin text-sm'>{alunosPorId?.data?.contacto.email}</p>
                      </div>
                      }
                      </div>
                      </div>
                      </fieldset>
                      <fieldset>
                          <legend className='text-sm text-gray-800'>Histórico de matrículas</legend>
                      <div className="w-full flex flex-row justify-between px-2">
                      <div className="w-full flex flex-row justify-between px-2">
                      <div className='overflow-y-auto h-28 w-full'>
                          {
                            
                            alunosPorMatricula?.data?.data.map((item)=>{
                              const formattedDate = new Date(item.createdAt).toLocaleString('pt-BR', { 
                                dateStyle: 'full', 
                                timeStyle: 'short' 
                              });
                              return (
                          <ul key={item.id}>
                            <li>Curso: {item.curso}</li>
                            <li>Classe: {item.classe}</li>
                            <li>Turma: {item.turma}</li>
                            <li>Data: {formattedDate}</li>
                            <li>-----------------</li>
                            </ul>)})}
                      </div>
                      </div>
                      </div>
                      </fieldset>

                      <fieldset>
                          <legend className='text-sm text-gray-800'>Todas Notas</legend>
                      <div className="w-full flex flex-row justify-between px-2">
                      <div className="w-full flex flex-row justify-between px-2">
                      <div className='overflow-y-auto h-28 w-full'>
                          {
                            
                           alunosNotas?.data?.data.length > 0 ? alunosNotas?.data?.data.map((item, index)=>{return (
                          <ul key={index}>
                            <li>Trimestre: {item.trimestre}</li>
                            <li>Disciplina: {item.disciplina}</li>
                            <li>Nota: {item.nota}</li>
                            <li>-----------------</li>
                            </ul>)}) :  <div className='text-red-500 flex flex-col justify-center items-center'>
                            <AlertTriangle className={`${animateBounce} inline-block triangle-alert`}/>
                              <p className='text-red-500'>Nenhuma Nota Registrada Neste Trimestre</p>
                            </div>}
                      </div>
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
                  </td>
              </tr>
            ))}
          </tbody>
          <tfoot className='sticky bottom-0 bg-white'>
            <tr>
              <td colSpan={3} className="py-2 text-blue-500">
                Total de registros: {alunosTurma?.data?.data.length}
              </td>
            </tr>
          </tfoot>
        </table>
        {currentStep > 1 && 
    <button type='button' onClick={()=>{
      if (currentStep === step.length) {
        setComplete(false);
      }
      if (currentStep > 1) {
        setCurrentStep(prev => prev - 1);
      }
    }} className={`${animatePing} responsive-button bg-gray-700 hover:bg-gray-600 text-white font-semibold border-gray-700`}>Voltar</button>
    }
        </div>
        
        </div> )}
        <div className='w-full flex items-center justify-between'>
        </div>
       </div>   
        </section>
       
      )}
       <MostrarDialog
  show={showDialog}
  message={dialogMessage}
  onClose={() => { setShowDialog(false); }}
/>
    </>
  );
}
