import * as React from 'react'
import { useEffect } from 'react'
import { AlertCircleIcon, AlertTriangle, CheckCircleIcon, EditIcon, SaveIcon, Search } from 'lucide-react'
import { FolderOpenIcon } from '@heroicons/react/24/outline'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import {FolderOpenIcon as Relatorios} from '@heroicons/react/24/outline';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { InfoIcon } from 'lucide-react'
import { UserPlus } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, 
FormLabel, 
FormMessage} from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver} from '@hookform/resolvers/zod'
import { z } from 'zod'
import {nomeCompletoZod,  dataNascimentoZod, generoZod,bairroZod, ruaZod, telefoneZod, emailZod, idZod, numeroCasaZod} from '../_zodValidations/validations'
import { MyDialog, MyDialogContent } from './my_dialog'
import InputMask from 'react-input-mask'
import { tdStyle, thStyle, trStyle, tdStyleButtons } from './table'
import { Link } from 'react-router-dom';
import { getCookies, removeCookies, setCookies } from '@/_cookies/Cookies'
import Header from './Header'
import { useHookFormMask, withMask } from 'use-mask-input'
import { animateBounce, animateShake } from '@/AnimationPackage/Animates'

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
    metodoPagamentoId: idZod
  })

  type FormProps =  z.infer<typeof TForm>;
  type FormPropsConfirmacao =  z.infer<typeof TFormConfirmacao>;

export default function ListStudent(){
    
    const form  = useForm<z.infer<typeof TForm>>({
        mode: 'all', 
        resolver: zodResolver(TForm)
       })

  const upWithMask = useHookFormMask(form.register)

    const formConfirmacao  = useForm<z.infer<typeof TFormConfirmacao>>({
        mode: 'all', 
        resolver: zodResolver(TFormConfirmacao),
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
                if (resp.message != null) {
                  setModalMessage(resp.message);  
                }else{
                  setModalMessage(resp.message);
                }
              })
              .catch((error) => console.log(`error: ${error}`))
              setUpdateTable(!updateTable)
          }

      const[idAluno, setIdAluno] = React.useState([]);
      const handleSubmitCreateConfirmacao = async (data: z.infer<typeof TFormConfirmacao>,e) => {
        try {
          const response = await fetch(`http://localhost:8000/api/alunos/${idAluno}/matriculas`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
          });
          setShowModal(true);
          if (response.ok) {
              const blob = await response.blob(); 
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'matricula.pdf';
              document.body.appendChild(a);
              a.click();
              a.remove();
              setModalMessage(null);
          } else {
              const errorData = await response.json();
              console.error('Erro ao gerar PDF:', response.statusText, errorData.message);
              setModalMessage(errorData.message);
          }
      } catch (error) {
          console.error('Erro na requisição:', error);
      }

        }

    const[buscar, setBuscar] = React.useState(2);
    const[bairro,setBairro] = React.useState();
    const[rua,setRua] = React.useState();
    const[casa,setCasa] = React.useState();
    const[telefone,setTelefone] = React.useState();
    const[email,setEmail] = React.useState();
    const[estado, setEstado] = React.useState(false);
    const[aluno, setAluno] = React.useState([])
    React.useEffect(()=>{
        const search = async () => {
            const resp = await fetch(`http://localhost:8000/api/alunos/${buscar}`);
            const receve = await resp.json()
            const conv = JSON.stringify(receve)
            const conv1 = JSON.parse(conv)
            setAluno(conv1)
            setBairro(receve.endereco.bairro)
            setRua(receve.endereco.rua)
            setCasa(receve.endereco.numeroCasa)
            setTelefone(receve.contacto.telefone)
            setEmail(receve.contacto.email)
            form.setValue('nomeCompleto', receve.nomeCompleto)
            form.setValue('genero', receve.genero)
            form.setValue('dataNascimento', receve.dataNascimento)
            form.setValue('nomeCompletoPai', receve.nomeCompletoPai)
            form.setValue('nomeCompletoMae', receve.nomeCompletoMae)
            form.setValue('bairro', receve.endereco.bairro)
            form.setValue('rua', receve.endereco.rua)
            form.setValue('numeroCasa', parseInt(receve.endereco.numeroCasa))
            form.setValue('telefone', receve.contacto.telefone)
            if(receve.contacto.email != null){
            form.setValue('email', receve.contacto.email)}else{
              form.setValue('email', '')
            }
            form.setValue('id', receve.id)
            setEstado(true)
        }
        search()
    },[buscar])


  /*Área q implementa o código pra pesquisar cursos*/
const [metodo, setMetodo] = React.useState([]);
const [grade, setGrade] = React.useState([]);
const [turma, setTurma] = React.useState([]);
const [turno, setTurno] = React.useState([]);
const [matriculas, setMatriculas] = React.useState([]);
const [dateMatriculas, setDateMatriculas] = React.useState([]);
const [idClasse, setIdClasse] = React.useState(0);

const URLMATRICULA = `http://localhost:8000/api/alunos/${buscar}/matriculas`;
const URLPAGAMENTO = "http://localhost:8000/api/metodos-pagamento"
const URLTURNO = `http://localhost:8000/api/turnos/`
React.useEffect( () => {
    const respFetchCursos = async () => {
          //Buscar Métodos de pagamento
          const resppay = await fetch (URLPAGAMENTO);
          const resppayJson = await resppay.json();
          const convpay1 = JSON.stringify(resppayJson.data)
          const convpay2 = JSON.parse(convpay1)
          setMetodo(convpay2);
          
          //Buscar Turnos
          const respturno = await fetch (URLTURNO);
          const respturnoJson = await respturno.json();
          const convturno1 = JSON.stringify(respturnoJson.data)
          const convturno2 = JSON.parse(convturno1)
          setTurno(convturno2)
          
          if(buscar > 0)
          {
          const respmatriculas = await fetch (URLMATRICULA);
          const respmatriculasJson = await respmatriculas.json();
          const convmatriculas1 = JSON.stringify(respmatriculasJson.data)
          const convmatriculas2 = JSON.parse(convmatriculas1)

          let data = convmatriculas2.map((item)=>{
            const date = new Date(item.createdAt);
            const formattedDate = date.toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' });
            return item.createdAt = formattedDate});
            //console.log(convmatriculas2[0].curso)
          setDateMatriculas(data);
          setMatriculas(convmatriculas2);

          const respcurso = await fetch ("http://localhost:8000/api/cursos");
          const json = await respcurso.json();
          const convcurso = JSON.stringify(json.data);
          const convcurso2 = JSON.parse(convcurso);
          const dado = convcurso2.find((n)=>{return n.nome == convmatriculas2[0].curso})

          const respclasse = await fetch (`http://localhost:8000/api/cursos/${dado.id}/classes`);
          const respclassejson = await respclasse.json();
          const convclasse = JSON.stringify(respclassejson.data)
          const convclasse2 = JSON.parse(convclasse)
          setGrade(convclasse2)

          if(idClasse > 0){
          const respturma = await fetch(`http://localhost:8000/api/classes/${idClasse}/turmas`)
          const respturmajson = await respturma.json();
          const convturma = JSON.stringify(respturmajson.data);
          const convturma2 = JSON.parse(convturma);
          setTurma(convturma2)
        }
        }
    } 
     respFetchCursos()
},[buscar, idClasse])

  const changeResource=(id)=>{
        setBuscar(id)
        setCookies('idAluno', id , 1, false) 
    }

  
  const [dados, setDados] = React.useState([])
  const [loading, setLoading] = React.useState(false);
  const [dataApi, setDataApi] = React.useState([])
  const [cursor, setCursor] = React.useState(null);  
  const [hasMore, setHasMore] = React.useState(10);

  const tableRef = React.useRef(null);

  const fetchData = async (initial = false) => {
   if (loading) return; 

   setLoading(true);
    let pageSize = 10; 
    const url = cursor
      ? `http://localhost:8000/api/alunos?pageSize=${hasMore}&cursor=${cursor}`
      : `http://localhost:8000/api/alunos?pageSize=${hasMore}`;

    try {
      const resp = await fetch(url);
      const data = await resp.json();

      if (data.data.statusCode != 500 ) {
        setDados(data.data);
        setCursor(data.next_cursor); 
       setDataApi(data.data)
        console.log(data.next_cursor);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    fetchData(true);  
  }, [cursor]);

  const handleScroll = () => {
    if (!tableRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
    if (scrollTop + clientHeight + 1 >= scrollHeight) {
      setHasMore(hasMore + 10)
      fetchData(true);
      console.log("Estou no fim")
    }
  };

    const columns = ['Id', 'Nome', 'Gênero', 'Número Bi', 'Data de Nasc.', 'Acção'];
    
   const handleFilter = (event) => {
        const a = dataApi.filter((element) =>{ return (element.nomeCompleto.toLowerCase().includes(event.target.value.toLowerCase().trim())) });
        setDados(a)
    }
    const fieldDivStyle = 'text-lg sm:text-base md:text-[14px] lg:text-[16px] xl:text-xl text-sky-600 mb-2 font-semibold';
    return (
    <>
   <section className="m-0 w-screen h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300  grid-flow-col grid-cols-3">
        <Header title={false}/> 
       <div className='flex flex-col space-y-2 justify-center items-center w-full'>
        <div className='animate-fade-left animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-in flex flex-col space-y-2 justify-center w-[90%] z-10'>
          <div className='relative flex  items-center -space-x-2 w-[80%] md:w-80 lg:w-96'>
              <Search className='absolute text-gray-300 w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7'/>            
              <Input className='pl-6 indent-2' type='text' placeholder='Procure por registros...' onChange={handleFilter}/>
          </div>
      <div ref={tableRef}  onScroll={handleScroll} className="overflow-x-auto overflow-y-auto w-full  h-80 md:h-1/2 lg:h-[500px]">
          
          <table className="w-full bg-white border border-gray-200 table-fixed">
              
              <thead className='sticky top-0 z-10'>
                  <tr className={trStyle}>
                      {columns.map((element, index) =>{ return( <th key={index} className={thStyle} >{element}</th>) })}
                  </tr>
              </thead>
              <tbody >
                  {dados.length == 0 ? (
                  <tr className='w-96 h-32'>
                      <td rowSpan={6} colSpan={6} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                          <div >
                              <AlertTriangle className={`${animateBounce} inline-block triangle-alert`}/>
                              <p className='text-red-500'>Nenum Registro Foi Encontrado</p>
                          </div>
                      </td>
                  </tr>
                  ) : dados.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
                          <td className={tdStyle}>{item.id}</td>
                          <td className={tdStyle}>{item.nomeCompleto}</td>
                          <td className={tdStyle}>{item.genero == 'M' ? 'Rapaz' : 'Menina' }</td>
                          <td className={tdStyle}>{item.numeroBi}</td>
                          <td className={tdStyle}>{item.dataNascimento}</td>
                          <td className={tdStyleButtons}    onClick={()=>{
                            changeResource(item.id)
                            if(estado){
                              setIdAluno(item.id)
                              setEstado(false);
                              
                            }
                          }}>
                      <Dialog >
                    <DialogTrigger asChild >
                    <div title='actualizar' className='relative flex justify-center items-center' >
                    <EditIcon className='w-5 h-4 absolute text-white font-extrabold'/>
                      <Button className='h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-600 rounded-sm'  ></Button>
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
                  confirma a matrícula {Object.values(aluno)[6] == 'M' ? 'do aluno' : 'da aluna'} <span className='font-bold uppercase'>{Object.values(aluno)[1]}</span> n. bi: <span className='font-bold'>{Object.values(aluno)[4]}</span> para o ano corrente.</p>
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
                               <label htmlFor="curso">Classes<span className='text-red-500'>*</span>
                                    </label>
                                <FormControl>
                                  <select {...field} className={formConfirmacao.formState.errors.classeId?.message && `${animateShake} select-error`} onChange={(e)=>{
                                    field.onChange(parseInt(e.target.value))
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
                            control={formConfirmacao.control}
                            name='turmaId'
                            render={({field})=>(
                            <FormItem>
                                <label htmlFor="curso">Turmas<span className='text-red-500'>*</span>
                                    </label>
                                <FormControl>
                                <select {...field} className={formConfirmacao.formState.errors.turmaId?.message && `${animateShake} select-error`}onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
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
                                      turno.map((field)=>{
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
                            control={formConfirmacao.control}
                            name='metodoPagamentoId'
                            render={({field})=>(
                            <FormItem>
                                <label htmlFor="curso">Pagar em<span className='text-red-500'>*</span>
                                    </label>
                                <FormControl>
                                <select {...field} className={formConfirmacao.formState.errors.metodoPagamentoId?.message && `${animateShake} select-error`}onChange={(e)=>{field.onChange(parseInt(e.target.value))}}>
                                <option >Selecione o método</option>
                                {
                                      metodo.map((field)=>{
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
                          <p className='font-thin text-sm'>{Object.values(aluno)[1]}</p>
                      </div>
                      <div>
                          <label className='font-poppins'>número do bi</label>		
                            <p className='font-thin text-sm'>{Object.values(aluno)[4]}</p>
                      </div>
                      </div>
                      <div className="w-full flex flex-row justify-between px-2">
                      <div>
                          <label className='font-poppins'>nome do pai</label>	
                          <p className='font-thin text-sm'>{Object.values(aluno)[2]}</p>
                      </div>
                      <div>
                          <label className='font-poppins'>nome da mãe</label>
                          <p className='font-thin text-sm'>{Object.values(aluno)[3]}</p>
                      </div>
                      </div>
                      <div className="w-full flex flex-row justify-between px-2">
                      <div>
                          <label className='font-poppins'>gênero</label>
                          <p className='font-thin text-sm'>{Object.values(aluno)[6]}</p>
                      </div>
                      <div>
                          <label className='font-poppins'>data de nascimento</label>
                          <p className='font-thin text-sm'>{Object.values(aluno)[5]}</p>
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
                          <p className='font-thin text-sm'>{casa}</p>
                      </div>
                      <div>
                          <label className='font-poppins'>bairro</label>
                          <p className='font-thin text-sm'>{bairro}</p>
                      </div>
                      <div>
                          <label className='font-poppins'>rua</label>
                          <p className='font-thin text-sm'>{rua}</p>
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
                          <p className='font-thin text-sm'>{telefone}</p>
                      </div>
                      {email && 
                      <div>
                          <label className='font-poppins'>email</label>
                          <p className='font-thin text-sm'>{email}</p>
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
                            
                          matriculas.map((item)=>{return (
                          <ul key={item.id}>
                            <li>Curso: {item.curso}</li>
                            <li>Classe: {item.classe}</li>
                            <li>Turma: {item.turma}</li>
                            <li>Data: {item.createdAt}</li>
                            <li>-----------------</li>
                            </ul>)})}
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
                    
                        </td>
                      </tr>
                  ))}
              </tbody>
              <tfoot className='sticky bottom-0 bg-white"'>
              <tr>
                  <td colSpan={6} className="py-2 text-blue-500">
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

    </>)
}