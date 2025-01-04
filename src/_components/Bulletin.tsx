import {
  AlertTriangle,
  Check,
  Edit,
  Save,
  SaveIcon,
  Search,
} from 'lucide-react';
import * as React from 'react';
import { idZod } from '@/_zodValidations/validations';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
  animateShake,
} from '@/_animation/Animates';
import MostrarDialog from './MostrarDialog';
import { useGetTermQuery } from '@/_queries/UseTermQuery';
import {
  useGetIdTeacherGradesQuery,
  useGetIdTeacherSubjectsdQuery,
} from '@/_queries/UseTeacherQuery';
import { useGetIdClassFromGradedQuery } from '@/_queries/UseGradeQuery';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  useAlunosComNotas,
  useGetStudentByClassQuery,
  useGetStudentNotesQuery,
  usePostStudentNote,
  usePutStudentNote,
} from '@/_queries/UseStudentQuery';
import { AlertErro, AlertSucesso } from './Alert';

const TFormStepOne = z.object({
  classeId: idZod,
  disciplinaId: idZod,
  trimestreId: idZod,
  turmaId: idZod,
});

export default function Bulletin() {
  const formStepOne = useForm<z.infer<typeof TFormStepOne>>({
    mode: 'all',
    resolver: zodResolver(TFormStepOne),
  });

  const {
    watch,
    formState: { errors },
  } = formStepOne;

  const [fieldClasseId, fieldDisciplinaId, fieldTrimestreId, fieldTurmaId] =
    watch(['classeId', 'disciplinaId', 'trimestreId', 'turmaId']);

  //Get
  const { data: dataTerms } = useGetTermQuery();
  const { dataTeacherGrades } = useGetIdTeacherGradesQuery(50);
  const { dataTeacherSubjects } = useGetIdTeacherSubjectsdQuery(50);
  const { dataClassGradeId } = useGetIdClassFromGradedQuery(fieldClasseId);
  const { data: dataStudent } = useGetStudentByClassQuery(
    fieldClasseId,
    fieldTurmaId
  );

  const [nomeDisciplina, setNomeDisciplina] = React.useState<string>('');
  const selecionarDisciplina = (e) => {
    setNomeDisciplina(e.target.options[e.target.selectedIndex].text);
  };

  const {
    data: alunosComNotas,
    isLoading,
    isError,
    error,
  } = useAlunosComNotas({
    classeId: fieldClasseId,
    turmaId: fieldTurmaId,
    trimestreId: fieldTrimestreId,
    nomeDisciplina: nomeDisciplina,
  });

  const step = ['Filtrar Turmas', 'Inserir Nota'];
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [complete, setComplete] = React.useState<boolean>(false);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [editingStudent, setEditingStudent] = React.useState(null);
  const { postStudentNote, postNoteError, postNoteLevel } =
    usePostStudentNote();
  const { putStudentNote, putNoteError, putNoteLevel } = usePutStudentNote();

  const [notas, setNota] = React.useState(null);
  const handleSubmitCreate = async (id, nota, existe: boolean) => {
    if (existe) {
      putStudentNote({
        alunoId: id,
        turmaId: fieldTurmaId,
        disciplina: nomeDisciplina,
        classeId: fieldClasseId,
        disciplinaId: fieldDisciplinaId,
        trimestreId: fieldTrimestreId,
        nota: nota,
      });
    } else {
      postStudentNote({
        alunoId: id,
        turmaId: fieldTurmaId,
        disciplina: nomeDisciplina,
        classeId: fieldClasseId,
        disciplinaId: fieldDisciplinaId,
        trimestreId: fieldTrimestreId,
        nota: nota,
      });
    }
    setEditingStudent(true);
  };

  const filteredStudents = alunosComNotas?.filter((student) =>
    student.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <>
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
                                Trimestres
                                <span className="text-red-500">*</span>
                              </label>
                              <FormControl>
                                <select
                                  {...field}
                                  className={
                                    errors.trimestreId?.message &&
                                    `${animateShake} select-error`
                                  }
                                  onChange={(e) => {
                                    field.onChange(parseInt(e.target.value));
                                  }}
                                >
                                  <option>Selecione o trimestre</option>
                                  {dataTerms?.data?.data?.map((field) => {
                                    return (
                                      <option value={`${field.id}`}>
                                        {field.numero}° Trimestre
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
                          name="disciplinaId"
                          render={({ field }) => (
                            <FormItem>
                              <label>
                                Disciplinas
                                <span className="text-red-500">*</span>
                              </label>
                              <FormControl>
                                <select
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(parseInt(e.target.value));
                                    selecionarDisciplina(e);
                                  }}
                                  className={
                                    errors.disciplinaId?.message &&
                                    `${animateShake} select-error`
                                  }
                                >
                                  <option>Selecione a disciplina</option>
                                  {dataTeacherSubjects?.data?.data?.map(
                                    (field) => {
                                      return (
                                        <option value={`${field.id}`}>
                                          {field.nome}
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
                                  {dataTeacherGrades?.data?.data?.map(
                                    (field) => {
                                      return (
                                        <option value={`${field.id}`}>
                                          {field.nome} Classe (
                                          {field.curso.nome})
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
                                        <option value={`${field.id}`}>
                                          {field.nome}
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
                      <button
                        type="button"
                        onClick={() => {
                          const isStep1Valid =
                            !errors.classeId &&
                            !errors.disciplinaId &&
                            !errors.trimestreId &&
                            !errors.turmaId &&
                            fieldClasseId &&
                            fieldDisciplinaId &&
                            fieldTrimestreId &&
                            fieldTurmaId;
                          if (isStep1Valid) {
                            if (alunosComNotas?.length > 0) {
                              currentStep === step.length
                                ? setComplete(true)
                                : setCurrentStep((prev) => prev + 1);
                            } else {
                              setExisteTurma(true);

                              existeTurma &&
                                setCounterTurma((prev) => prev + 1);
                            }
                          } else {
                            setCurrentStep(1);
                          }
                        }}
                        className="active:animate-ping animate-once animate-duration-500 animate-delay-400 animate-ease-out bg-white hover:bg-blue-700 text-base sm:text-sm md:text-[10px] lg:text-[12px] xl:text-[16px] text-blue-700 hover:text-white font-semibold px-3 py-1 sm:py-[2px] lg:py-1 xl:py-2 border-blue-700"
                      >
                        Próximo
                      </button>
                    </div>
                  </form>
                </Form>
              </div>
            </>
          )}
          {currentStep === 2 && (
            <>
              <div className="animate-fade-left animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-in flex flex-col space-y-2 justify-center w-[90%] z-10">
                <div className="overflow-x-auto overflow-y-auto w-full  h-80 md:h-1/2 lg:h-[500px]">
                  <Card className="w-full max-w-6xl">
                    <CardHeader>
                      {/* {postNoteLevel === 1 && (
                        <AlertSucesso message={postNoteError} />
                      )}
                      {postNoteLevel === 2 && (
                        <AlertErro message={postNoteError} />
                      )}
                      {putNoteLevel === 1 && (
                        <AlertSucesso message={putNoteError} />
                      )}
                      {putNoteLevel === 2 && (
                        <AlertErro message={putNoteError} />
                      )}*/}
                      <CardTitle>Gerenciamento da Nota Trimestral</CardTitle>
                      <div className="flex items-center">
                        <Input
                          type="text"
                          placeholder="Procurar por registro..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="mr-4"
                        />
                        <Button className="mr-2 bg-green-700 font-medium hover:bg-green-600 border-green-700">
                          <Search />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead className="bg-green-700 text-white">
                            <tr>
                              <th className="p-2 border text-left">ID</th>
                              <th className="p-2 border text-left">
                                Nome Completo
                              </th>
                              <th className="p-2 border text-center">
                                Disciplina
                              </th>
                              <th className="p-2 border text-center">Nota</th>
                              <th className="p-2 border text-center">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStudents.map((student) => (
                              <tr key={student.id}>
                                <td className="p-2 border">{student.id}</td>
                                <td className="p-2 border">
                                  {student.nomeCompleto}
                                </td>
                                <td className="p-2 border text-center">
                                  {student.nomeDisciplina}
                                </td>
                                <td
                                  className="p-2 border text-right"
                                  style={{
                                    backgroundColor:
                                      student.nota !== null
                                        ? student.nota >= 15
                                          ? '#dff0d8'
                                          : student.nota < 10
                                          ? '#f2dede'
                                          : '#fcf8e3'
                                        : 'transparent',
                                    color:
                                      student.nota !== null
                                        ? student.nota >= 15
                                          ? '#3c763d'
                                          : student.nota < 10
                                          ? '#a94442'
                                          : '#8a6d3b'
                                        : 'inherit',
                                  }}
                                >
                                  {editingStudent?.id === student.id ? (
                                    <Input
                                      type="number"
                                      step="0.5"
                                      min="0"
                                      max="20"
                                      size={20}
                                      onChange={(e) => {
                                        setNota(e.target.value);
                                      }}
                                      className="w-20 text-right"
                                    />
                                  ) : student.nota !== null ? (
                                    student.nota.toFixed(2)
                                  ) : (
                                    '-'
                                  )}
                                </td>
                                <td className="p-2 border text-center">
                                  {editingStudent?.id === student.id ? (
                                    <>
                                      <Button
                                        className="mr-2 h-8 px-5 bg-green-700 border-green-700 hover:bg-green-600"
                                        onClick={() => {
                                          {
                                            student.nota
                                              ? handleSubmitCreate(
                                                  student.id,
                                                  parseFloat(notas),
                                                  true
                                                )
                                              : handleSubmitCreate(
                                                  student.id,
                                                  parseFloat(notas),
                                                  false
                                                );
                                          }
                                        }}
                                      >
                                        <Save className="w-5 h-4 text-white font-extrabold" />
                                      </Button>
                                      <Button
                                        className="mr-2 h-8 px-5 bg-green-700 border-green-700 hover:bg-green-600"
                                        onClick={() => setEditingStudent(null)}
                                      >
                                        Cancelar
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        className="mr-2 h-8 px-5 bg-green-700 border-green-700 hover:bg-green-600"
                                        onClick={() =>
                                          setEditingStudent(student)
                                        }
                                      >
                                        <Edit className="w-5 h-4  text-white font-extrabold" />
                                      </Button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {currentStep > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              currentStep === step.length && setComplete(false);

                              currentStep > 1 &&
                                setCurrentStep((prev) => prev - 1);
                            }}
                            className={`${animatePing} responsive-button bg-white hover:bg-green-700 hover:text-white text-green-700 font-semibold border-green-700`}
                          >
                            Voltar
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
          <div className="w-full flex items-center justify-between"></div>
        </div>
      </section>
    </>
  );
}
