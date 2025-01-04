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
import IPPUImage from './../assets/images/IPPU.png';
import { animateBounce, animatePulse } from '@/_animation/Animates';
import { setCookies } from '@/_cookies/Cookies';
import {
  useGetIdClassFromGradedQuery,
  useGetNextGradeQuery,
} from '@/_queries/UseGradeQuery';
import {
  useGetAllStudentsQuery,
  useGetIdStudent,
  useGetStudentAtGradeQuery,
} from '@/_queries/UseStudentQuery';

export default function ListAllStudent() {
  const [alunoId, setAlunoId] = React.useState<number>(null);

  //Get

  const { data: aluno, isFetched } = useGetIdStudent(alunoId);
  const { data: dataStdAtGrade } = useGetStudentAtGradeQuery(alunoId);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isLoading,
  } = useGetAllStudentsQuery();

  const colunas = [
    'Id',
    'Nome',
    'Número do bi',
    'Gênero',
    'Data de Nasc.',
    'Ações',
  ];

  const renderAcoes = () => (
    <>
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
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              Informações sobre {aluno?.data?.nomeCompleto}
            </DialogTitle>
            <DialogDescription>
              <p>As informações relevantes do aluno, são listadas aqui! </p>
              <Link to={'/PersonInchargePage'}>
                <span className="inline-flex items-center justify-center p-2 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
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
                <legend className="text-sm text-gray-800">
                  Dados da Matrícula
                </legend>
                <div className="w-full flex flex-row justify-between px-2">
                  <div className="w-full flex flex-row justify-between px-2">
                    <div>
                      <label>Classe</label>
                      <p className="font-thin text-sm">
                        {dataStdAtGrade?.data?.nome}
                      </p>
                    </div>
                    <div>
                      <label>Curso</label>
                      <p className="font-thin text-sm">
                        {dataStdAtGrade?.data?.curso?.nome}
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

  const [pagina, setPagina] = React.useState(1);
  const [termoBusca, setTermoBusca] = React.useState('');
  const [itensPorPagina, setItensPorPagina] = React.useState<number>(5);
  const alunos = data?.pages.flatMap((page) => page.data) ?? [];
  const dadosFiltrados = alunos?.filter((item) =>
    Object.values(item).some((valor) =>
      valor.toString().toLowerCase().includes(termoBusca.toLowerCase())
    )
  );

  const totalPaginas = Math.ceil(dadosFiltrados?.length / itensPorPagina);
  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const dadosPaginados = dadosFiltrados?.slice(inicio, fim);

  return (
    <>
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
                    rowSpan={6}
                    colSpan={6}
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
                    rowSpan={6}
                    colSpan={6}
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
                        {student?.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {student?.nomeCompleto}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {student?.numeroBi}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {student.genero}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {student.dataNascimento}
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

                {alunos?.length > 0 &&
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
    </>
  );
}
