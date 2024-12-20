import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import {
  AlertCircleIcon,
  AlertTriangle,
  CheckCircleIcon,
  ChevronLeft,
  ChevronRight,
  Loader,
  SaveIcon,
  Search,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  dataNascimentoZod,
  emailZod,
  nomeCompletoZod,
  telefoneZod,
  disciplinas,
  idZod,
} from '@/_zodValidations/validations';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select';
import {
  AroundDiv,
  ClassButton,
  CombineButton,
  EditButton,
  GradeButton,
  InfoButton,
  LibraryButton,
  TrashButton,
  UserPlusButton,
} from './MyButton';
import { tdStyle, thStyle, trStyle, tdStyleButtons } from './table';
import Header from './Header';
import { useHookFormMask } from 'use-mask-input';
import {
  animateBounce,
  animatePulse,
  animateShake,
} from '@/AnimationPackage/Animates';
import { collectErrorMessages } from '@/_queries/Alunos';
import MostrarDialog from './MostrarDialog';
import {
  useGetIdTeacherGradesQuery,
  useGetIdTeacherSubjectsdQuery,
  useGetIdTeacherdQuery,
  useGetTeacherQuery,
  usePostClassToTeacher,
  usePostDisMatchSubjectTeacher,
  usePostMatchSubjectTeacher,
  usePostTeacher,
  usePutTeacher,
} from '@/_queries/UseTeacherQuery';
import {
  useGetCurseQuery,
  useGetIdGradeCurseQuery,
} from '@/_queries/UseCurseQuery';
import { useGetIdClassFromGradedQuery } from '@/_queries/UseGradeQuery';
import {
  useGetIdSubjectQuery,
  useGetSubjectQuery,
} from '@/_queries/UseSubjectQuery';
import { AlertErro, AlertSucesso } from './Alert';

const TForm = z.object({
  nomeCompleto: nomeCompletoZod,
  dataNascimento: dataNascimentoZod,
  contacto: z.object({
    telefone: telefoneZod,
    email: emailZod,
  }),
  disciplinas: disciplinas,
});

const TFormUpdate = z.object({
  nomeCompleto: nomeCompletoZod,
  dataNascimento: dataNascimentoZod,
  telefone: telefoneZod,
  email: emailZod,
  id: z.number(),
});

const TFormClasse = z.object({
  idProfessor: idZod,
  disciplinaId: idZod,
  classeId: idZod,
  turmaId: idZod,
  cursoId: idZod,
});

/*Vinculo de professor e disciplina*/
const TFormConnect = z.object({
  idProfessor: z.number(),
  disciplinas: disciplinas,
  nomeDisciplinas: z.array(z.string()),
});

type FormProps = z.infer<typeof TForm>;
type FormPropsUpdate = z.infer<typeof TFormUpdate>;
export default function Teacher() {
  const form = useForm<z.infer<typeof TForm>>({
    mode: 'all',
    resolver: zodResolver(TForm),
  });

  const {
    formState: { errors },
    register,
  } = form;
  const registerWithMask = useHookFormMask(register);

  const formUpdate = useForm<z.infer<typeof TFormUpdate>>({
    mode: 'all',
    resolver: zodResolver(TFormUpdate),
  });
  const upWithMask = useHookFormMask(formUpdate.register);

  const formConnect = useForm<z.infer<typeof TFormConnect>>({
    mode: 'all',
    resolver: zodResolver(TFormConnect),
  });

  const formClasse = useForm<z.infer<typeof TFormClasse>>({
    mode: 'all',
    resolver: zodResolver(TFormClasse),
  });

  const { watch } = formClasse;
  const [fieldCurso, fieldClasse] = watch(['cursoId', 'classeId']);

  //Get
  const [buscar, setBuscar] = React.useState('');
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isLoading,
  } = useGetTeacherQuery();
  const { dataTeacherId, isFetched } = useGetIdTeacherdQuery(buscar);
  const { data: dataCurses } = useGetCurseQuery();
  const { data: dataSubjets } = useGetSubjectQuery();
  const { dataGradesCurse } = useGetIdGradeCurseQuery(fieldCurso);
  const { dataClassGradeId } = useGetIdClassFromGradedQuery(fieldClasse);
  const { dataTeacherSubjects, subjectFetched } =
    useGetIdTeacherSubjectsdQuery(buscar);
  const { dataTeacherGrades } = useGetIdTeacherGradesQuery(buscar);

  //Vincular um professor a multiplas disciplinas
  const disciplinas = dataSubjets?.pages.flatMap((page) => page.data) ?? [];
  const [selectedValues, setSelectedValues] = React.useState([]);
  const [selectedLabels, setSelectedLabels] = React.useState([]);
  const disciplinaOptions = disciplinas?.map((c) => {
    return { value: c.id, label: c.nome };
  });
  const handleChange = (selectedOptions) => {
    // Extrair valores e labels
    const values = selectedOptions.map((option) => option.value);
    setSelectedValues(values);
    const labels = selectedOptions.map((option) => option.label);
    setSelectedLabels(labels);
  };

  //Post
  const { postTeacher, postError, postLevel } = usePostTeacher();
  const handleSubmitCreate = async (data: z.infer<typeof TForm>) => {
    postTeacher(data);
  };

  const { postMatchTeacher, postMatchSubjectError, postMatchSubjectLevel } =
    usePostMatchSubjectTeacher();
  const handleSubmitConnect = async (data: z.infer<typeof TFormConnect>, e) => {
    postMatchTeacher(data);
  };

  const { postClassToTeacher, postClassToError, postClassToLevel } =
    usePostClassToTeacher();
  const handleSubmitClasse = async (data: z.infer<typeof TFormClasse>) => {
    postClassToTeacher(data);
  };

  //Put
  //Update fields wth datas
  React.useEffect(() => {
    formClasse.setValue('idProfessor', dataTeacherId?.data?.id);
    formConnect.setValue('idProfessor', dataTeacherId?.data?.id);
    formUpdate.setValue('nomeCompleto', dataTeacherId?.data?.nomeCompleto);
    formUpdate.setValue('dataNascimento', dataTeacherId?.data?.dataNascimento);
    formUpdate.setValue('telefone', dataTeacherId?.data?.contacto?.telefone);
    formUpdate.setValue('email', dataTeacherId?.data?.contacto?.email);
    formUpdate.setValue('id', dataTeacherId?.data?.id);
  }, [buscar, isFetched, subjectFetched]);

  const { putTeacher, updateError, updateLevel } = usePutTeacher();
  const handleSubmitUpdate = async (data: z.infer<typeof TFormUpdate>) => {
    putTeacher(data);
  };

  const putId = (id) => {
    setBuscar(id);
  };

  const colunas = ['Id', 'Nome', 'Data de Nasc.', 'Ações'];

  const renderAcoes = () => (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div title="actualizar" className={AroundDiv}>
            <EditButton />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Actualizar Registro</DialogTitle>
            <DialogDescription>
              altere uma informação do registro click em{' '}
              <span className="font-bold text-blue-600">actualizar</span> quando
              terminar.
            </DialogDescription>
          </DialogHeader>
          <Form {...formUpdate}>
            <form onSubmit={formUpdate.handleSubmit(handleSubmitUpdate)}>
              <FormField
                control={formUpdate.control}
                name="id"
                render={({ field }) => (
                  <FormControl>
                    <Input
                      type="hidden"
                      className={'w-full'}
                      {...field}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value));
                      }}
                    />
                  </FormControl>
                )}
              />

              <div className="flex flex-col w-full py-4 bg-white">
                <div className="w-full">
                  <label htmlFor="nome">
                    Nome Completo<span className="text-red-500">*</span>
                  </label>
                  <FormField
                    control={formUpdate.control}
                    name="nomeCompleto"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="nome"
                            className={
                              formUpdate.formState.errors.nomeCompleto
                                ?.message &&
                              'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2'
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  <label htmlFor="date">
                    Data de Nasc.<span className="text-red-500">*</span>
                  </label>

                  <FormField
                    control={formUpdate.control}
                    name="dataNascimento"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="date"
                            type="date"
                            {...field}
                            className={
                              formUpdate.formState.errors.dataNascimento
                                ?.message &&
                              'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2'
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  <label htmlFor="email">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <FormField
                    control={formUpdate.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="email"
                            type="text"
                            className={
                              formUpdate.formState.errors.email?.message &&
                              'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2'
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                  <label htmlFor="tel">
                    Telefone<span className="text-red-500">*</span>
                  </label>
                  <FormField
                    control={formUpdate.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="tel"
                            {...upWithMask('telefone', ['999999999'], {
                              required: true,
                            })}
                            className={
                              formUpdate.formState.errors.telefone?.message &&
                              'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2'
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  title="actualizar"
                  className="responsive-button bg-green-500 border-green-500 text-white hover:bg-green-500"
                  type="submit"
                >
                  <SaveIcon className="w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7 absolute text-white font-extrabold" />
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <div title="delegar turma" className={AroundDiv}>
            <ClassButton />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delegar Turma</DialogTitle>
            <DialogDescription>
              Adicione nessa secção as turmas que um professor poderá lecionar.
            </DialogDescription>
          </DialogHeader>
          <Form {...formClasse}>
            <form onSubmit={formClasse.handleSubmit(handleSubmitClasse)}>
              <div className="flex flex-col space-y-3 mb-5">
                <div className="flex flex-col">
                  <FormField
                    control={formClasse.control}
                    name="cursoId"
                    render={({ field }) => (
                      <FormItem>
                        <label htmlFor="curso">
                          Cursos<span className="text-red-500">*</span>
                        </label>
                        <FormControl>
                          <select
                            {...field}
                            id="cursos"
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                            }}
                          >
                            <option>Selecione o curso</option>
                            {dataCurses?.data?.data?.map((field) => {
                              return (
                                <option value={field.id}>{field.nome}</option>
                              );
                            })}
                          </select>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <FormField
                    control={formClasse.control}
                    name="classeId"
                    render={({ field }) => (
                      <FormItem>
                        <label htmlFor="classe">
                          Classes<span className="text-red-500">*</span>
                        </label>
                        <FormControl>
                          <select
                            id="classe"
                            {...field}
                            className={
                              formClasse.formState.errors.classeId?.message &&
                              `${animateShake} select-error`
                            }
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                            }}
                          >
                            <option>Selecione a classe</option>
                            {dataGradesCurse?.data?.data?.map((field) => {
                              return (
                                <option value={`${field.id}`}>
                                  {field.nome}
                                </option>
                              );
                            })}
                          </select>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <FormField
                    control={formClasse.control}
                    name="turmaId"
                    render={({ field }) => (
                      <FormItem>
                        <label htmlFor="turma">
                          Turmas<span className="text-red-500">*</span>
                        </label>
                        <FormControl>
                          <select
                            id="turma"
                            {...field}
                            className={
                              formClasse.formState.errors.turmaId?.message &&
                              'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-lg border-2 border-red-300 text-red-600 focus:text-red-700 focus:font-semibold focus:border-red-500 py-2 focus:outline-none rounded-md bg-white'
                            }
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                            }}
                          >
                            <option>Selecione a turma</option>
                            {dataClassGradeId?.data?.data?.map((field) => {
                              return (
                                <option value={`${field.id}`}>
                                  {field.nome} ({field?.turno?.nome})
                                </option>
                              );
                            })}
                          </select>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <FormField
                    control={formClasse.control}
                    name="disciplinaId"
                    render={({ field }) => (
                      <FormItem>
                        <label htmlFor="disciplina">
                          Disciplinas Curriculares
                          <span className="text-red-500">*</span>
                        </label>
                        <FormControl>
                          <FormControl>
                            <select
                              id="disciplina"
                              {...field}
                              className={
                                formClasse.formState.errors.disciplinaId
                                  ?.message &&
                                'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-lg border-2 border-red-300 text-red-600 focus:text-red-700 focus:font-semibold focus:border-red-500 py-2 focus:outline-none rounded-md bg-white'
                              }
                              onChange={(e) => {
                                field.onChange(parseInt(e.target.value));
                              }}
                            >
                              <option>Selecione a disciplina</option>
                              {dataTeacherSubjects?.data?.data?.map((field) => {
                                return (
                                  <option value={`${field.id}`}>
                                    {field.nome}
                                  </option>
                                );
                              })}
                            </select>
                          </FormControl>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  className="responsive-button bg-blue-600 border-blue-600 text-white hover:bg-blue-500 font-semibold"
                  type="submit"
                >
                  <SaveIcon className="w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7 absolute text-white font-extrabold" />
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <div title="vincular" className={AroundDiv}>
            <CombineButton />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[260px] sm:w-[260px] md:w-[260px] lg:w-[260px] xl:w-[260x] bg-white">
          <DialogHeader>
            <DialogTitle>
              Vincular Professor(a){' '}
              {dataTeacherSubjects?.data?.data?.nomeCompleto}
            </DialogTitle>
            <DialogDescription>
              Essa secção tem como objectivo relacionar professores em alguma
              disciplina especifíca.
            </DialogDescription>
          </DialogHeader>
          <Form {...formConnect}>
            <form onSubmit={formConnect.handleSubmit(handleSubmitConnect)}>
              <div className="flex flex-col w-full py-4 bg-white">
                <div className="w-full">
                  <FormField
                    control={formConnect.control}
                    name="disciplinas"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="disciplina" className="text-right">
                          Disciplinas
                        </Label>
                        <FormControl>
                          <Select
                            name="disciplinas"
                            isMulti
                            menuPlacement="bottom"
                            options={disciplinaOptions}
                            className="basic-multi-select"
                            onChange={handleChange}
                            classNamePrefix="Checkboxes"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <div></div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  title="vincular"
                  className="bg-blue-500 border-blue-500 text-white hover:bg-blue-500 hover:text-white w-12"
                  onClick={() => {
                    formConnect.setValue('disciplinas', selectedValues);
                    formConnect.setValue('nomeDisciplinas', selectedLabels);
                  }}
                >
                  <SaveIcon className="w-5 h-5 absolute text-white font-extrabold" />
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="relative flex justify-center items-center cursor-pointer">
        <Dialog>
          <DialogTrigger asChild>
            <div title="ver dados" className={AroundDiv}>
              <InfoButton />
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>
                Informações sobre{' '}
                {dataTeacherSubjects?.data?.data?.nomeCompleto}
              </DialogTitle>
              <DialogDescription>
                As informações relevantes do professor, são listadas aqui!
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 bg-white">
              <div className="flex flex-col w-full">
                <fieldset>
                  <legend className="text-sm">Dados Pessoal</legend>
                  <div className="w-full flex flex-col space-y-3">
                    <div className="w-full flex flex-row justify-between px-2">
                      <div>
                        <label>Nome Completo</label>
                        <p className="font-thin text-sm">
                          {dataTeacherId?.data?.nomeCompleto}
                        </p>
                      </div>
                      <div>
                        <label>Data de Nasc. </label>
                        <p className="font-thin text-sm">
                          {dataTeacherId?.data?.dataNascimento}
                        </p>
                      </div>
                    </div>
                    <fieldset>
                      <legend className=" text-sm">Contacto</legend>
                      <div className="w-full flex flex-col justify-between px-2">
                        <div>
                          <label>Telefone</label>
                          <p className="font-thin text-sm">
                            {dataTeacherId?.data?.contacto?.telefone}
                          </p>
                        </div>
                        <div>
                          {dataTeacherId?.data?.contacto?.email && (
                            <>
                              {' '}
                              <Label>E-mail</Label>
                              <p className="font-thin text-sm text-wrap">
                                {dataTeacherId?.data?.contacto?.email}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </fieldset>
              </div>
            </div>
            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );

  const [pagina, setPagina] = React.useState(1);
  const [termoBusca, setTermoBusca] = React.useState('');
  const [itensPorPagina, setItensPorPagina] = React.useState<number>(5);

  const professores = data?.pages.flatMap((page) => page.data) ?? [];
  const dadosFiltrados = professores?.filter((item) =>
    Object.values(item).some((valor) =>
      valor.toString().toLowerCase().includes(termoBusca.toLowerCase())
    )
  );

  const totalPaginas = Math.ceil(dadosFiltrados?.length / itensPorPagina);
  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const dadosPaginados = dadosFiltrados?.slice(inicio, fim);

  return (
    <section className="m-0 w-screen h-screen  bg-gray-50">
      <Header />
      {postLevel === 1 && <AlertSucesso message={postError} />}
      {postLevel === 2 && <AlertErro message={postError} />}
      {updateLevel === 1 && <AlertSucesso message={updateError} />}
      {updateLevel === 2 && <AlertErro message={updateError} />}

      {postClassToLevel === 1 && <AlertSucesso message={postClassToError} />}
      {postClassToLevel === 2 && <AlertErro message={postClassToError} />}
      {postMatchSubjectLevel === 1 && (
        <AlertSucesso message={postMatchSubjectError} />
      )}
      {postMatchSubjectLevel === 2 && (
        <AlertErro message={postMatchSubjectError} />
      )}

      <div className="w-full bg-white p-4 rounded-lg shadow">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex flex-row space-x-2">
            <div className="relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96">
              <Search className="absolute text-gray-300 w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7" />
              <Input
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className=" pl-6 indent-2"
                type="text"
                placeholder="Procure por registros..."
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <div title="cadastrar" className={AroundDiv}>
                  <UserPlusButton />
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] sm:w-[260px] md:w-[300px] lg:w-[360px] xl:w-[400px] p-4 overflow-y-auto bg-white">
                <DialogHeader>
                  <DialogTitle>Cadastrar Registro</DialogTitle>
                  <DialogDescription>
                    preencha o formulário e em seguida click em{' '}
                    <span className="font-bold text-blue-600">cadastrar</span>{' '}
                    quando terminar.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmitCreate)}>
                    <div className="flex flex-col w-full py-4 bg-white">
                      <div className="w-full">
                        <label htmlFor="nome">
                          Nome Completo<span className="text-red-500">*</span>
                        </label>
                        <FormField
                          control={form.control}
                          name="nomeCompleto"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  id="nome"
                                  type="text"
                                  {...field}
                                  className={
                                    errors.nomeCompleto?.message &&
                                    'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2'
                                  }
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-base" />
                            </FormItem>
                          )}
                        />
                        <label htmlFor="date">
                          Data de Nasc.<span className="text-red-500">*</span>
                        </label>
                        <FormField
                          control={form.control}
                          name="dataNascimento"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  id="date"
                                  type="date"
                                  {...field}
                                  className={
                                    errors.dataNascimento?.message &&
                                    'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2'
                                  }
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-base" />
                            </FormItem>
                          )}
                        />
                        <label htmlFor="email">
                          Email<span className="text-red-500">*</span>
                        </label>
                        <FormField
                          control={form.control}
                          name="contacto.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  id="email"
                                  type="email"
                                  {...field}
                                  className={
                                    errors?.contacto?.email?.message &&
                                    'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2'
                                  }
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-base" />
                            </FormItem>
                          )}
                        />
                        <label htmlFor="tel">
                          Telefone<span className="text-red-500">*</span>
                        </label>
                        <FormField
                          control={form.control}
                          name="contacto.telefone"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  id="tel"
                                  {...registerWithMask(
                                    'contacto.telefone',
                                    ['999999999'],
                                    { required: true }
                                  )}
                                  className={
                                    errors?.contacto?.telefone?.message &&
                                    'animate-shake animate-once animate-duration-150 animate-delay-100 w-full text-md border-2 border-red-300 text-red-500 focus:text-red-600 font-semibold focus:border-red-500 py-4 mb-2'
                                  }
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-base" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <FormField
                          control={form.control}
                          name="disciplinas"
                          render={({ field }) => (
                            <FormItem>
                              <label htmlFor="disciplina">
                                Leciona<span className="text-red-500">*</span>
                              </label>
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
                              <FormMessage className="text-red-500 text-base" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <div className="relative flex justify-center items-center">
                        <Button
                          className="responsive-button bg-blue-500 border-blue-500 text-white hover:bg-blue-500 font-semibold"
                          title="cadastrar"
                          onClick={() => {
                            form.setValue('disciplinas', selectedValues);
                          }}
                          type="submit"
                        >
                          <SaveIcon className="w-4 h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7 absolute text-white font-extrabold" />
                        </Button>
                      </div>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex gap-2">
            <select
              onChange={(e) => {
                setItensPorPagina(parseInt(e.target.value, 10) || 0);
              }}
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={30}>30 por página</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {colunas.map((coluna, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider"
                  >
                    {coluna}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && (
                <tr className="w-96 h-32">
                  <td
                    rowSpan={4}
                    colSpan={4}
                    className="w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl"
                  >
                    <div>
                      <Loader
                        className={`${animatePulse} inline-block .Loading-alert`}
                      />
                      <p className="text-red-500">Carregando</p>
                    </div>
                  </td>
                </tr>
              )}
              {!isLoading && (isError || dadosPaginados?.length === 0) && (
                <tr className="w-96 h-32">
                  <td
                    rowSpan={4}
                    colSpan={4}
                    className="w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl"
                  >
                    <div>
                      <AlertTriangle
                        className={`${animateBounce} inline-block triangle-alert`}
                      />
                      <p className="text-red-500">
                        Nenum Registro Foi Encontrado
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {!isError &&
                dadosPaginados?.map((turno) => (
                  <tr key={turno.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {turno.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {turno.nomeCompleto}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {turno.dataNascimento}
                      </div>
                    </td>
                    <td
                      className="py-4 whitespace-nowrap text-right text-sm font-medium flex space-x-2"
                      onClick={() => {
                        putId(turno.id);
                      }}
                    >
                      {renderAcoes()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPagina(Math.max(1, pagina - 1))}
              disabled={pagina === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Anterior
            </button>
            <button
              onClick={() => {
                fetchNextPage();
              }}
              disabled={pagina === totalPaginas}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Próxima
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{inicio + 1}</span> a{' '}
                <span className="font-medium">
                  {Math.min(fim, dadosFiltrados?.length)}
                </span>{' '}
                de <span className="font-medium">{dadosFiltrados?.length}</span>{' '}
                resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setPagina(Math.max(1, pagina - 1))}
                  disabled={pagina === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-none bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {professores?.length > 0 &&
                  [...Array(totalPaginas)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPagina(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                    ${
                      pagina === i + 1
                        ? 'z-10 bg-blue-50 border-none text-blue-600'
                        : 'bg-white border-none text-gray-500 hover:bg-gray-50'
                    }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                {hasNextPage && (
                  <button
                    onClick={() => {
                      fetchNextPage();
                      setPagina(Math.min(totalPaginas, pagina + 1));
                    }}
                    disabled={isFetchingNextPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md   bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 border-none"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
