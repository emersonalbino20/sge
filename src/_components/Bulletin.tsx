import { AlertCircleIcon, AlertTriangle, Check, CheckCircleIcon, Edit, InfoIcon, Save, SaveIcon, Search } from 'lucide-react';
import * as React from 'react';
import { tdStyle, thStyle, trStyle } from './table';
import Select from 'react-select';
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
import IPPUImage from '../assets /_images/IPPU.png'
import './stepper.css';

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

export default function Bulletin() {
  
  const form  = useForm<z.infer<typeof TForm>>({
    mode: 'all', 
    resolver: zodResolver(TForm)
   })

   const formUpdate  = useForm<z.infer<typeof TFormUpdate>>({
    mode: 'all', 
    resolver: zodResolver(TFormUpdate)
   })

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
  const [classes, setClasses] = React.useState([]);
  const [turmas, setTurmas] = React.useState([]);
  const [alunos, setAlunos] = React.useState([]);
  const [alunosClasse, setAlunosClasse] = React.useState([]);
  const [trimestres , setTrimestres] = React.useState([]);
  const [disciplinaId, setDisciplinaId] = React.useState(null);
  const [trimestreId, setTrimestreId] = React.useState(null);
  const [classeId, setClasseId] = React.useState(null);
  const [buscarNotas, setBucarNotas] = React.useState([]);
  const [dados, setDados] = React.useState([]);
  const [idAno, setIdAno] = React.useState<number>(0);
  const columnsClasse = ['Id', 'Nome', 'Existe', 'Acção'];
  React.useEffect(() => {
    const search = async () => {
      const URL = "http://localhost:8000/api/professores/1/classes";
      const response = await fetch(URL);
      const responseJson = await response.json();
      
      // Filtra cursos únicos pelo nome
      const uniqueCursos = responseJson.data.reduce((acc, current) => {
        const x = acc.find(item => item.curso.nome === current.curso.nome);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      
      setCursos(uniqueCursos);

      const URLDISC = "http://localhost:8000/api/professores/1/disciplinas";
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

 
  const loadClasses = async (cursoId) => {
    const URL = `http://localhost:8000/api/cursos/${cursoId}/classes`;
    const response = await fetch(URL);
    const responseJson = await response.json();
    setClasses(responseJson.data);
  };

  const [nomeDisciplina, setNomeDisciplina] = React.useState<string>('');
  const [alunoNota, setAlunoNota] = React.useState([]);
  const handleClassChange = async (selectedClass) => {
    
    setClasseId(selectedClass.value);
    const URL = `http://localhost:8000/api/classes/${selectedClass.value}/turmas`;

    const response = await fetch(URL);
    const responseJson = await response.json();
    setTurmas(responseJson.data)

    const URLClasse = `http://localhost:8000/api/classes/${selectedClass.value}/alunos`;
    
    const responseClasse = await fetch(URLClasse);
    const responseJsonClasse = await responseClasse.json();
    
    setAlunosClasse(responseJsonClasse.data);
    setDados(responseJsonClasse.data);

    async function getUpdatedData() {
      // Cria um array de promessas para aguardar todas as requisições
      const updatedData = await Promise.all(
        dados.map(async (item) => {
          const URL = `http://localhost:8000/api/alunos/${item.id}/notas?trimestreId=${trimestreId}&classeId=${classeId}`;
          
          const response = await fetch(URL);
          const responseJson = await response.json();
          
          if (responseJson.data && responseJson.data.length > 0) {
            const disciplina = responseJson.data[0].disciplina;
            
            if (disciplina === nomeDisciplina) {
              item.estado = 'ok';
            } else {
              item.estado = 'no';
            }
            console.log(responseJson.data);
          } else {
            // Se não houver dados, considere 'no'
            item.estado = 'no';
          }
        })
      );
      
      
      setAlunoNota(dados);
    }
    
    getUpdatedData();
  };

  const handleTurmaChange = async (e) => {
    const URL = `http://localhost:8000/api/notas/alunos/sem-notas?classeId=${classeId}&turmaId=${e.value}&trimestreId=${trimestreId}&disciplinaId=${disciplinaId}&pageSize=20`;
    const response = await fetch(URL);
    const responseJson = await response.json();

    setAlunos(responseJson.data);
    
  };

const clickBuscarNotas = async (idAluno) => {
    const URL = `http://localhost:8000/api/alunos/${idAluno}/notas?trimestreId=${trimestreId}&classeId=${classeId}`;
    
    const response = await fetch(URL);
    const responseJson = await response.json();
    setBucarNotas(responseJson.data);
  };

  
  const createCursoSelectOptions = () => {
    const cursoOptions = cursos.map(curso => ({
      value: curso.curso.id,
      label: curso.curso.nome,
      classes: [] 
    }));
    return cursoOptions;
  };

  
  const createDisciplinaSelectOptions = () => {
    const disciplinaOptions = disciplinas.map(disciplina => ({
      value: disciplina.id,
      label: disciplina.nome,
    }));
    
    return disciplinaOptions;
  };

  const createTrimestreSelectOptions = () => {
    const trimestreOptions = trimestres.map(trimestre => ({
      value: trimestre.id,
      label: "Inicio: "+trimestre.inicio +"  Termino: "+ trimestre.termino,
    }));
    return trimestreOptions;
  };

  const createTurmaSelectOptions = () => {
    const turmaOptions = turmas.map( turma => ({
      value: turma.id,
      label: turma.nome
    }));
    return turmaOptions;
  };

  const handleCursoChange = async (selected) => {
    if (!selected) return;
      await loadClasses(selected.value);
  };

const handleFilterClasse = (event) => {
    const valores = alunoNota.filter((element) =>{ return (element.nomeCompleto.toLowerCase().includes(event.target.value.toLowerCase().trim())) });
    setAlunoNota(valores)
}
const step = ['Filtrar Turmas', 'Inserir Nota'];
    const[ currentStep, setCurrentStep ] = React.useState<number>(1);
    const[ complete, setComplete ] = React.useState<boolean>(false);

  return (<>
      
    { idAno == 0 ?  <section className="w-screen min-h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300  grid-flow-col grid-cols-3">
      <Header title={false}/> 
      <div className='w-full text-center text-4xl text-red-600 md:text-2xl lg:text-2xl'>
          <div>
              <AlertTriangle className="inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12"/>
              <p>SELECIONE O ANO LECTIVO</p>
              <p className='italic font-semibold text-sm cursor-pointer'><Link to={'/AcademicYearPage'}>Selecionar agora</Link></p>
          </div>
      </div>
        </section> : (
      <section className="m-0 w-screen h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300  grid-flow-col grid-cols-3">
         <Header title={false}/> 
         <div className='flex flex-col space-y-2 justify-center items-center w-full'>
         <div className='flex justify-center items-center '>
            <div className='flex justify-between'>{
            step?.map((step, i) => 
                (
                    <div key={i} className={`step-item ${currentStep === i + 1 ? 'active' : '' } ${ (i + 1 < currentStep || complete) && 'complete'}`}>
                        <div className='step'>{ 
                        (i + 1 < currentStep || complete) ?
                        <Check/> : i + 1 }</div>
                        <p className='text-gray-500'>{step}</p>
                    </div>
                    
                )
                )}
              </div>
            </div>
            {currentStep === 1 && ( <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
              
                <div className="space-y-6">
                    <div>
                <img src={IPPUImage} className="h-20 w-20" alt="Ulumbo Logo" />
                    <h5 className="text-sky-700 text-2xl font-semibold  ">Preencha A primeira Etapa</h5>
                    </div>
                    <div>
                        <label className="text-sky-600 text-lg font-semibold">Curso*</label>
                        <Select
                        onChange={handleCursoChange}
                       options={createCursoSelectOptions()}
                       placeholder="Selecione um curso"
                     />
                    </div>
                    <div>
                    <label className="text-sky-600 text-lg font-semibold">Disciplina*</label>
                        <Select
                        onChange={(e)=>{setDisciplinaId(e.value); setNomeDisciplina(e.label)}}
                        options={createDisciplinaSelectOptions()}
                        placeholder="Selecione uma disciplina"
                      />
                        </div>
                        <div>
                        <label className="text-sky-600 text-lg font-semibold">Trimestre*</label>
                        <Select
                        onChange={(e)=>{setTrimestreId(e.value)}}
                          options={createTrimestreSelectOptions()}
                          placeholder="Selecione o trimestre"
                        />
                        </div>
                        <div>
                        <label className="text-sky-600 text-lg font-semibold">Classe*</label>
                        <Select
                          onChange={handleClassChange}
                          options={classes.map(classe => ({
                            value: classe.id,
                            label: classe.nome,
                          }))}
                          placeholder="Selecione uma classe"
                        />
                        </div>
                        <div>
                        <label className="text-sky-600 text-lg font-semibold">Turma</label>
                        <Select
                      onChange={(e)=>{handleTurmaChange(e)}}
                      options={createTurmaSelectOptions()}
                      placeholder="Selecione uma turma"
                    />
                        </div>
                        
                      <button type='button' onClick={()=>{
                          currentStep === step.length ?
                          setComplete(true) :
                          setCurrentStep(prev => prev + 1);
                      }} className='bg-sky-700 hover:bg-sky-600 text-white font-semibold text-lg px-5 py-1 border-sky-700'>Próximo</button>
                </div>
            </div>)}
            {currentStep === 2 && (
          <div className="overflow-x-auto overflow-y-auto w-[777px] h-80 ">
         <div className='relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96 mb-4'>
         <Search className='absolute text-gray-300'/>            
         <input className=' pl-6 rounded-md border-2 border-gray-400 placeholder:text-gray-400 placeholder:font-bold outline-none py-2 w-full indent-2' type='text' placeholder='Procure por registros...' onChange={handleFilterClasse}/>
     </div><>
          <table className="w-full bg-white border border-gray-200 table-fixed">
          <thead className='sticky top-0 z-10'>
            <tr className={trStyle}>
              {columnsClasse.map((element, index) => (
                <th key={index} className={thStyle}>{element}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alunoNota.length === 0 ? (
              <tr className='w-96 h-32'>
                <td rowSpan={4} colSpan={4} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                  <div>
                    <AlertTriangle className="inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12"/>
                    <p>Nenhum Registro Foi Encontrado</p>
                  </div>
                </td>
              </tr>
            ) : alunoNota.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
               
                <td className={tdStyle}>{item.id}</td>
                <td className={tdStyle}>{item.nomeCompleto}</td>
                <td className={tdStyle}>{item.estado === 'ok' ? <span className='text-green-500'>ok</span> : <span className='text-red-500'>no</span>}</td>
                <td className={tdStyle} onClick={()=>{clickBuscarNotas(item.id)}}>
                  <div className='flex flex-row space-x-2'>
                  {item.estado === 'no' ? 
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
                      form.setValue('classeId', classeId);
                      form.setValue('trimestreId', trimestreId);
                      form.setValue('disciplinaId', disciplinaId);
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
                              <DialogTitle>Actualizar Nota {item.nome}</DialogTitle>
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
                            formUpdate.setValue('classeId', classeId);
                            formUpdate.setValue('trimestreId', trimestreId);
                            formUpdate.setValue('disciplinaId', disciplinaId);
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
                {buscarNotas.length == 0 && (
                  <div className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                  <div>
                    <AlertTriangle className="inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12"/>
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
                Total de registros: {alunosClasse.length}
              </td>
            </tr>
          </tfoot>
        </table>
        {currentStep > 1 && 
    <button type='button' onClick={()=>{
        currentStep === step.length && setComplete(false);
        
        currentStep > 1 && setCurrentStep(prev => prev - 1);
    }} className='bg-gray-700 hover:bg-gray-600 text-white font-semibold text-lg px-5 py-1 border-gray-700'>Voltar</button>
    }
        </>
        
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
