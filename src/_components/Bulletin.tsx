import { AlertCircleIcon, AlertTriangle, CheckCircleIcon, Edit, InfoIcon, Save, SaveIcon, Search } from 'lucide-react';
import * as React from 'react';
import { tdStyle, thStyle, trStyle } from './table';
import Select from 'react-select';
import { AroundDiv, InfoButton, SubmitButton } from './MyButton';
import { idZod, nota } from '@/_zodValidations/validations';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MyDialog, MyDialogContent } from './my_dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
  const [step, setStep] = React.useState(false);
  const [dados, setDados] = React.useState([]);
  const [selectedOption, setSelectedOption] = React.useState(null);
  const columns = ['Id', 'Nome', 'Média Trimestral', 'Acção'];
  const columnsClasse = ['Id', 'Nome', 'Acção'];
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
    };
    search();
  }, []);

  // Função para buscar classes baseadas no curso selecionado
  const loadClasses = async (cursoId) => {
    const URL = `http://localhost:8000/api/cursos/${cursoId}/classes`;
    const response = await fetch(URL);
    const responseJson = await response.json();
    setClasses(responseJson.data);
  };

  // Função para buscar alunos da classe selecionada
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

  };

  const handleTurmaChange = async (e) => {
    const URL = `http://localhost:8000/api/notas/alunos/sem-notas?classeId=${classeId}&turmaId=${e.value}&trimestreId=${trimestreId}&disciplinaId=${disciplinaId}&pageSize=20`;
    const response = await fetch(URL);
    const responseJson = await response.json();
    setAlunos(responseJson.data);
    console.log(responseJson.data)
    
  };

const clickBuscarNotas = async (idAluno) => {
  
    const URL = `http://localhost:8000/api/alunos/${idAluno}/notas?trimestreId=${trimestreId}&classeId=${classeId}`;
    
    const response = await fetch(URL);
    const responseJson = await response.json();
    setBucarNotas(responseJson.data);
  };

  // Cria as opções para o Select
  const createCursoSelectOptions = () => {
    const cursoOptions = cursos.map(curso => ({
      value: curso.curso.id,
      label: curso.curso.nome,
      classes: [] // Inicialmente vazio
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

    // Carrega classes ao selecionar um curso
    await loadClasses(selected.value);
    setSelectedOption(selected);
  };

const handleFilterClasse = (event) => {
    const valores = alunosClasse.filter((element) =>{ return (element.nomeCompleto.toLowerCase().includes(event.target.value.toLowerCase().trim())) });
    setDados(valores)
}

/*const handleFilter = (event) => {
  const valores = alunos.filter((element) =>{ return (element.nomeCompleto.toLowerCase().includes(event.target.value.toLowerCase().trim())) });
  setDados(valores)
}*/
  return (
    <>
      <div className='w-screen min-h-screen bg-scroll bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300 flex items-center justify-center'> <div className='flex flex-col space-y-2 justify-center w-[90%] mt-44'> 
        
       
        
        <div className='mb-2 z-10 flex flex-col space-y-4'>
          <div className='flex flex-row space-x-2'>
            <Select
              onChange={handleCursoChange}
              options={createCursoSelectOptions()}
              placeholder="Selecione um curso"
            />
            <Select
              onChange={(e)=>{setDisciplinaId(e.value)}}
              options={createDisciplinaSelectOptions()}
              placeholder="Selecione uma disciplina"
            />
             <Select
             onChange={(e)=>{setTrimestreId(e.value)}}
              options={createTrimestreSelectOptions()}
              placeholder="Selecione o trimestre"
            />
          </div>
        
          {(trimestreId > 0 && disciplinaId > 0 && classes.length > 0) && (
            <div className='flex flex-row space-x-2'>
            <Select
              onChange={handleClassChange}
              options={classes.map(classe => ({
                value: classe.id,
                label: classe.nome,
              }))}
              placeholder="Selecione uma classe"
            />
             <Select
              onChange={(e)=>{handleTurmaChange(e)}}
              options={createTurmaSelectOptions()}
              placeholder="Selecione uma turma"
            />
            <select className='py-3 rounded-sm ring-1 ring-gray-300 bg-white text-gray-500 pl-3' onChange={(e)=>{
              if(e.target.value === "1"){
                setStep(false)
              }else{
                setStep(true);
              }
            }}>
              <option >Selecione uma</option>
              <option value="1">Atribuir Notas</option>
              <option value="2">Consultar e Editar Notas</option>
          </select>
        </div>
          )}
        </div>
          <div className="overflow-x-auto overflow-y-auto w-full h-80 md:h-1/2 lg:h-[500px]">
            {!step && (
            <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitNota)} >
          {/*<div className='relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96'>
         <Search className='absolute text-gray-300'/>            
         <input className=' pl-6 rounded-md border-2 border-gray-400 placeholder:text-gray-400 placeholder:font-bold outline-none py-2 w-full indent-2' type='text' placeholder='Procure por registros...' onChange={handleFilter}/>
         </div>
            */}  <table className="w-full bg-white border border-gray-200 table-fixed">
              <thead className='sticky top-0 z-0'>
                <tr className={trStyle}>
                  {columns.map((element, index) => (
                    <th key={index} className={thStyle}>{element}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alunos.length === 0 ? (
                  <tr className='w-96 h-32'>
                    <td rowSpan={4} colSpan={4} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                      <div>
                        <AlertTriangle className="inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12"/>
                        <p>Nenhum Registro Foi Encontrado</p>
                      </div>
                    </td>
                  </tr>
                ) : alunos.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
                    <td className={tdStyle}>{item.id}</td>
                    <td className={tdStyle}>{item.nomeCompleto}</td>
                    <td className={tdStyle}>
                    <FormField
                      control={form.control}
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
                    </td>
                    <td className={tdStyle}><div className={AroundDiv}>
                    <Save 
                    className="w-5 h-4 absolute text-white font-extrabold cursor-pointer"/> 
                    <Button  type='submit'
                    className="h-7 px-5 bg-green-600 text-white font-semibold hover:bg-green-600 rounded-sm border-green-600" onClick={()=>{
                      form.setValue('alunoId', item.id);
                      form.setValue('classeId', classeId);
                      form.setValue('trimestreId', trimestreId);
                      form.setValue('disciplinaId', disciplinaId);
                    }}></Button>
                      </div></td>
                  </tr>
                ))}
              </tbody>
              <tfoot className='sticky bottom-0 bg-white'>
                <tr>
                  <td colSpan={4} className="py-2 text-blue-500">
                    Total de registros: {alunos.length}
                  </td>
                </tr>
              </tfoot>
            </table>
            </form>
        </Form>
        )}
        {step && (
          <>
         <div className='relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96'>
         <Search className='absolute text-gray-300'/>            
         <input className=' pl-6 rounded-md border-2 border-gray-400 placeholder:text-gray-400 placeholder:font-bold outline-none py-2 w-full indent-2' type='text' placeholder='Procure por registros...' onChange={handleFilterClasse}/>
     </div>
          <table className="w-full bg-white border border-gray-200 table-fixed">
          <thead className='sticky top-0 z-0'>
            <tr className={trStyle}>
              {columnsClasse.map((element, index) => (
                <th key={index} className={thStyle}>{element}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dados.length === 0 ? (
              <tr className='w-96 h-32'>
                <td rowSpan={3} colSpan={3} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                  <div>
                    <AlertTriangle className="inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12"/>
                    <p>Nenhum Registro Foi Encontrado</p>
                  </div>
                </td>
              </tr>
            ) : dados.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
                <td className={tdStyle}>{item.id}</td>
                <td className={tdStyle}>{item.nomeCompleto}</td>
                <td className={tdStyle} onClick={()=>{clickBuscarNotas(item.id)}}>
                  <div className='flex flex-row space-x-2'>
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
              <td colSpan={3} className="py-2 text-blue-500">
                Total de registros: {alunosClasse.length}
              </td>
            </tr>
          </tfoot>
        </table></>
        )}
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
    </>
  );
}
