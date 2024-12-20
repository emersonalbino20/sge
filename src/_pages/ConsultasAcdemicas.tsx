import * as React from 'react';
import { useState } from 'react';
import {
  Search,
  GraduationCap,
  Users,
  Calendar,
  BookOpen,
  Building2,
  ClipboardList,
  FilterX,
  LucideLibrary,
  BookCheck,
  User,
  User2,
  AlertTriangle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from './../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './../components/ui/select';
import {
  useGetCurseQuery,
  useGetIdGradeCurseQuery,
  useGetIdSubjectsCurseQuery,
} from '@/_queries/UseCurseQuery';
import { z } from 'zod';
import { idZod } from '@/_zodValidations/validations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { animateBounce, animateFadeDown } from '@/AnimationPackage/Animates';
import {
  useGetIdClassFromGradedQuery,
  useGetIdSubjectsGradeQuery,
  useGetSbjtAbsentTeacherGradeQuery,
} from '@/_queries/UseGradeQuery';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
  useGetStudentAtGradeQuery,
  useGetStudentGradesQuery,
  useGetStudentHistoryQuery,
} from '@/_queries/UseStudentQuery';
import {
  useGetIdTeacherClassdQuery,
  useGetIdTeacherGradesdQuery,
  useGetIdTeacherSubjectsdQuery,
} from '@/_queries/UseTeacherQuery';

const TForm = z.object({
  cursos: idZod,
  classes: idZod,
  turmas: idZod,
});

const ConsultasAcademicas = () => {
  const form = useForm<z.infer<typeof TForm>>({
    mode: 'all',
    resolver: zodResolver(TForm),
  });

  const {
    watch,
    formState: { errors },
  } = form;

  const [fieldCurso, fieldClasse, fieldTurma] = watch([
    'cursos',
    'classes',
    'turmas',
  ]);

  //Cursos
  const { data: cursos } = useGetCurseQuery();
  const { dataSubjectsCurse } = useGetIdSubjectsCurseQuery(fieldCurso);
  const { dataGradesCurse } = useGetIdGradeCurseQuery(fieldCurso);
  const [sbjtCurse, setSbjtCurse] = React.useState(false);
  const [gradeCurse, setGradeCurse] = React.useState(false);

  //Classes
  const { dataClassGradeId } = useGetIdClassFromGradedQuery(fieldClasse);
  const { dataSubjectsGrade } = useGetIdSubjectsGradeQuery(fieldClasse);
  const { data: dataSbjAbsentTeacher } = useGetSbjtAbsentTeacherGradeQuery(
    fieldClasse,
    fieldTurma
  );
  const [sbjtGrade, setSbjtGrade] = React.useState(false);
  const [sbjAbsTeacher, setSbjAbsTeacher] = React.useState(false);

  //Turmas
  const { data: dataClassAbsTeacher } = useQuery({
    queryKey: ['classAbsentProfessor', fieldTurma],
    queryFn: () =>
      axios.get(`http://localhost:8000/api/turmas/${fieldTurma}/professores`),
    enabled: !!fieldTurma,
  });
  const [classAbsTeacher, setclassAbsTeacher] = React.useState(false);

  //Alunos
  const { data: dataStdHistory } = useGetStudentHistoryQuery(1000);
  const { data: dataStdGrades } = useGetStudentGradesQuery(1000);
  const { data: dataStdAtGrade } = useGetStudentAtGradeQuery(1000);
  const [stdHistory, setStdHistory] = React.useState(false);
  const [stdGrades, setStdGrades] = React.useState(false);
  const [stdAtGrade, setStdAtGrade] = React.useState(false);

  //Professor
  const { dataTeacherSubjects } = useGetIdTeacherSubjectsdQuery(50);
  const { data: dataTeacherClass } = useGetIdTeacherClassdQuery(
    50,
    fieldClasse
  );
  const { dataTeacherGrades } = useGetIdTeacherGradesdQuery(50);
  const [teacherSbjt, setTeacherSbjt] = React.useState(false);
  const [teacherClass, setTeacherClass] = React.useState(false);
  const [teacherGrade, setTeacherGrade] = React.useState(false);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Consultas Acadêmicas
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="professores" className="space-y-6">
            <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <TabsTrigger
                value="professores"
                className="flex items-center gap-2"
              >
                <GraduationCap className="h-4 w-4" />
                Professores
              </TabsTrigger>
              <TabsTrigger value="alunos" className="flex items-center gap-2">
                <User2 className="h-4 w-4" />
                Alunos
              </TabsTrigger>
              <TabsTrigger value="turmas" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Turmas
              </TabsTrigger>
              <TabsTrigger value="classes" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Classes
              </TabsTrigger>
              <TabsTrigger value="cursos" className="flex items-center gap-2">
                <LucideLibrary className="h-4 w-4" />
                Cursos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="professores" className="space-y-4">
              <Form {...form}>
                <form>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="cursos"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <select
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseInt(e.target.value));
                              }}
                            >
                              <option>Selecione o curso</option>
                              {cursos?.data?.data?.map((field) => {
                                return (
                                  <option value={`${field.id}`}>
                                    {field.nome}
                                  </option>
                                );
                              })}
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="classes"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <select
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseInt(e.target.value));
                              }}
                            >
                              <option>Selecione a classe</option>
                              {dataGradesCurse?.data?.data?.map((field) => {
                                return (
                                  <option value={`${field.id}`}>
                                    {field?.nome} Classe
                                  </option>
                                );
                              })}
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="alunos" className="space-y-4">
              <p>aluno</p>
            </TabsContent>
            <TabsContent value="turmas" className="space-y-4">
              <Form {...form}>
                <form>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="cursos"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <select
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseInt(e.target.value));
                              }}
                            >
                              <option>Selecione o curso</option>
                              {cursos?.data?.data?.map((field) => {
                                return (
                                  <option value={`${field.id}`}>
                                    {field.nome}
                                  </option>
                                );
                              })}
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="classes"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <select
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseInt(e.target.value));
                              }}
                            >
                              <option>Selecione a classe</option>
                              {dataGradesCurse?.data?.data?.map((field) => {
                                return (
                                  <option value={`${field.id}`}>
                                    {field?.nome} Classe
                                  </option>
                                );
                              })}
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="turmas"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <select
                              {...field}
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
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="classes" className="space-y-4">
              <Form {...form}>
                <form>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="cursos"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <select
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseInt(e.target.value));
                              }}
                            >
                              <option>Selecione o curso</option>
                              {cursos?.data?.data?.map((field) => {
                                return (
                                  <option value={`${field.id}`}>
                                    {field.nome}
                                  </option>
                                );
                              })}
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="classes"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <select
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseInt(e.target.value));
                              }}
                            >
                              <option>Selecione a classe</option>
                              {dataGradesCurse?.data?.data?.map((field) => {
                                return (
                                  <option value={`${field.id}`}>
                                    {field?.nome} Classe
                                  </option>
                                );
                              })}
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="turmas"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <select
                              {...field}
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
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="cursos" className="space-y-4">
              <Form {...form}>
                <form>
                  <FormField
                    control={form.control}
                    name="cursos"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <select
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                            }}
                          >
                            <option>Selecione o curso</option>
                            {cursos?.data?.data?.map((field) => {
                              return (
                                <option value={`${field.id}`}>
                                  {field.nome}
                                </option>
                              );
                            })}
                          </select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </TabsContent>

            {/* Conteúdo das Tabs */}
            <TabsContent value="professores" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Consulta de Professores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {fieldCurso && fieldClasse ? (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <button
                          className="p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors"
                          onClick={() => setTeacherSbjt(!teacherSbjt)}
                        >
                          <div className="flex items-center gap-2 font-medium">
                            <BookOpen className="h-5 w-5" />
                            Dísciplinas
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Visualizar todas dísciplinas que o professor leciona
                            no ano lectivo actual
                          </p>
                        </button>

                        <button
                          className="p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors"
                          onClick={() => setTeacherClass(!teacherClass)}
                        >
                          <div className="flex items-center gap-2 font-medium">
                            <Building2 className="h-5 w-5" />
                            Turmas
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Consultar turmas designadas para o professor
                          </p>
                        </button>

                        <button
                          className="p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors"
                          onClick={() => setTeacherGrade(!teacherGrade)}
                        >
                          <div className="flex items-center gap-2 font-medium">
                            <GraduationCap className="h-5 w-5" />
                            Classes
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Consultar todas as clases em que o professor leciona
                            no ano lectivo actual
                          </p>
                        </button>
                      </div>
                      <div className="w-full flex flex-col space-y-4 mt-2">
                        {teacherSbjt && (
                          <div
                            className={`${animateFadeDown} p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors`}
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-600">
                              <BookOpen className="h-5 w-5" />
                              Visualizar todas dísciplinas que o professor
                              leciona no ano lectivo actual
                            </div>
                            {dataTeacherSubjects?.data?.data?.map(
                              (value, index) => {
                                return (
                                  <ul key={index}>
                                    <li className="flex items-center focus:text-rose-500 text-slate-600">
                                      <svg
                                        className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                      </svg>
                                      <span>{value?.nome}</span>
                                    </li>
                                  </ul>
                                );
                              }
                            )}
                          </div>
                        )}
                        {teacherClass && (
                          <div
                            className={`${animateFadeDown} p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors`}
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-600">
                              <Building2 className="h-5 w-5" />
                              Visualizar turmas designadas para o professor numa
                              classe
                            </div>
                            {dataTeacherClass?.data?.data?.map(
                              (value, index) => {
                                return (
                                  <ul key={index}>
                                    <li className="flex items-center focus:text-rose-500 text-slate-600">
                                      <svg
                                        className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                      </svg>
                                      <span>Turma: {value?.nome}</span>

                                      {value?.disciplinas?.map((element) => {
                                        return (
                                          <span className="font-bold p-2">
                                            {element?.nome},
                                          </span>
                                        );
                                      })}
                                    </li>
                                  </ul>
                                );
                              }
                            )}
                          </div>
                        )}
                        {teacherGrade && (
                          <div
                            className={`${animateFadeDown} p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors`}
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-600">
                              <GraduationCap className="h-5 w-5" />
                              Vizualizar todas as clases em que o professor
                              leciona no ano lectivo actual
                            </div>
                            {dataTeacherGrades?.data?.data?.map(
                              (value, index) => {
                                return (
                                  <ul key={index}>
                                    <li className="flex items-center focus:text-rose-500 text-slate-600">
                                      <svg
                                        className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                      </svg>
                                      <span>Classe: {value?.nome} Classe</span>
                                      <span className="font-bold p-2">
                                        {value?.curso?.nome},
                                      </span>
                                      <span>
                                        Total de Turmas: {value?.totalTurmas}
                                      </span>
                                    </li>
                                  </ul>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div>Preencha Os Filtros</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alunos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informações de Alunos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <button
                      className="p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors"
                      onClick={() => setStdHistory(!stdHistory)}
                    >
                      <div className="flex items-center gap-2 font-medium">
                        <Calendar className="h-5 w-5" />
                        Histórico de Matrículas
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Consultar o histórico de matrículas do aluno
                      </p>
                    </button>

                    <button className="p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors">
                      <div className="flex items-center gap-2 font-medium">
                        <BookCheck className="h-5 w-5" />
                        Notas por Trimestre
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Consultar todas as notas do aluno por trimestre
                      </p>
                    </button>

                    <button
                      className="p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors"
                      onClick={() => setStdGrades(!stdGrades)}
                    >
                      <div className="flex items-center gap-2 font-medium">
                        <GraduationCap className="h-5 w-5" />
                        Classes
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Consultar todas as classes do aluno
                      </p>
                    </button>

                    <button
                      className="p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors"
                      onClick={() => setStdAtGrade(!stdAtGrade)}
                    >
                      <div className="flex items-center gap-2 font-medium">
                        <ClipboardList className="h-5 w-5" />
                        Matrícula
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Consultar informações relevantes da classe actual
                      </p>
                    </button>
                  </div>
                  <div className="w-full flex flex-col space-y-4 mt-2">
                    {stdHistory && (
                      <div
                        className={`${animateFadeDown} p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors`}
                      >
                        <div className="flex items-center gap-2 font-bold text-slate-600">
                          <Calendar className="h-5 w-5" />
                          Visualizar o histórico de matrículas do aluno
                        </div>
                        {dataStdHistory?.data?.data?.map((value, index) => {
                          const date = new Date(value?.createdAt);
                          const formattedDate = date.toLocaleString('pt-BR', {
                            dateStyle: 'full',
                            timeStyle: 'short',
                          });
                          return (
                            <ul key={index}>
                              <li className="flex flex-col focus:text-rose-500 text-slate-600">
                                <span>Classe: {value?.classe} Classe</span>
                                <span>Curso: {value?.curso}</span>
                                <span>Turma: {value?.turma}</span>
                                <span>Data: {formattedDate}</span>
                              </li>
                            </ul>
                          );
                        })}
                      </div>
                    )}
                    {stdGrades && (
                      <div
                        className={`${animateFadeDown} p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors`}
                      >
                        <div className="flex items-center gap-2 font-bold text-slate-600">
                          <GraduationCap className="h-5 w-5" />
                          Visualizar todas as classes do aluno
                        </div>
                        {dataStdGrades?.data?.data?.map((value, index) => {
                          return (
                            <ul key={index}>
                              <li className="flex items-center focus:text-rose-500 text-slate-600">
                                <svg
                                  className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                </svg>
                                {value?.nome} Classes
                              </li>
                            </ul>
                          );
                        })}
                      </div>
                    )}
                    {stdAtGrade && (
                      <div
                        className={`${animateFadeDown} p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors`}
                      >
                        <div className="flex items-center gap-2 font-bold text-slate-600">
                          <ClipboardList className="h-5 w-5" />
                          Visualizar informações relevantes da classe actual
                        </div>

                        <ul>
                          <li className="flex flex-col focus:text-rose-500 text-slate-600">
                            <span>
                              Classe: {dataStdAtGrade?.data?.nome} Classe
                            </span>
                            <span>Ordem: {dataStdAtGrade?.data?.ordem}</span>
                            <span>
                              Preço da matrícula:{' '}
                              <span className="font-mono">
                                {dataStdAtGrade?.data?.valorMatricula} kzs
                              </span>
                            </span>
                            <span>
                              Curso: {dataStdAtGrade?.data?.curso?.nome}
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="turmas">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informações de Turmas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {fieldCurso && fieldClasse && fieldTurma ? (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <button
                          className="p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors"
                          onClick={() => setclassAbsTeacher(!classAbsTeacher)}
                        >
                          <div className="flex items-center gap-2 font-medium">
                            <GraduationCap className="h-5 w-5" />
                            Corpo Docente
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Professores designados para a turma
                          </p>
                        </button>
                      </div>
                      <div className="w-full flex flex-col space-y-4 mt-2">
                        {classAbsTeacher && (
                          <div
                            className={`${animateFadeDown} p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors`}
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-600">
                              <GraduationCap className="h-5 w-5" />
                              Professores designados para a turma e suas
                              respectivas disciplinas
                            </div>
                            {dataClassAbsTeacher?.data?.data?.map(
                              (value, index) => {
                                return (
                                  <ul key={index}>
                                    <li className="flex items-center focus:text-rose-500 text-slate-600">
                                      <svg
                                        className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                      </svg>
                                      {value?.nomeCompleto}

                                      {value?.disciplinas?.map((element) => {
                                        return (
                                          <span className="font-bold p-2">
                                            {element?.nome},
                                          </span>
                                        );
                                      })}
                                    </li>
                                  </ul>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div>Preencha Os Filtros</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="classes">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Consulta de Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  {fieldCurso && fieldClasse && fieldTurma ? (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <button
                          className="p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors"
                          onClick={() => setSbjtGrade(!sbjtGrade)}
                        >
                          <div className="flex items-center gap-2 font-medium">
                            <BookOpen className="h-5 w-5" />
                            Disciplinas
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Visualizar todas disciplinas da classe
                          </p>
                        </button>

                        <button
                          className="p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors"
                          onClick={() => setSbjAbsTeacher(!sbjAbsTeacher)}
                        >
                          <div className="flex items-center gap-2 font-medium">
                            <GraduationCap className="h-5 w-5" />
                            Disciplinas por Professores
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Consultar todas disciplinas sem professor
                          </p>
                        </button>
                      </div>
                      <div className="w-full flex flex-col space-y-4 mt-2">
                        {sbjtGrade && (
                          <div
                            className={`${animateFadeDown} p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors`}
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-600">
                              <BookOpen className="h-5 w-5" />
                              Dísciplinas
                            </div>
                            {dataSubjectsGrade?.data?.data?.map(
                              (value, index) => {
                                return (
                                  <ul key={index}>
                                    <li className="flex items-center focus:text-rose-500 text-slate-600">
                                      <svg
                                        className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                      </svg>
                                      {value?.nome}
                                    </li>
                                  </ul>
                                );
                              }
                            )}
                          </div>
                        )}
                        {sbjAbsTeacher && (
                          <div
                            className={`${animateFadeDown} p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors`}
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-600">
                              <GraduationCap className="h-5 w-5" />
                              Disciplinas por Professores
                            </div>
                            {dataSbjAbsentTeacher?.data?.data?.map(
                              (value, index) => {
                                return (
                                  <ul key={index}>
                                    <li className="flex items-center focus:text-rose-500 text-slate-600">
                                      <svg
                                        className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                      </svg>
                                      {value?.nome}
                                    </li>
                                  </ul>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div>Preencha Os Filtros</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cursos">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Consulta de Cursos</CardTitle>
                </CardHeader>
                <CardContent>
                  {fieldCurso ? (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <button
                          className="p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors"
                          onClick={() => setSbjtCurse(!sbjtCurse)}
                        >
                          <div className="flex items-center gap-2 font-medium">
                            <BookOpen className="h-5 w-5" />
                            Disciplinas
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Visualizar todas disciplinas do curso
                          </p>
                        </button>

                        <button
                          className="p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors"
                          onClick={() => setGradeCurse(!gradeCurse)}
                        >
                          <div className="flex items-center gap-2 font-medium">
                            <GraduationCap className="h-5 w-5" />
                            Classes
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Consultar todas classes do curso
                          </p>
                        </button>
                      </div>

                      <div className="w-full flex flex-col space-y-4 mt-2">
                        {sbjtCurse && (
                          <div
                            className={`${animateFadeDown} p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors`}
                          >
                            <div className="flex items-center gap-2 font-bold text-slate-600">
                              <BookOpen className="h-5 w-5" />
                              Dísciplinas
                            </div>
                            {dataSubjectsCurse?.data?.data?.map(
                              (value, index) => {
                                return (
                                  <ul key={index}>
                                    <li className="flex items-center focus:text-rose-500 text-slate-600">
                                      <svg
                                        className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                      </svg>
                                      {value?.nome}
                                    </li>
                                  </ul>
                                );
                              }
                            )}
                          </div>
                        )}
                        {gradeCurse && (
                          <div
                            className={`${animateFadeDown} p-4 text-left border-none rounded-lg hover:bg-gray-50 shadow-sm shadow-slate-600 transition-colors`}
                          >
                            <div className="flex items-center gap-2 text-slate-600 font-bold">
                              <GraduationCap className="h-5 w-5" />
                              Classes
                            </div>
                            {dataGradesCurse?.data?.data?.map(
                              (value, index) => {
                                return (
                                  <ul key={index}>
                                    <li className="flex items-center focus:text-rose-500 text-slate-600">
                                      <svg
                                        className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                      </svg>
                                      {value?.nome} Classe
                                    </li>
                                  </ul>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div>Preencha Os Filtros</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultasAcademicas;
