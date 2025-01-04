import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  EditIcon,
  FolderOpenIcon,
  InfoIcon,
  Loader,
  SaveIcon,
  Search,
} from 'lucide-react';
import * as React from 'react';
import {
  bairroZod,
  dataNascimentoZod,
  emailZod,
  generoZod,
  idZod,
  nomeCompletoZod,
  ruaZod,
  telefoneZod,
} from '@/_zodValidations/validations';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import Header from './Header';
import IPPUImage from './../assets/images/IPPU.png';
import './stepper.css';
import {
  animateBounce,
  animateFadeLeft,
  animatePing,
  animatePulse,
  animateShake,
} from '@/_animation/Animates';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useHookFormMask } from 'use-mask-input';
import { setCookies } from '@/_cookies/Cookies';
import { useGetTermQuery } from '@/_queries/UseTermQuery';
import {
  useGetCurseQuery,
  useGetIdGradeCurseQuery,
} from '@/_queries/UseCurseQuery';
import {
  useGetIdClassFromGradedQuery,
  useGetNextGradeQuery,
} from '@/_queries/UseGradeQuery';
import {
  useGetIdStudent,
  useGetStudentByClassQuery,
  usePostConfirmEnrollment,
  usePutStudent,
} from '@/_queries/UseStudentQuery';
import { useGetPaymentQuery } from '@/_queries/UsePaymentQuery';
import { AlertErro, AlertSucesso } from './Alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StudentEnrollment from './StudentEnrollment';
import ListAllStudent from './ListAllStudent';

const TForm = z.object({
  nomeCompleto: nomeCompletoZod,
  nomeCompletoPai: nomeCompletoZod,
  nomeCompletoMae: nomeCompletoZod,
  dataNascimento: dataNascimentoZod,
  genero: generoZod,
  endereco: z.object({
    bairro: bairroZod,
    rua: ruaZod,
    numeroCasa: z.number(),
  }),
  contacto: z.object({
    telefone: telefoneZod,
    email: emailZod,
  }),
  id: z.number(),
  classeId: idZod,
  turmaId: idZod,
});

const TFormConfirmacao = z.object({
  classeId: idZod,
  turmaId: idZod,
  metodoPagamentoId: idZod,
  id: z.number(),
});

const TFormStepOne = z.object({
  cursoId: idZod,
  classeId: idZod,
  disciplinaId: idZod,
  turmaId: idZod,
});

export default function ListStudent() {
  const formStepOne = useForm<z.infer<typeof TFormStepOne>>({
    mode: 'all',
    resolver: zodResolver(TFormStepOne),
  });
  const {
    watch,
    formState: { errors },
  } = formStepOne;

  const [fieldCursoId, fieldClasseId, fieldTurmaId] = watch([
    'cursoId',
    'classeId',
    'turmaId',
  ]);

  const form = useForm<z.infer<typeof TForm>>({
    mode: 'all',
    resolver: zodResolver(TForm),
  });

  const upWithMask = useHookFormMask(form.register);

  const formConfirmacao = useForm<z.infer<typeof TFormConfirmacao>>({
    mode: 'all',
    resolver: zodResolver(TFormConfirmacao),
  });

  //Post
  const { postConfirmError, postConfirmLevel, postConfirmStudent } =
    usePostConfirmEnrollment();
  const handleSubmitCreateConfirmacao = (
    data: z.infer<typeof TFormConfirmacao>
  ) => {
    postConfirmStudent(data);
  };

  const { putStudent, putStudentError, putStudentLevel } = usePutStudent();

  const handleSubmitUpdate = (data: z.infer<typeof TForm>) => {
    putStudent(data);
  };

  const [alunoId, setAlunoId] = React.useState<number>(null);

  //Get
  const { data: dataTerms } = useGetTermQuery();
  const { data: dataCurses } = useGetCurseQuery();
  const { data: dataPayment } = useGetPaymentQuery();
  const { dataGradesCurse } = useGetIdGradeCurseQuery(fieldCursoId);
  const { dataClassGradeId } = useGetIdClassFromGradedQuery(fieldClasseId);
  const { data: aluno, isFetched } = useGetIdStudent(alunoId);
  const { data: dataNextGrade } = useGetNextGradeQuery(fieldClasseId);
  const { dataClassGradeId: nextClass } = useGetIdClassFromGradedQuery(
    dataNextGrade?.data?.id
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isLoading,
  } = useGetStudentByClassQuery(
    fieldClasseId,
    fieldTurmaId ? fieldTurmaId : null
  );
  console.log(data);
  React.useEffect(() => {
    form.setValue('classeId', fieldClasseId);
    form.setValue('turmaId', fieldTurmaId);
    form.setValue('id', aluno?.data?.id);
    form.setValue('nomeCompleto', aluno?.data?.nomeCompleto);
    form.setValue('genero', aluno?.data?.genero);
    form.setValue('dataNascimento', aluno?.data.dataNascimento);
    form.setValue('nomeCompletoPai', aluno?.data.nomeCompletoPai);
    form.setValue('nomeCompletoMae', aluno?.data.nomeCompletoMae);
    form.setValue('endereco.bairro', aluno?.data.endereco.bairro);
    form.setValue('endereco.rua', aluno?.data.endereco.rua);
    form.setValue(
      'endereco.numeroCasa',
      parseInt(aluno?.data.endereco.numeroCasa)
    );
    form.setValue('contacto.telefone', aluno?.data.contacto.telefone);
    if (aluno?.data?.contacto?.email !== null) {
      form.setValue('contacto.email', aluno?.data?.contacto?.email);
    } else {
      form.setValue('contacto.email', '');
    }
    formConfirmacao.setValue('id', aluno?.data.id);
    formConfirmacao.setValue('classeId', dataNextGrade?.data.id);
  }, [alunoId, isFetched]);

  const colunas = ['Id', 'Nome', 'Ações'];

  const renderAcoes = () => (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div
            title="actualizar"
            className="relative flex justify-center items-center"
          >
            <EditIcon className="w-5 h-4 absolute text-white font-extrabold" />
            <Button className="h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-500 rounded-sm"></Button>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[425px] sm:w-[260px] md:w-[600px] lg:w-[780px] xl:w-[400px] overflow-y-scroll h-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-blue-600 text-xl">
              Actualização do Registro
            </DialogTitle>
            <DialogDescription>
              <p className="text-base text-gray-800">
                secção reservada para actualizar os dados do aluno click em{' '}
                <span className="font-bold text-blue-500">actualizar</span>{' '}
                quando terminar.
              </p>
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitUpdate)}>
              <div className="w-full flex flex-col justify-between ">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        type="hidden"
                        className="w-full"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value));
                        }}
                      />
                    </FormControl>
                  )}
                />
                <fieldset>
                  <div className={`${fieldDivStyle}`}>Dados Pessoal</div>
                  <div className="w-full flex flex-col ">
                    <div className="w-full flex flex-row justify-between space-x-2 mb-2">
                      <div className="w-full">
                        <label htmlFor="nome">
                          Nome
                          <span className="text-red-500">*</span>
                        </label>
                        <FormField
                          control={form.control}
                          name="nomeCompleto"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  id="nome"
                                  className={
                                    form.formState.errors.nomeCompleto
                                      ?.message && `${animateShake} input-error`
                                  }
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full">
                        <label htmlFor="genero">
                          Gênero
                          <span className="text-red-500">*</span>
                        </label>

                        <FormField
                          control={form.control}
                          name="genero"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <select
                                  {...field}
                                  id="genero"
                                  className={
                                    form.formState.errors.genero?.message &&
                                    `${animateShake} select-error`
                                  }
                                >
                                  <option value="M">M</option>
                                  <option value="F">F</option>
                                </select>
                              </FormControl>
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex w-full flex-col text-left mb-2">
                      <label htmlFor="nasc">
                        Data de Nasc.
                        <span className="text-red-500">*</span>
                      </label>
                      <FormField
                        control={form.control}
                        name="dataNascimento"
                        render={({ field }) => (
                          <FormControl>
                            <FormItem>
                              <Input
                                type="date"
                                id="nasc"
                                {...field}
                                className={
                                  form.formState.errors.dataNascimento
                                    ?.message && `${animateShake} input-error`
                                }
                              />
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          </FormControl>
                        )}
                      />
                    </div>
                    <div className="w-full flex flex-row justify-between space-x-2">
                      <div className="w-full">
                        <label htmlFor="pai">
                          Nome do Pai
                          <span className="text-red-500">*</span>
                        </label>
                        <FormField
                          control={form.control}
                          name="nomeCompletoPai"
                          render={({ field }) => (
                            <FormControl>
                              <FormItem>
                                <Input
                                  id="pai"
                                  type="text"
                                  {...field}
                                  className={
                                    form.formState.errors.nomeCompletoPai
                                      ?.message && `${animateShake} input-error`
                                  }
                                />
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            </FormControl>
                          )}
                        />
                      </div>
                      <div className="w-full">
                        <label htmlFor="mae">
                          Nome da Mãe
                          <span className="text-red-500">*</span>
                        </label>
                        <FormField
                          control={form.control}
                          name="nomeCompletoMae"
                          render={({ field }) => (
                            <FormControl>
                              <FormItem>
                                <Input
                                  id="mae"
                                  type="text"
                                  {...field}
                                  className={
                                    form.formState.errors.nomeCompletoMae
                                      ?.message && `${animateShake} input-error`
                                  }
                                />
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            </FormControl>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>
                <fieldset>
                  <div className={`${fieldDivStyle}`}>Localização</div>
                  <div className="w-full flex flex-row justify-between space-x-2">
                    <div className="w-full">
                      <label htmlFor="bairro">
                        Bairro
                        <span className="text-red-500">*</span>
                      </label>

                      <FormField
                        control={form.control}
                        name="endereco.bairro"
                        render={({ field }) => (
                          <FormControl>
                            <FormItem>
                              <Input
                                id="endereco.bairro"
                                type="text"
                                {...field}
                                className={
                                  form.formState?.errors?.endereco?.bairro
                                    ?.message && `${animateShake} input-error`
                                }
                              />
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          </FormControl>
                        )}
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="name">
                        Rua
                        <span className="text-red-500">*</span>
                      </label>
                      <FormField
                        control={form.control}
                        name="endereco.rua"
                        render={({ field }) => (
                          <FormControl>
                            <FormItem>
                              <Input
                                id="rua"
                                type="text"
                                {...field}
                                className={
                                  form.formState?.errors?.endereco?.rua
                                    ?.message && `${animateShake} input-error`
                                }
                              />
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          </FormControl>
                        )}
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="name">
                        N.Residência
                        <span className="text-red-500">*</span>
                      </label>
                      <FormField
                        control={form.control}
                        name="endereco.numeroCasa"
                        render={({ field }) => (
                          <FormControl>
                            <FormItem>
                              <Input
                                id="casa"
                                type="number"
                                {...field}
                                className={
                                  form.formState?.errors?.endereco?.numeroCasa
                                    ?.message && `${animateShake} input-error`
                                }
                                onChange={(e) => {
                                  field.onChange(parseInt(e.target.value));
                                }}
                              />
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          </FormControl>
                        )}
                      />
                    </div>
                  </div>
                </fieldset>
                <fieldset>
                  <div className={`${fieldDivStyle}`}>Contacto</div>
                  <div className="w-full flex flex-row justify-between space-x-2">
                    <div className="w-full">
                      <label htmlFor="tel">
                        Telefone
                        <span className="text-red-500">*</span>
                      </label>
                      <FormField
                        control={form.control}
                        name="contacto.telefone"
                        render={({ field }) => (
                          <FormControl>
                            <FormItem>
                              <Input
                                id="tel"
                                {...upWithMask(
                                  'contacto.telefone',
                                  ['999999999'],
                                  { required: true }
                                )}
                                className={
                                  form.formState?.errors?.contacto?.telefone
                                    ?.message && `${animateShake} input-error`
                                }
                              />
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          </FormControl>
                        )}
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="email">Email</label>
                      <FormField
                        control={form.control}
                        name="contacto.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                id="email"
                                className={
                                  form.formState?.errors?.contacto?.email
                                    ?.message && `${animateShake} input-error`
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </fieldset>
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
          <div
            title="confirmação"
            className="relative flex justify-center items-center"
          >
            <FolderOpenIcon className="w-5 h-4 absolute text-white font-extrabold" />
            <button className="h-7 px-5 bg-amber-400 text-white font-semibold hover:bg-amber-400 border-amber-400 rounded-sm"></button>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[425px] sm:w-[260px] md:w-[600px] lg:w-[780px] xl:w-[400px] overflow-y-scroll h-[500px] -mb-2 bg-white">
          <DialogHeader>
            <DialogTitle className="text-blue-600 text-xl">
              Confirmação da Matrícula
            </DialogTitle>
            <DialogDescription>
              <p className="text-base text-gray-800">
                confirma a matrícula{' '}
                {aluno?.data?.genero === 'M' ? 'do aluno' : 'da aluna'}{' '}
                <span className="font-bold uppercase">
                  {aluno?.data?.nomeCompleto}
                </span>{' '}
                n. bi:{' '}
                <span className="font-bold">{aluno?.data?.numeroBi}</span> para
                o ano corrente.
              </p>
            </DialogDescription>
          </DialogHeader>

          <Form {...formConfirmacao}>
            <form
              onSubmit={formConfirmacao.handleSubmit(
                handleSubmitCreateConfirmacao
              )}
            >
              <div className="flex flex-col space-y-5 mb-5">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <label className="text-base">
                      Confirmação para {dataNextGrade?.data?.nome} classe
                    </label>
                    <div className="text-sm text-gray-500">
                      <ul>
                        <li>Ordem: {dataNextGrade?.data?.ordem}</li>
                        <li>
                          Preço:{' '}
                          <span className="font-mono font-semibold">
                            {dataNextGrade?.data?.valorMatricula} kzs
                          </span>
                        </li>
                        <li>
                          Ano Lectivo: {dataNextGrade?.data?.anoLectivo?.nome}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <FormField
                    control={formConfirmacao.control}
                    name="turmaId"
                    render={({ field }) => (
                      <FormItem>
                        <label htmlFor="turma">
                          Turmas
                          <span className="text-red-500">*</span>
                        </label>
                        <FormControl>
                          <select
                            {...field}
                            className={
                              formConfirmacao.formState.errors.turmaId
                                ?.message && `${animateShake} select-error`
                            }
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                            }}
                          >
                            <option>Selecione a turma</option>
                            {nextClass?.data?.data.map((field) => {
                              return (
                                <option key={field} value={`${field.id}`}>
                                  {field.nome} ({field.turno.nome})
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
                    control={formConfirmacao.control}
                    name="metodoPagamentoId"
                    render={({ field }) => (
                      <FormItem>
                        <label htmlFor="pagamento">
                          Pagar em
                          <span className="text-red-500">*</span>
                        </label>
                        <FormControl>
                          <select
                            id="pagamento"
                            {...field}
                            className={
                              formConfirmacao.formState.errors.metodoPagamentoId
                                ?.message && `${animateShake} select-error`
                            }
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                            }}
                          >
                            <option>Selecione o método</option>
                            {dataPayment.data?.data?.map((field) => {
                              return (
                                <option key={field} value={`${field.id}`}>
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
              </div>

              <DialogFooter>
                <Button
                  title="nova matrícula"
                  className="responsive-button bg-blue-600 border-blue-600 text-white hover:bg-blue-500 font-semibold w-12"
                  type="submit"
                >
                  <SaveIcon className="h-4 sm:w-4 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-7 w-5 absolute text-white font-extrabold" />
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <div
            title="ver dados"
            className="relative flex justify-center items-center"
          >
            <InfoIcon className="w-5 h-4 absolute text-white font-extrabold" />
            <button className="h-7 px-5 bg-green-600 text-white font-semibold hover:bg-green-500 rounded-sm border-green-600"></button>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[425px] sm:w-[260px] md:w-[600px] lg:w-[780px] xl:w-[400px] overflow-y-scroll h-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>
              Informações sobre {aluno?.data?.nomeCompleto}
            </DialogTitle>
            <DialogDescription>
              <p>As informações relevantes do aluno, são listadas aqui! </p>
              <Link to={'/PersonInchargePage'}>
                <span className="inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
                  <span className="w-full">
                    Ver informações do encarregado!
                  </span>
                  <svg
                    className="w-4 h-4 ms-2 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </span>
              </Link>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 bg-white">
            <div className="flex flex-col w-full">
              <fieldset>
                <legend className="text-sm text-gray-700">Dados Pessoal</legend>
                <div className="w-full flex flex-col space-y-3">
                  <div className="w-full flex flex-row justify-between px-2">
                    <div>
                      <label>nome completo</label>
                      <p className="font-thin text-sm">
                        {aluno?.data?.nomeCompleto}
                      </p>
                    </div>
                    <div>
                      <label>número do bi</label>
                      <p className="font-thin text-sm">
                        {aluno?.data?.numeroBi}
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex flex-row justify-between px-2">
                    <div>
                      <label>nome do pai</label>
                      <p className="font-thin text-sm">
                        {aluno?.data?.nomeCompletoPai}
                      </p>
                    </div>
                    <div>
                      <label>nome da mãe</label>
                      <p className="font-thin text-sm">
                        {aluno?.data?.nomeCompletoMae}
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex flex-row justify-between px-2">
                    <div>
                      <label>gênero</label>
                      <p className="font-thin text-sm">{aluno?.data?.genero}</p>
                    </div>
                    <div>
                      <label>data de nascimento</label>
                      <p className="font-thin text-sm">
                        {aluno?.data?.dataNascimento}
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend className=" text-sm text-gray-800">Localização</legend>
                <div className="w-full flex flex-row justify-between px-2">
                  <div className="w-full flex flex-row justify-between px-2">
                    <div>
                      <label>número da casa</label>
                      <p className="font-thin text-sm">
                        {aluno?.data?.endereco.numeroCasa}
                      </p>
                    </div>
                    <div>
                      <label>bairro</label>
                      <p className="font-thin text-sm">
                        {aluno?.data?.endereco.bairro}
                      </p>
                    </div>
                    <div>
                      <label>rua</label>
                      <p className="font-thin text-sm">
                        {aluno?.data?.endereco?.rua}
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-sm text-gray-800">Contacto</legend>
                <div className="w-full flex flex-row justify-between px-2">
                  <div className="w-full flex flex-row justify-between px-2">
                    <div>
                      <label>Telefone</label>
                      <p className="font-thin text-sm">
                        {aluno?.data?.contacto?.telefone}
                      </p>
                    </div>
                    {aluno?.data?.contacto?.email && (
                      <div>
                        <label>email</label>
                        <p className="font-thin text-sm">
                          {aluno?.data?.contacto?.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  function putId(id) {
    setAlunoId(id);
    setCookies('idAluno', id, 1, false);
  }

  const step = ['Filtrar Turmas', 'Consultar Alunos'];
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [complete, setComplete] = React.useState<boolean>(false);

  const [pagina, setPagina] = React.useState(1);
  const [termoBusca, setTermoBusca] = React.useState('');
  const [itensPorPagina, setItensPorPagina] = React.useState<number>(5);
  const alunosporturma = data?.pages.flatMap((page) => page.data) ?? [];
  const dadosFiltrados = alunosporturma?.filter((item) =>
    Object.values(item).some((valor) =>
      valor.toString().toLowerCase().includes(termoBusca.toLowerCase())
    )
  );

  const totalPaginas = Math.ceil(dadosFiltrados?.length / itensPorPagina);
  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const dadosPaginados = dadosFiltrados?.slice(inicio, fim);

  const fieldDivStyle =
    'text-lg sm:text-base md:text-[14px] lg:text-[16px] xl:text-xl text-blue-600 mb-2 font-semibold';
  const [counterTurma, setCounterTurma] = React.useState<number>(1);
  const [existeTurma, setExisteTurma] = React.useState<boolean>(false);
  return (
    <>
      <section className="m-0 w-screen h-screen  bg-gray-50">
        <Header />
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-4 bg-transparent">
            <TabsTrigger value="students" className="flex items-center gap-2">
              Todos Estudantes
            </TabsTrigger>
            <TabsTrigger
              value="studentsbyclass"
              className="flex items-center gap-2"
            >
              Estudantes Por Turma
            </TabsTrigger>
            <TabsTrigger
              value="insertStudent"
              className="flex items-center gap-2"
            >
              Matrícular Estudantes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="students">
            <ListAllStudent />
          </TabsContent>
          <TabsContent value="insertStudent">
            <StudentEnrollment />
          </TabsContent>
          <TabsContent value="studentsbyclass">
            <div className="flex flex-col space-y-2 justify-center items-center w-full">
              <div className="flex justify-center items-center text-sm">
                <div className="flex justify-between">
                  {step?.map((step, i) => (
                    <div
                      key={i}
                      className={`step-item ${
                        currentStep === i + 1 ? 'active' : ''
                      } ${(i + 1 < currentStep || complete) && 'complete'}`}
                    >
                      <div className="step">
                        {i + 1 < currentStep || complete ? <Check /> : i + 1}
                      </div>
                      <p className="text-gray-500 text-base sm:text-xs md:text-[14px] lg:text-[16px] xl:text-lg">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {currentStep === 1 && (
                <div
                  className={`${animateFadeLeft} max-w-md sm:w-[260px] md:w-[300px] lg:w-[380px] xl:w-[400px] p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8`}
                >
                  <Form {...formStepOne}>
                    <form>
                      <div className="space-y-3 -m-2 -mt-6 -mb-4 sm:max-w-[425px]">
                        <div className="flex justify-between -mb-6">
                          <h1></h1>
                          <img
                            src={IPPUImage}
                            className="h-20 w-20"
                            alt="Ulumbo Logo"
                          />
                          {existeTurma && (
                            <AlertErro
                              message={`(${counterTurma})Turma Não possue Alunos`}
                            />
                          )}
                        </div>

                        <div>
                          <FormField
                            control={formStepOne.control}
                            name="cursoId"
                            render={({ field }) => (
                              <FormItem>
                                <label>
                                  Cursos<span className="text-red-500">*</span>
                                </label>
                                <FormControl>
                                  <select
                                    {...field}
                                    className={
                                      errors?.cursoId?.message &&
                                      `${animateShake} select-error`
                                    }
                                    onChange={(e) => {
                                      field.onChange(parseInt(e.target.value));
                                    }}
                                  >
                                    <option>Selecione o curso</option>
                                    {dataCurses?.data?.data?.map((field) => {
                                      return (
                                        <option
                                          key={field.id}
                                          value={`${field.id}`}
                                        >
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
                        <div>
                          <FormField
                            control={formStepOne.control}
                            name="classeId"
                            render={({ field }) => (
                              <FormItem>
                                <label>
                                  Classes<span className="text-red-500">*</span>
                                </label>
                                <FormControl>
                                  <select
                                    {...field}
                                    className={
                                      errors.classeId?.message &&
                                      `${animateShake} select-error`
                                    }
                                    onChange={(e) => {
                                      field.onChange(parseInt(e.target.value));
                                    }}
                                  >
                                    <option>Selecione a classe</option>
                                    {dataGradesCurse?.data?.data?.map(
                                      (field) => {
                                        return (
                                          <option
                                            key={field.id}
                                            value={`${field.id}`}
                                          >
                                            {field.nome} Classe
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            control={formStepOne.control}
                            name="turmaId"
                            render={({ field }) => (
                              <FormItem>
                                <label></label>
                                <FormControl>
                                  <select
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(parseInt(e.target.value));
                                    }}
                                  >
                                    <option>Selecione a turma</option>
                                    {dataClassGradeId?.data?.data?.map(
                                      (field) => {
                                        return (
                                          <option
                                            key={field.id}
                                            value={`${field.id}`}
                                          >
                                            {field.nome} ({field.turno.nome})
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const isStep1Valid =
                              !errors.cursoId &&
                              !errors.classeId &&
                              fieldCursoId &&
                              fieldClasseId;
                            if (isStep1Valid) {
                              if (alunosporturma?.length > 0) {
                                currentStep === step.length
                                  ? setComplete(true)
                                  : setCurrentStep((prev) => prev + 1);
                              } else {
                                setExisteTurma(true);
                                existeTurma &&
                                  setCounterTurma((prev) => prev + 1);
                              }
                            } else {
                              setExisteTurma(false);
                              setCurrentStep(1);
                            }
                          }}
                          className={`${animatePing} responsive-button bg-blue-700 hover:bg-blue-600 border-blue-700`}
                        >
                          Próximo
                        </button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
              {currentStep === 2 && (
                <div className="w-full bg-white p-4 rounded-lg shadow">
                  {postConfirmLevel === 1 && (
                    <AlertSucesso message={postConfirmError} />
                  )}
                  {postConfirmLevel === 2 && (
                    <AlertErro message={postConfirmError} />
                  )}
                  {putStudentLevel === 1 && (
                    <AlertSucesso message={putStudentError} />
                  )}
                  {putStudentLevel === 2 && (
                    <AlertErro message={putStudentError} />
                  )}
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
                              rowSpan={3}
                              colSpan={3}
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
                        {(isError || dadosPaginados?.length === 0) && (
                          <tr className="w-96 h-32">
                            <td
                              rowSpan={3}
                              colSpan={3}
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
                          dadosPaginados?.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.id}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {student.nomeCompleto}
                                </div>
                              </td>
                              <td
                                className="py-4 whitespace-nowrap text-right text-sm font-medium flex space-x-2"
                                onClick={() => {
                                  putId(student.id);
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
                          setPagina(Math.min(totalPaginas, pagina + 1));
                        }}
                        disabled={isFetchingNextPage}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Próxima
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Mostrando{' '}
                          <span className="font-medium">{inicio + 1}</span> a{' '}
                          <span className="font-medium">
                            {Math.min(fim, dadosFiltrados?.length)}
                          </span>{' '}
                          de{' '}
                          <span className="font-medium">
                            {dadosFiltrados?.length}
                          </span>{' '}
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

                          {alunosporturma?.length > 0 &&
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
              )}
            </div>

            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === step.length) {
                    setComplete(false);
                  }
                  if (currentStep > 1) {
                    setCurrentStep((prev) => prev - 1);
                    setExisteTurma(false);
                  }
                }}
                className={`${animatePing} responsive-button bg-gray-700 hover:bg-gray-600 text-white font-semibold border-gray-700`}
              >
                Voltar
              </button>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
