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
import { tdStyle, thStyle, trStyle } from './table';
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
  animateFadeDown,
  animateFadeLeft,
  animatePing,
  animatePulse,
  animateShake,
} from '@/AnimationPackage/Animates';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useHookFormMask } from 'use-mask-input';
import { setCookies } from '@/_cookies/Cookies';
import MostrarDialog from './MostrarDialog';
import { useGetTermQuery } from '@/_queries/UseTermQuery';
import {
  useGetCurseQuery,
  useGetIdGradeCurseQuery,
  useGetIdSubjectsCurseQuery,
} from '@/_queries/UseCurseQuery';
import { useGetIdSubjectsGradeQuery } from '@/_queries/UseGradeQuery';
import {
  useGetIdClassFromGradedQuery,
  useGetNextGradeQuery,
} from '@/_queries/UseGradeQuery';
import {
  useGetIdStudent,
  useGetStudentByClassQuery,
  useGetStudentNotesQuery,
  usePostConfirmEnrollment,
  usePutStudent,
} from '@/_queries/UseStudentQuery';
import { useGetPaymentQuery } from '@/_queries/UsePaymentQuery';
import { AlertErro, AlertSucesso } from './Alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Award, BarChart, Calendar, Download } from 'lucide-react';
import Select from 'react-select';
const TFormStepOne = z.object({
  trimestreId: idZod,
  cursoId: idZod,
  classeId: idZod,
  disciplinaId: idZod,
  turmaId: idZod,
  alunoId: idZod,
});

export default function ExportBulletin() {
  const formStepOne = useForm<z.infer<typeof TFormStepOne>>({
    mode: 'all',
    resolver: zodResolver(TFormStepOne),
  });
  const {
    watch,
    formState: { errors },
  } = formStepOne;

  const [
    fieldTrimestreId,
    fieldCursoId,
    fieldClasseId,
    fieldTurmaId,
    fieldAlunoId,
  ] = watch(['trimestreId', 'cursoId', 'classeId', 'turmaId', 'alunoId']);

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

  const { data, isError, isLoading } = useGetStudentByClassQuery(
    fieldClasseId,
    fieldTurmaId
  );
  const { dataSubjectsGrade } = useGetIdSubjectsGradeQuery(fieldClasseId);
  console.log(dataSubjectsGrade?.data?.data?.length);

  const [buscar, setBuscar] = React.useState(null);
  const alunosportuma = data?.pages.flatMap((page) => page.data) ?? [];
  const options = alunosportuma?.map((aluno) => {
    return { value: aluno.id, label: aluno.nomeCompleto };
  });
  const handleChange = (selectedOption) => {
    setBuscar(selectedOption.value);
  };
  const { data: dataNotes } = useGetStudentNotesQuery(
    buscar,
    fieldTrimestreId,
    fieldClasseId
  );
  const disciplinaMaiorNota = dataNotes?.data?.data?.reduce((max, current) => {
    return current.nota > max.nota ? current : max;
  }, dataNotes?.data?.data?.[0] || { disciplina: null, nota: 0 });
  const somaNotas = dataNotes?.data?.data?.reduce(
    (total, item) => total + item.nota,
    0
  );
  const media = somaNotas / dataSubjectsGrade?.data?.data?.length;
  const mediaArredondada = parseFloat(media.toFixed(1));

  const step = ['Filtrar Turmas', 'Consultar Boletim'];
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [complete, setComplete] = React.useState<boolean>(false);

  const [counterTurma, setCounterTurma] = React.useState<number>(1);
  const [existeTurma, setExisteTurma] = React.useState<boolean>(false);
  return (
    <>
      <section className="m-0 w-screen h-screen  bg-gray-50">
        <Header />
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
                        name="trimestreId"
                        render={({ field }) => (
                          <FormItem>
                            <label>
                              Trimestres<span className="text-red-500">*</span>
                            </label>
                            <FormControl>
                              <select
                                {...field}
                                className={
                                  errors?.trimestreId?.message &&
                                  `${animateShake} select-error`
                                }
                                onChange={(e) => {
                                  field.onChange(parseInt(e.target.value));
                                }}
                              >
                                <option>Selecione o trimestre</option>
                                {dataTerms?.data?.data?.map((field) => {
                                  return (
                                    <option
                                      key={field.id}
                                      value={`${field.id}`}
                                    >
                                      {field.numero}˚ Trimestre
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
                                {dataGradesCurse?.data?.data?.map((field) => {
                                  return (
                                    <option
                                      key={field.id}
                                      value={`${field.id}`}
                                    >
                                      {field.nome} Classe
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
                    {!errors?.classeId && fieldClasseId && (
                      <div className={animateFadeDown}>
                        <FormField
                          control={formStepOne.control}
                          name="turmaId"
                          render={({ field }) => (
                            <FormItem>
                              <label>
                                Turmas<span className="text-red-500">*</span>
                              </label>
                              <FormControl>
                                <select
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(parseInt(e.target.value));
                                  }}
                                  className={
                                    errors.turmaId?.message &&
                                    `${animateShake} select-error`
                                  }
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
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {!errors?.classeId &&
                      !errors?.turmaId &&
                      fieldClasseId &&
                      fieldTurmaId &&
                      alunosportuma?.length > 0 && (
                        <div className={animateFadeDown}>
                          <FormField
                            control={formStepOne.control}
                            name="alunoId"
                            render={({ field }) => (
                              <FormItem>
                                <label>
                                  Alunos<span className="text-red-500">*</span>
                                </label>
                                <FormControl>
                                  <Select
                                    required
                                    options={options}
                                    onChange={handleChange}
                                    placeholder="Selecione uma opção..."
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                    <button
                      type="button"
                      onClick={() => {
                        const isStep1Valid =
                          !errors?.trimestreId &&
                          !errors?.cursoId &&
                          !errors?.turmaId &&
                          !errors?.classeId &&
                          !errors?.alunoId &&
                          fieldCursoId &&
                          fieldTurmaId &&
                          fieldClasseId &&
                          fieldTrimestreId &&
                          alunosportuma?.length > 0;
                        if (isStep1Valid) {
                          if (alunosportuma?.length > 0) {
                            currentStep === step.length
                              ? setComplete(true)
                              : setCurrentStep((prev) => prev + 1);
                          } else {
                            setExisteTurma(true);

                            existeTurma && setCounterTurma((prev) => prev + 1);
                          }
                        } else {
                          setExisteTurma(false);
                          setCurrentStep(1);
                        }
                      }}
                      className={`${animatePing} responsive-button text-blue-700 bg-white hover:text-white hover:bg-blue-700 border-blue-700`}
                    >
                      Próximo
                    </button>
                  </div>
                </form>
              </Form>
            </div>
          )}
          {currentStep === 2 && (
            <div
              className={`${animateFadeLeft} min-h-screen bg-gray-100 p-8 w-[600px]`}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-500" />
                    Notas e Avaliações
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Ano Letivo 2024{' '}
                    {dataNotes?.data?.data?.length > 0 &&
                      '- ' +
                        dataNotes?.data?.data[0]?.trimestre +
                        ' º Trimestre'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-sm"
                >
                  <Download className="h-4 w-4" />
                  Exportar Boletim
                </Button>
              </div>

              {/* Resumo Geral */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart className="h-4 w-4" />
                    Desempenho Geral
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-gray-500 mb-2 text-md">Média Geral</p>
                      <div className="text-lg font-bold text-blue-500">
                        {mediaArredondada}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 mb-2 text-md">
                        Melhor Desempenho
                      </p>
                      <div className="text-lg font-semibold line-clamp-2">
                        {disciplinaMaiorNota.disciplina} (
                        {disciplinaMaiorNota.nota})
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 mb-2 text-md">
                        Total de Disciplinas
                      </p>
                      <div
                        className="text-lg font-semibold"
                        title={dataSubjectsGrade?.data?.data?.map((sub) => {
                          return sub.nome;
                        })}
                      >
                        {dataSubjectsGrade?.data?.data?.length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs por Disciplina */}
              <Tabs
                defaultValue={dataNotes?.data?.data[0]?.disciplina}
                className="grid grid-cols-3"
              >
                <TabsList className="grid grid-cols-2 lg:grid-cols-4 col-span-1 h-full ">
                  <ul>
                    {dataNotes?.data?.data?.map((subject) => (
                      <TabsTrigger
                        key={subject.disciplina}
                        value={subject.disciplina}
                        className="border-none text-wrap  bg-transparent text-black data-[state=active]:bg-transparent data-[state=active]:text-blue-500"
                      >
                        <li className="flex items-center focus:text-rose-500">
                          <svg
                            className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                          </svg>
                          {subject.disciplina}
                        </li>
                      </TabsTrigger>
                    ))}
                  </ul>
                </TabsList>

                {dataNotes?.data?.data?.map((subject) => (
                  <TabsContent
                    key={subject.disciplina}
                    value={subject.disciplina}
                    className="col-span-2"
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl">{subject.disciplina}</h3>
                            <p className="text-sm text-gray-500">
                              Prof. Ana Silva
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              Média Trimestral
                            </p>
                            {subject.nota > 10 ? (
                              <p className="text-2xl font-bold text-blue-500">
                                {subject.nota}
                              </p>
                            ) : (
                              <p className="text-2xl font-bold text-red-500">
                                {subject.nota}
                              </p>
                            )}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {/* Progresso */}
                        <div className="mb-6">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">
                              Percentagem do Aproveitamento
                            </span>
                            <span className="text-sm">
                              {(mediaArredondada / 20) * 100}%
                            </span>
                          </div>
                          <Progress
                            value={(mediaArredondada / 20) * 100}
                            className="h-2"
                          />
                        </div>

                        {/* Próxima Avaliação */}
                        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          Próxima Avaliação:
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
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
                  className={`${animatePing} responsive-button bg-white hover:bg-gray-700 hover:text-white text-black font-semibold border-gray-700`}
                >
                  Voltar
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
