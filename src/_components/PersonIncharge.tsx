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
import {
  UserPlus,
  Trash,
  InfoIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  EditIcon,
  PrinterIcon,
  SaveIcon,
  AlertTriangle,
  Search,
  Loader,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  emailZod,
  telefoneZod,
  ruaZod,
  bairroZod,
  numeroCasaZod,
  idZod,
  nomeCompletoEncarregadoZod,
} from '@/_zodValidations/validations';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCookies, removeCookies } from '@/_cookies/Cookies';
import { Link } from 'react-router-dom';
import Header from './Header';
import { useHookFormMask } from 'use-mask-input';
import {
  animateBounce,
  animatePulse,
  animateShake,
} from '@/_animation/Animates';
import MostrarDialog from './MostrarDialog';
import { useGetParentQuery } from '@/_queries/UseParentQuery';
import {
  useGetIdGuardianStudent,
  usePostGuardianStudent,
} from '@/_queries/UseStudentQuery';
import {
  useDeletePersonIncharge,
  useGetIdPersonInchargeQuery,
  usePutPersonIncharge,
} from '@/_queries/UsePersonInchargeQuery';
import {
  EditButton,
  InfoButton,
  TrashButton,
  UserPlusButton,
} from './MyButton';
import { AlertErro, AlertSucesso } from './Alert';

const TForm = z.object({
  nomeCompleto: nomeCompletoEncarregadoZod,
  parentescoId: z.number(),
  endereco: z.object({
    bairro: bairroZod,
    rua: ruaZod,
    numeroCasa: numeroCasaZod,
  }),
  contacto: z.object({
    telefone: telefoneZod,
    email: emailZod,
  }),
});

const TFormUpdate = z.object({
  nomeCompleto: nomeCompletoEncarregadoZod,
  parentescoId: z.number(),
  endereco: z.object({
    bairro: bairroZod,
    rua: ruaZod,
    numeroCasa: numeroCasaZod,
  }),
  contacto: z.object({
    telefone: telefoneZod,
    email: emailZod,
  }),
  responsavelId: z.number(),
});

const TFormDelete = z.object({
  responsavelId: idZod,
});

type FormProps = z.infer<typeof TForm>;
type FormPropsUpdate = z.infer<typeof TFormUpdate>;
type FormPropsDelete = z.infer<typeof TFormDelete>;
export default function PersonIncharge() {
  const form = useForm<z.infer<typeof TForm>>({
    mode: 'all',
    resolver: zodResolver(TForm),
  });
  const { register } = form;
  const registerWithMask = useHookFormMask(register);
  const formUpdate = useForm<z.infer<typeof TFormUpdate>>({
    mode: 'all',
    resolver: zodResolver(TFormUpdate),
  });
  const upWithMask = useHookFormMask(formUpdate.register);
  const formDelete = useForm<z.infer<typeof TFormDelete>>({
    mode: 'all',
    resolver: zodResolver(TFormDelete),
  });

  //Post
  const {
    postGuardianStudent,
    postGuardianStudentError,
    postGuardianStudentLevel,
  } = usePostGuardianStudent();
  const handleSubmitCreate = (data: z.infer<typeof TForm>) => {
    postGuardianStudent(data);
  };

  //Delete
  const { deletePersonIncharge, deleteLevel, deleteError } =
    useDeletePersonIncharge();
  const handleSubmitDelete = (data: z.infer<typeof TFormDelete>) => {
    deletePersonIncharge(data);
  };

  //Get
  const [buscar, setBuscar] = React.useState('');
  const { dataPersonInchargeId, isFetched } =
    useGetIdPersonInchargeQuery(buscar);
  const { data: dataParent } = useGetParentQuery();
  const { data, isError, isLoading } = useGetIdGuardianStudent();
  //Put
  //Update fields wth datas
  React.useEffect(() => {
    formUpdate.setValue(
      'nomeCompleto',
      dataPersonInchargeId?.data?.nomeCompleto
    );
    formUpdate.setValue(
      'contacto.telefone',
      dataPersonInchargeId?.data?.contacto.telefone
    );
    if (dataPersonInchargeId?.data?.contacto.email != null) {
      formUpdate.setValue(
        'contacto.email',
        dataPersonInchargeId?.data?.contacto.email
      );
    } else {
      formUpdate.setValue('contacto.email', '');
    }
    formUpdate.setValue(
      'endereco.bairro',
      dataPersonInchargeId?.data?.endereco?.bairro
    );
    formUpdate.setValue(
      'endereco.rua',
      dataPersonInchargeId?.data?.endereco?.rua
    );
    formUpdate.setValue(
      'endereco.numeroCasa',
      parseInt(dataPersonInchargeId?.data?.endereco?.numeroCasa)
    );
    formUpdate.setValue('responsavelId', dataPersonInchargeId?.data?.id);
    formDelete.setValue('responsavelId', dataPersonInchargeId?.data?.id);
  }, [buscar, isFetched]);

  const { putPersonIncharge, putPersonInchargeError, putPersonInchargeLevel } =
    usePutPersonIncharge();

  const handleSubmitUpdate = (data: z.infer<typeof TFormUpdate>) => {
    putPersonIncharge(data);
  };

  const putId = (id) => {
    setBuscar(id);
  };
  const colunas = ['Id', 'Nome', 'Ações'];
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
        <DialogContent className="sm:max-w-[525px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-blue-600 text-xl">
              Actualizar Registro
            </DialogTitle>
            <DialogDescription>
              <p className="text-base text-gray-800">
                altere uma informação do registro click em{' '}
                <span className="font-bold text-blue-500">actualizar</span>{' '}
                quando terminar.
              </p>
            </DialogDescription>
          </DialogHeader>
          <Form {...formUpdate}>
            <form onSubmit={formUpdate.handleSubmit(handleSubmitUpdate)}>
              <div className="w-full flex flex-col justify-between  ">
                <fieldset>
                  <legend className="text-blue-600 text-xl">
                    Dados Pessoal
                  </legend>
                  <div className="w-full flex flex-col ">
                    <div className="w-full flex flex-row justify-between space-x-2 ">
                      <div className="w-full">
                        <label htmlFor="nome">
                          Nome Completo
                          <span className="text-red-500">*</span>
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
                                    `${animateShake} 
                              input-error`
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
                        <label htmlFor="parentesco">
                          Parentesco
                          <span className="text-red-500">*</span>
                        </label>
                        <FormField
                          control={formUpdate.control}
                          name="parentescoId"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <select
                                  id="parentesco"
                                  {...field}
                                  className={
                                    formUpdate.formState.errors.parentescoId
                                      ?.message &&
                                    `${animateShake} 
                select-error`
                                  }
                                  onChange={(e) => {
                                    field.onChange(parseInt(e.target.value));
                                  }}
                                >
                                  {dataParent?.data?.data?.map((field) => {
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
                    </div>
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="text-blue-600 text-xl">Localização</legend>
                  <div className="w-full flex flex-row justify-between space-x-2">
                    <div className="w-full">
                      <label htmlFor="bairro">
                        Bairro
                        <span className="text-red-500">*</span>
                      </label>

                      <FormField
                        control={formUpdate.control}
                        name="endereco.bairro"
                        render={({ field }) => (
                          <FormControl>
                            <FormItem>
                              <Input
                                id="bairro"
                                type="text"
                                {...field}
                                className={
                                  formUpdate.formState?.errors?.endereco?.bairro
                                    ?.message &&
                                  `${animateShake} 
                  input-error`
                                }
                              />
                              <FormMessage className="text-red-500 text-xs" />
                            </FormItem>
                          </FormControl>
                        )}
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="rua">
                        Rua
                        <span className="text-red-500">*</span>
                      </label>
                      <FormField
                        control={formUpdate.control}
                        name="endereco.rua"
                        render={({ field }) => (
                          <FormControl>
                            <FormItem>
                              <Input
                                id="rua"
                                type="text"
                                {...field}
                                className={
                                  formUpdate.formState?.errors?.endereco?.rua
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
                        Residên.
                        <span className="text-red-500">*</span>
                      </label>

                      <FormField
                        control={formUpdate.control}
                        name="endereco.numeroCasa"
                        render={({ field }) => (
                          <FormControl>
                            <FormItem>
                              <Input
                                id="numeroCasa"
                                type="number"
                                {...field}
                                className={
                                  formUpdate.formState?.errors?.endereco
                                    ?.numeroCasa?.message &&
                                  `${animateShake} 
                  input-error`
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
                  <legend className="text-blue-600 text-xl">Contacto</legend>
                  <div className="w-full flex flex-row justify-between space-x-2">
                    <div className="w-full">
                      <label htmlFor="tel">
                        Telefone
                        <span className="text-red-500">*</span>
                      </label>
                      <FormField
                        control={formUpdate.control}
                        name="contacto.telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                id="tel"
                                {...upWithMask(
                                  'contacto.telefone',
                                  ['999999999'],
                                  { required: true }
                                )}
                                className={
                                  formUpdate.formState?.errors?.contacto
                                    ?.telefone?.message &&
                                  `${animateShake} 
                    input-error`
                                }
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="email">
                        Email
                        <span className="text-red-500">*</span>
                      </label>
                      <FormField
                        control={formUpdate.control}
                        name="contacto.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                id="email"
                                className={
                                  formUpdate.formState?.errors?.contacto?.email
                                    ?.message &&
                                  `${animateShake} 
                    input-error`
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

      <Dialog>
        <DialogTrigger asChild>
          <div
            title="excluir"
            className="relative flex justify-center items-center"
          >
            <TrashButton />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Excluir Registro</DialogTitle>
            <DialogDescription>
              <p>Caso queira exluir o registro, basta confirmar em excluir.</p>
            </DialogDescription>
            <hr />
          </DialogHeader>
          <Form {...formDelete}>
            <form onSubmit={formDelete.handleSubmit(handleSubmitDelete)}>
              <FormField
                control={formDelete.control}
                name="responsavelId"
                render={({ field }) => (
                  <FormControl>
                    <FormItem>
                      <Input
                        id="id"
                        type="hidden"
                        {...field}
                        className="w-full"
                        min={0}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value));
                        }}
                      />
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  </FormControl>
                )}
              />
              <DialogFooter>
                <Button
                  className="h-8 bg-red-500 border-red-500 text-white hover:bg-red-500 font-semibold"
                  type="submit"
                >
                  Excluir
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
            <InfoButton />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>
              {dataPersonInchargeId?.data?.nomeCompleto},{' '}
              {dataPersonInchargeId?.data?.parentesco}
            </DialogTitle>
            <DialogDescription>
              As informações relevantes do encarregado, são listadas aqui!
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 bg-white">
            <div className="flex flex-col w-full">
              <fieldset>
                <legend className="text-sm">Localização</legend>
                <div className="w-full flex flex-row justify-between px-2">
                  <div className="w-full flex flex-row justify-between px-2">
                    <div>
                      <label>número da casa</label>
                      <p className="font-thin text-sm">
                        {dataPersonInchargeId?.data?.endereco?.numeroCasa}
                      </p>
                    </div>
                    <div>
                      <label>bairro</label>
                      <p className="font-thin text-sm">
                        {dataPersonInchargeId?.data?.endereco?.bairro}
                      </p>
                    </div>
                    <div>
                      <label>rua</label>
                      <p className="font-thin text-sm">
                        {dataPersonInchargeId?.data?.endereco?.rua}
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-sm">Contacto</legend>
                <div className="w-full flex flex-row justify-between px-2">
                  <div className="w-full flex flex-row justify-between px-2">
                    <div>
                      <label>Telefone</label>
                      <p className="font-thin text-sm">
                        {dataPersonInchargeId?.data?.contacto?.telefone}
                      </p>
                    </div>
                    {dataPersonInchargeId?.data?.contacto?.email && (
                      <div>
                        <label>email</label>
                        <p className="font-thin text-sm">
                          {dataPersonInchargeId?.data?.contacto?.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
    <>
      {!getCookies('idAluno') ? (
        <div className="m-0 w-screen h-screen  bg-gray-50 flex items-center justify-center">
          <div className="w-full text-center text-4xl text-red-600 md:text-2xl lg:text-2xl">
            <div>
              <AlertTriangle
                className={`${animateBounce} inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12`}
              />
              <p className="text-red-500">ACESSO INVÁLIDO</p>
              <p className="text-red-500 italic font-semibold text-sm cursor-pointer">
                <Link to={'/StudentListPage'}>Lista dos Alunos</Link>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <section className="m-0 w-screen h-screen  bg-gray-50">
          <Header />
          {postGuardianStudentLevel === 1 && (
            <AlertSucesso message={postGuardianStudentError} />
          )}
          {postGuardianStudentLevel === 2 && (
            <AlertErro message={postGuardianStudentError} />
          )}
          {putPersonInchargeLevel === 1 && (
            <AlertSucesso message={putPersonInchargeError} />
          )}
          {putPersonInchargeLevel === 2 && (
            <AlertErro message={putPersonInchargeError} />
          )}
          {deleteLevel === 1 && <AlertSucesso message={deleteError} />}
          {deleteLevel === 2 && <AlertErro message={deleteError} />}
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
                      title="cadastrar"
                      className="relative flex justify-center items-center"
                    >
                      <UserPlusButton />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]  bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-blue-600 text-xl">
                        Cadastrar Regstro
                      </DialogTitle>
                      <DialogDescription>
                        <p className="text-base text-gray-800">
                          preencha o formulário e em seguida click em{' '}
                          <span className="font-bold text-blue-500">
                            cadastrar
                          </span>{' '}
                          quando terminar.
                        </p>
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleSubmitCreate)}>
                        <div className="w-full flex flex-col justify-between  ">
                          <fieldset>
                            <legend className="text-blue-600 text-xl">
                              Dados Pessoal
                            </legend>
                            <div className="w-full flex flex-col ">
                              <div className="w-full flex flex-row justify-between space-x-2 ">
                                <div className="w-full">
                                  <label htmlFor="nome">
                                    Nome<span className="text-red-500">*</span>
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
                                                ?.message &&
                                              `${animateShake} 
      input-error`
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
                                  <label htmlFor="parentesco">
                                    Parentesco
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <FormField
                                    control={form.control}
                                    name="parentescoId"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <select
                                            id="parentesco"
                                            {...field}
                                            className={
                                              form.formState.errors.parentescoId
                                                ?.message &&
                                              `${animateShake} 
                select-error`
                                            }
                                            onChange={(e) => {
                                              field.onChange(
                                                parseInt(e.target.value)
                                              );
                                            }}
                                          >
                                            <option>Selecione o grau</option>
                                            {dataParent?.data?.data?.map(
                                              (field, index) => {
                                                return (
                                                  <option
                                                    key={index}
                                                    value={`${field.id}`}
                                                  >
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
                              </div>
                            </div>
                          </fieldset>
                          <fieldset>
                            <legend className="text-blue-600 text-xl">
                              Localização
                            </legend>
                            <div className="w-full flex flex-row justify-between space-x-2">
                              <div className="w-full">
                                <label htmlFor="bairro">
                                  Bairro<span className="text-red-500">*</span>
                                </label>
                                <FormField
                                  control={form.control}
                                  name="endereco.bairro"
                                  render={({ field }) => (
                                    <FormControl>
                                      <FormItem>
                                        <Input
                                          id="bairro"
                                          type="text"
                                          {...field}
                                          className={
                                            form.formState?.errors?.endereco
                                              ?.bairro?.message &&
                                            `${animateShake} 
      input-error`
                                          }
                                        />
                                        <FormMessage className="text-red-500 text-xs" />
                                      </FormItem>
                                    </FormControl>
                                  )}
                                />
                              </div>
                              <div className="w-full">
                                <label htmlFor="rua">
                                  Rua<span className="text-red-500">*</span>
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
                                            form.formState?.errors?.endereco
                                              ?.rua?.message &&
                                            `${animateShake} 
      input-error`
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
                                  N. da Residência
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
                                            form.formState?.errors?.endereco
                                              ?.numeroCasa?.message &&
                                            `${animateShake} 
      input-error`
                                          }
                                          onChange={(e) => {
                                            field.onChange(
                                              parseInt(e.target.value)
                                            );
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
                            <legend className="text-blue-600 text-xl">
                              Contacto
                            </legend>
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
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          {...registerWithMask(
                                            'contacto.telefone',
                                            ['999999999'],
                                            { required: true }
                                          )}
                                          className={
                                            form.formState?.errors?.contacto
                                              ?.telefone?.message &&
                                            `${animateShake} 
      input-error`
                                          }
                                        />
                                      </FormControl>
                                      <FormMessage className="text-red-500 text-xs" />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="w-full">
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
                                          className={
                                            form.formState?.errors?.contacto
                                              ?.email?.message &&
                                            `${animateShake} 
      input-error`
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
                  {(isError || dadosPaginados?.length === 0) && (
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
                    dadosPaginados?.map((responsavel) => (
                      <tr key={responsavel.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {responsavel.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {responsavel.nomeCompleto}
                          </div>
                        </td>
                        <td
                          className="py-4 whitespace-nowrap text-right text-sm font-medium flex space-x-2"
                          onClick={() => {
                            putId(responsavel.id);
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
                    Mostrando <span className="font-medium">{inicio + 1}</span>{' '}
                    a{' '}
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
                      onClick={() =>
                        setPagina(Math.min(totalPaginas, pagina + 1))
                      }
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
      )}
    </>
  );
}
