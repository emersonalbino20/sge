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
import { Slider } from '@/components/ui/slider';
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
} from '@/_animation/Animates';
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
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font,
  Image,
} from '@react-pdf/renderer';
import { useGetPaymentQuery } from '@/_queries/UsePaymentQuery';
import { AlertErro, AlertSucesso } from './Alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Award, BarChart, Calendar, Download } from 'lucide-react';
import Select from 'react-select';
import { useGetIdClassQuery } from '@/_queries/UseClassQuery';
{
  /*import robotolight from '../assets/_fonts/Roboto_Slab/static/RobotoSlab-Light.ttf';
import robotoregular from '../assets/_fonts/Roboto_Slab/static/RobotoSlab-Regular.ttf';
import robotomedium from '../assets/_fonts/Roboto_Slab/static/RobotoSlab-Medium.ttf';
import robotobold from '../assets/_fonts/Roboto_Slab/static/RobotoSlab-Bold.ttf';*/
}

const TFormStepOne = z.object({
  trimestreId: idZod,
  cursoId: idZod,
  classeId: idZod,
  disciplinaId: idZod,
  turmaId: idZod,
  alunoId: idZod,
});

{
  /*Font.register({
  family: 'Inter',
  fonts: [
    {
      src: '/src/',
    },
    {
      src: robotolight,
      fontWeight: 300,
    },
    {
      src: robotoregular,
      fontWeight: 400,
    },
    {
      src: robotomedium,
      fontWeight: 500,
    },
    {
      src: robotobold,
      fontWeight: 700,
    },
  ],
});*/
}

const styles = StyleSheet.create({
  page: {
    padding: '20px 30px',
    fontFamily: 'Helvetica',
    fontSize: 9,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottom: '2px solid #1a365d',
    paddingBottom: 8,
    alignItems: 'center',
  },
  headerLeft: {
    width: '20%',
  },
  headerCenter: {
    width: '60%',
    textAlign: 'center',
  },
  headerRight: {
    width: '20%',
    textAlign: 'right',
  },
  logo: {
    width: 60,
    height: 60,
  },
  institutionName: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 4,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#1a365d',
    textAlign: 'center',
    marginBottom: 10,
  },
  documentDescribe: {
    fontSize: 12,
    fontWeight: 500,
    color: '#000',
    textAlign: 'left',
    marginBottom: 5,
  },
  studentInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 10,
  },
  infoItem: {
    width: '23%',
  },
  label: {
    fontSize: 8,
    color: '#4a5568',
    marginBottom: 2,
  },
  value: {
    fontSize: 9,
    fontWeight: 500,
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#1a365d',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a365d',
    color: 'white',
    padding: 6,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 6,
  },
  disciplinasCol: {
    width: '50%',
  },
  notasCol: {
    width: '50%',
    textAlign: 'center',
  },
  comportamentoSection: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#1a365d',
    padding: 8,
    height: 80,
  },
  comportamentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  comportamentoItem: {
    width: '30%',
  },
  mediaBox: {
    marginTop: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#1a365d',
    alignSelf: 'flex-end',
    width: '150px',
    height: 50,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
  },
  signatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  signature: {
    width: '30%',
  },
  signatureLine: {
    borderTop: '1px solid black',
    marginTop: 40,
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 8,
    textAlign: 'center',
  },
});

const ComportamentoField = ({ label, value, rating }) => (
  <View style={styles.comportamentoItem}>
    <Text style={styles.label}>{label}</Text>
    <Text
      style={[styles.value, { color: rating >= 3 ? '#22c55e' : '#ef4444' }]}
    >
      {value}
    </Text>
  </View>
);

const BoletimNotas = ({
  dadosAluno,
  dadosInstituicao,
  notas,
  comportamento,
  pontualidade,
}) => (
  <Document>
    <Page size="A4" orientation="portrait" style={styles.page}>
      {/* Header */}
      <View style={[styles.header, { marginBottom: 10 }]}>
        <View style={styles.headerLeft}>
          <Image style={styles.logo} src={IPPUImage} />
        </View>
        <View style={[styles.headerCenter, { width: '60%' }]}>
          <Text style={styles.institutionName}>{dadosInstituicao.nome}</Text>
          <Text style={{ fontSize: 10 }}>
            {dadosInstituicao.endereco} | {dadosInstituicao.contactos}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={{ fontSize: 8 }}>Nº: {dadosAluno.numero}</Text>
          <Text style={{ fontSize: 8 }}>
            Data: {new Date().toLocaleDateString('pt-PT')}
          </Text>
        </View>
      </View>

      <Text style={styles.documentTitle}>BOLETIM DE NOTAS E AVALIAÇÃO</Text>
      <Text style={styles.studentInfo}>
        O(A) aluno(a) {dadosAluno.nomeCompleto}, no ano lectivo{' '}
        {dadosAluno.anoLetivo}, da {dadosAluno.classe}, nº {dadosAluno.numero},
        turma {dadosAluno.turma}, sala {dadosAluno.sala}, período{' '}
        {dadosAluno.turno}, vimos através deste informar o aproveitamento que
        obteve:
      </Text>
      {/* Student Information 
			<View style={styles.studentInfo}>
				<Field label="NOME COMPLETO" value={dadosAluno.nomeCompleto} />
				<Field label="CLASSE" value={dadosAluno.classe} />
				<Field label="TURMA" value={dadosAluno.turma} />
				<Field label="SALA" value={dadosAluno.sala} />
			</View>*/}

      {/* Grades Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.disciplinasCol}>DISCIPLINAS</Text>
          <Text style={styles.notasCol}>NOTA</Text>
        </View>

        {notas.map((nota, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.disciplinasCol}>{nota.disciplina}</Text>
            <Text
              style={[
                styles.notasCol,
                { color: nota.nota >= 10 ? '#22c55e' : '#ef4444' },
              ]}
            >
              {nota.nota}
            </Text>
          </View>
        ))}
      </View>

      {/* Behavioral Assessment */}
      <View style={[styles.comportamentoSection, { height: 80 }]}>
        <Text
          style={[
            styles.label,
            { marginBottom: 5, fontSize: 10, fontWeight: 700 },
          ]}
        >
          AVALIAÇÃO COMPORTAMENTAL
        </Text>
        <View style={styles.comportamentoGrid}>
          <ComportamentoField
            label="Comportamento"
            value={comportamento.comportamentoGeral}
            rating={comportamento.comportamentoRating}
          />
          <ComportamentoField
            label="Pontualidade"
            value={pontualidade?.pontualidade}
            rating={pontualidade?.pontualidadeRating}
          />
          <ComportamentoField
            label="Assiduidade"
            value={comportamento.assiduidade}
            rating={comportamento.assiduidadeRating}
          />
        </View>
      </View>

      {/* Media Box */}
      <View style={[styles.mediaBox, { height: 50 }]}>
        <Text style={[styles.label, { marginBottom: 3 }]}>
          MÉDIA TRIMESTRAL
        </Text>
        <Text
          style={[
            styles.value,
            {
              fontSize: 12,
              color: dadosAluno.mediaTrimestral >= 10 ? '#22c55e' : '#ef4444',
            },
          ]}
        >
          {dadosAluno.mediaTrimestral.toFixed(1)} valores
        </Text>
      </View>
      {/* Footer with signatures */}
      <View style={styles.footer}>
        <View style={styles.signatures}>
          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>O(A) Professor(a)</Text>
          </View>
          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>O(A) Director(a) de Turma</Text>
          </View>
          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>
              O(A) Encarregado(a) de Educação
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
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
  //console.log(dataSubjectsGrade?.data?.data?.length);

  const [buscar, setBuscar] = React.useState(null);
  const [label, setLabel] = React.useState(null);
  const alunosportuma = data?.pages.flatMap((page) => page.data) ?? [];
  const options = alunosportuma?.map((aluno) => {
    return { value: aluno.id, label: aluno.nomeCompleto };
  });
  const handleChange = (selectedOption) => {
    setBuscar(selectedOption.value);
    setLabel(selectedOption.label);
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

  //Data for export bulletin
  const { dataClass } = useGetIdClassQuery(fieldTurmaId);
  console.log(dataClass?.data?.classe?.nome);
  const dadosInstituicao = {
    nome: 'INSTITUTO POLITÉCNICO PRIVADO ULUMBO',
    endereco: 'Rua Principal, nº 123 - Luanda, Angola',
    contactos: 'Tel: +244 923 456 789 | example@email.com',
  };

  const dadosAluno = {
    numero: 'A2024/0001',
    nomeCompleto: label,
    classe: dataClass?.data?.classe?.nome,
    turma: dataClass?.data?.nome,
    sala: dataClass?.data?.sala?.nome,
    turno: dataClass?.data?.turno?.nome,
    anoLetivo: '2024',
    mediaTrimestral: mediaArredondada,
  };

  const notas = dataNotes?.data?.data;
  const avali = {
    comportamentoGeral: 'Muito Bom',
    comportamentoRating: 4,
    pontualidade: 'Excelente',
    pontualidadeRating: 5,
    assiduidade: 'Muito Bom',
    assiduidadeRating: 4,
  };
  const [comportamentoStd, setComportamentoStd] = React.useState(50);
  const getFeedback = (val: number) => {
    if (val === 0) return { pontualidade: 'Baixa', pontualidadeRating: 1 };
    if (val > 0 && val < 50)
      return { pontualidade: 'Suficiente', pontualidadeRating: 2 };
    if (val >= 50 && val < 80)
      return { pontualidade: 'Boa', pontualidadeRating: 3 };
    if (val >= 80 && val <= 100)
      return { pontualidade: 'Muito Boa', pontualidadeRating: 4 };
  };

  const generatePDF = async () => {
    try {
      const blob = await pdf(
        <BoletimNotas
          dadosAluno={dadosAluno}
          dadosInstituicao={dadosInstituicao}
          notas={notas}
          comportamento={avali}
          pontualidade={getFeedback(comportamentoStd)}
        />
      ).toBlob();
      if (!blob) throw new Error('Falha ao gerar o blob do PDF.');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      console.log('success');
    } catch (error) {
      console.log('error to generate pdf:', error);
    }
  };

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
                  onClick={generatePDF}
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
                        <div className="w-full max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
                          <h2 className="text-lg font-semibold text-gray-700 mb-2">
                            Avaliação da Pontualidade
                          </h2>
                          <Slider
                            defaultValue={[comportamentoStd]}
                            max={100}
                            step={25}
                            onValueChange={(val) => setComportamentoStd(val[0])}
                          />
                          <p className="mt-2 text-center font-medium text-gray-900">
                            {getFeedback(comportamentoStd)?.pontualidade}
                          </p>
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
