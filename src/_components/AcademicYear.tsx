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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import {
  AlertCircleIcon,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  EditIcon,
  Library,
  Loader,
  PrinterIcon,
  SaveIcon,
  Search,
  Trash,
} from 'lucide-react';
import { InfoIcon } from 'lucide-react';
import { UserPlus } from 'lucide-react';
import { GraduationCap as Cursos } from 'lucide-react';
import {
  dataNascimentoZod,
  emailZod,
  nomeCompletoZod,
  telefoneZod,
  nomeCursoZod,
  descricaoZod,
  duracaoZod,
  inicio,
  termino,
  anoLectivo,
  idZod,
  matriculaAberta,
  ordem,
  classe,
  custoMatricula,
  activo,
} from '@/_zodValidations/validations';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { tdStyle, thStyle, trStyle, tdStyleButtons } from './table';
import Header from './Header';
import {
  animateBounce,
  animatePulse,
  animateShake,
} from '@/AnimationPackage/Animates';
import MostrarDialog from './MostrarDialog';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import {
  collectErrorMessages,
  getAnoAcademico,
  getAnoAcademicoId,
  patchAnoAcademico,
  postAnoAcademico,
  putAnoAcademico,
} from '@/_queries/AnoAcademico';
import axios from 'axios';
import { postTrimestres } from '@/_queries/Trimestres';
import {
  useGetAcademicQuery,
  useGetIdAcademicQuery,
  usePatchAcademic,
  usePostAcademic,
  usePostGradeToAcademic,
  usePostTerm,
  usePutAcademic,
} from '@/_queries/UseAcademicQuery';
import { Switch } from '@/components/ui/switch';
import {
  AcademicYearButton,
  EditButton,
  GradeButton,
  InfoButton,
  TermButton,
} from './MyButton';
import { useGetCurseQuery } from '@/_queries/UseCurseQuery';
import { AlertErro, AlertSucesso } from './Alert';

const TFormCreate = z.object({
  inicio: inicio,
  termino: termino,
  matriculaAberta: matriculaAberta,
});

const TFormUpdate = z.object({
  inicio: inicio,
  termino: termino,
  matriculaAberta: matriculaAberta,
  id: z.number(),
});
const TFormCreateTrimestre = z.object({
  numero: idZod,
  inicio: inicio,
  termino: termino,
});

const TFormGradeToAcademic = z.object({
  nome: classe,
  ordem: ordem,
  cursoId: idZod,
  valorMatricula: custoMatricula,
  id: z.number(),
});

export default function AcademicYear() {
  const formCreate = useForm<z.infer<typeof TFormCreate>>({
    mode: 'all',
    resolver: zodResolver(TFormCreate),
  });

  const formCreateTrimestre = useForm<z.infer<typeof TFormCreateTrimestre>>({
    mode: 'all',
    resolver: zodResolver(TFormCreateTrimestre),
  });

  const formUpdate = useForm<z.infer<typeof TFormUpdate>>({
    mode: 'all',
    resolver: zodResolver(TFormUpdate),
  });

  const formGradeToAcademic = useForm<z.infer<typeof TFormGradeToAcademic>>({
    mode: 'all',
    resolver: zodResolver(TFormGradeToAcademic),
  });

  //Post
  const { postAcademic, postError, postLevel } = usePostAcademic();
  const handleSubmitCreateAnoLectivos = async (
    data: z.infer<typeof TFormCreate>
  ) => {
    postAcademic(data);
  };

  const { postTerm, postTermError, postTermLevel } = usePostTerm();
  const handleSubmitCreateTrimestre = async (
    data: z.infer<typeof TFormCreateTrimestre>
  ) => {
    postTerm(data);
  };

  const { postGrade, postGradeError, postGradeLevel } =
    usePostGradeToAcademic();

  //Patch
  const { patchAcademic, patchError, patchLevel } = usePatchAcademic();
  const handleSubmitPatchAno = (bool) => {
    patchAcademic({ id: buscar, activo: bool, matriculaAberta: true });
  };

  //Get
  const [buscar, setBuscar] = React.useState<number>(null);
  const { data, isError, isLoading } = useGetAcademicQuery();
  const { data: dataCurse } = useGetCurseQuery();
  const { dataAcademicById, isFetched } = useGetIdAcademicQuery(buscar);

  //Put
  //Update fields wth datas
  React.useEffect(() => {
    formUpdate.setValue('inicio', dataAcademicById?.data?.inicio);
    formUpdate.setValue('termino', dataAcademicById?.data?.termino);
    formUpdate.setValue(
      'matriculaAberta',
      dataAcademicById?.data?.matriculaAberta
    );
    formUpdate.setValue('id', dataAcademicById?.data?.id);
    formGradeToAcademic.setValue('id', dataAcademicById?.data?.id);
  }, [buscar, isFetched]);

  const { putAcademic, putError, putLevel } = usePutAcademic();
  const handleSubmitUpdate = async (data: z.infer<typeof TFormUpdate>) => {
    putAcademic(data);
  };
  const putId = (id) => {
    setBuscar(id);
  };

  const colunas = ['Id', 'Nome', 'Estado', 'Ações'];

  const renderAcoes = () => (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div
            title="actualizar"
            className="relative flex justify-center items-center"
          >
            <EditButton />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-blue-600 text-xl">
              Actualizar Ano Académico
            </DialogTitle>
            <DialogDescription>
              <p className="text-base text-gray-800">
                altere uma informação do ano e em seguida click em{' '}
                <span className="font-bold text-blue-500">actualizar</span>{' '}
                quando terminar.
              </p>
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
                      className="w-full"
                      {...field}
                      value={dataAcademicById?.data?.id}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value));
                      }}
                    />
                  </FormControl>
                )}
              />

              <div className="flex flex-col w-full py-4 bg-white">
                <div className="w-full">
                  <label
                    htmlFor="inicio"
                    className="text-blue-500 text-lg font-semibold"
                  >
                    Ínicio<span className="text-red-500">*</span>
                  </label>
                  <FormField
                    control={formUpdate.control}
                    name="inicio"
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          id="inicio"
                          type="date"
                          {...field}
                          className={
                            formUpdate.formState.errors.inicio?.message &&
                            `${animateShake} input-error`
                          }
                        />
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="termino"
                    className="text-blue-500 text-lg font-semibold"
                  >
                    Término<span className="text-red-500">*</span>
                  </label>
                  <FormField
                    control={formUpdate.control}
                    name="termino"
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          id="termino"
                          type="date"
                          {...field}
                          className={
                            formUpdate.formState.errors.termino?.message &&
                            `${animateShake} input-error`
                          }
                        />
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full my-4">
                  <FormField
                    control={formUpdate.control}
                    name="matriculaAberta"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Matrícula Aberta
                          </FormLabel>
                          <div className="text-sm text-gray-500">
                            Determina se as matrículas estão abertas para este
                            período
                          </div>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Toggle matrícula aberta"
                        />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  title="actualizar"
                  className="bg-green-500 border-green-500 text-white hover:bg-green-500 font-semibold w-12"
                  type="submit"
                >
                  <SaveIcon className="w-5 h-5 absolute text-white font-extrabold" />
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="relative flex justify-center items-center cursor-pointer">
        <Popover>
          <PopoverTrigger asChild className="bg-white">
            <div
              title="ver dados"
              className="relative flex justify-center items-center cursor-pointer"
            >
              <InfoButton />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-white">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">
                  Dados do Ano Em Curso
                </h4>
                <p className="text-sm text-muted-foreground">
                  Inspecione os dados
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="maxWidth">Ínicio</label>
                  <p>{dataAcademicById?.data?.inicio}</p>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="height">Termino</label>
                  <p className="text-xs">{dataAcademicById?.data?.termino}</p>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="height">Matrícula Disponível</label>
                  <p className="text-xs">
                    {dataAcademicById?.data?.matriculaAberta
                      ? 'Disponível'
                      : 'Indisponível'}
                  </p>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="height">
                    {dataAcademicById?.data?.activo ? 'Desativar' : 'Activar'}
                  </label>
                  <Switch
                    checked={dataAcademicById?.data?.activo ? true : false}
                    onCheckedChange={(e) => {
                      handleSubmitPatchAno(e);
                    }}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
  const [pagina, setPagina] = React.useState(1);
  const [termoBusca, setTermoBusca] = React.useState('');
  const [itensPorPagina, setItensPorPagina] = React.useState<number>(5);

  const dadosFiltrados = data?.data?.data?.filter((item) =>
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
      {putLevel === 1 && <AlertSucesso message={putError} />}
      {putLevel === 2 && <AlertErro message={putError} />}
      {postGradeLevel === 1 && <AlertSucesso message={postGradeError} />}
      {postGradeLevel === 2 && <AlertErro message={postGradeError} />}
      {postTermLevel === 1 && <AlertSucesso message={postTermError} />}
      {postTermLevel === 2 && <AlertErro message={postTermError} />}
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
                <div
                  title="cadastrar Ano-Lectivos"
                  className="relative flex justify-center items-center"
                >
                  <AcademicYearButton />
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                  <DialogTitle className="text-blue-600 text-xl">
                    Cadastrar Ano Académico
                  </DialogTitle>
                  <DialogDescription>
                    <p className="text-base text-gray-800">
                      preencha o formulárioe em seguida click em{' '}
                      <span className="font-bold text-blue-500">cadastrar</span>{' '}
                      quando terminar.
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <Form {...formCreate}>
                  <form
                    onSubmit={formCreate.handleSubmit(
                      handleSubmitCreateAnoLectivos
                    )}
                  >
                    <div className="flex flex-col w-full py-4 bg-white">
                      <div className="w-full">
                        <label htmlFor="inicio">
                          Íncio<span className="text-red-500">*</span>
                        </label>
                        <FormField
                          control={formCreate.control}
                          name="inicio"
                          render={({ field }) => (
                            <FormItem>
                              <Input
                                id="inicio"
                                type="date"
                                {...field}
                                className={
                                  formCreate.formState.errors.inicio?.message &&
                                  `${animateShake} input-error`
                                }
                              />
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full">
                        <Label
                          htmlFor="termino"
                          className="text-blue-500 text-lg font-semibold"
                        >
                          Término<span className="text-red-500">*</span>
                        </Label>
                        <FormField
                          control={formCreate.control}
                          name="termino"
                          render={({ field }) => (
                            <FormItem>
                              <Input
                                id="termino"
                                type="date"
                                {...field}
                                className={
                                  formCreate.formState.errors.termino
                                    ?.message && `${animateShake} input-error`
                                }
                                min="2025-01-01"
                              />
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full my-4">
                        <FormField
                          control={formCreate.control}
                          name="matriculaAberta"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Matrícula Aberta
                                </FormLabel>
                                <div className="text-sm text-gray-500">
                                  Determina se as matrículas estão abertas para
                                  este período
                                </div>
                              </div>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-label="Toggle matrícula aberta"
                                className="data-[state=checked]:bg-blue-500"
                              />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        title="cadastrar"
                        className="bg-blue-500 border-blue-500 text-white hover:bg-blue-500 font-semibold w-12"
                        type="submit"
                      >
                        <SaveIcon className="w-5 h-5 absolute text-white font-extrabold" />
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <div
                  title="cadastrar trimestre"
                  className="relative flex justify-center items-center"
                >
                  <TermButton />
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                  <DialogTitle className="text-blue-600 text-xl">
                    Cadastrar Trimestre
                  </DialogTitle>
                  <DialogDescription>
                    <p className="text-base text-gray-800">
                      esta secção tem como finalidade adicionar um novo
                      trimestre ao ano lectivo corrente.
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <Form {...formCreateTrimestre}>
                  <form
                    onSubmit={formCreateTrimestre.handleSubmit(
                      handleSubmitCreateTrimestre
                    )}
                  >
                    <div className="flex flex-col w-full py-4 bg-white">
                      <div className="w-full">
                        <label htmlFor="numero">
                          Número<span className="text-red-500">*</span>
                        </label>
                        <FormField
                          control={formCreateTrimestre.control}
                          name="numero"
                          render={({ field }) => (
                            <FormItem>
                              <Input
                                id="numero"
                                type="number"
                                {...field}
                                className={
                                  formCreateTrimestre.formState.errors.numero
                                    ?.message && `${animateShake} input-error`
                                }
                                onChange={(e) => {
                                  field.onChange(parseInt(e.target.value));
                                }}
                              />
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="inicio"
                          className="text-blue-500 text-lg font-semibold"
                        >
                          Ínicio<span className="text-red-500">*</span>
                        </label>
                        <FormField
                          control={formCreateTrimestre.control}
                          name="inicio"
                          render={({ field }) => (
                            <FormItem>
                              <Input
                                id="inicio"
                                type="date"
                                {...field}
                                className={
                                  formCreateTrimestre.formState.errors.inicio
                                    ?.message && `${animateShake} input-error`
                                }
                              />
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="termino"
                          className="text-blue-500 text-lg font-semibold"
                        >
                          Término<span className="text-red-500">*</span>
                        </label>
                        <FormField
                          control={formCreateTrimestre.control}
                          name="termino"
                          render={({ field }) => (
                            <FormItem>
                              <Input
                                id="termino"
                                type="date"
                                {...field}
                                className={
                                  formCreateTrimestre.formState.errors.termino
                                    ?.message && `${animateShake} input-error`
                                }
                              />
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        title="cadastrar"
                        className="bg-blue-500 border-blue-500 text-white hover:bg-blue-500 font-semibold w-12"
                        type="submit"
                      >
                        <SaveIcon className="w-5 h-5 absolute text-white font-extrabold" />
                      </Button>
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
                      <div className="text-sm text-gray-500">{turno.nome}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {turno.activo ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-fullbg-red-100 text-red-800">
                          Desactivo
                        </span>
                      )}
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
              onClick={() => setPagina(Math.min(totalPaginas, pagina + 1))}
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

                {data?.data?.data?.length > 0 &&
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
                <button
                  onClick={() => setPagina(Math.min(totalPaginas, pagina + 1))}
                  disabled={pagina === totalPaginas}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md   bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 border-none"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
