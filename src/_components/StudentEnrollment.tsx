'use client';
import * as React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertTriangle, PlusIcon } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  nomeCompletoZod,
  dataNascimentoZod,
  generoZod,
  numeroBiZod,
  bairroZod,
  ruaZod,
  telefoneZod,
  emailZod,
} from '../_zodValidations/validations';
import './stepper.css';
import { Check } from 'lucide-react';
import Header from './Header';
import { useHookFormMask, withMask } from 'use-mask-input';
import {
  animateBounce,
  animateFadeLeft,
  animatePing,
  animateShake,
} from '@/_animation/Animates';
import { Link } from 'react-router-dom';
import MostrarDialog from './MostrarDialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { collectErrorMessages, matriculaAluno } from '@/_queries/Alunos';
import {
  useGetCurseQuery,
  useGetIdGradeCurseQuery,
} from '@/_queries/UseCurseQuery';
import { useGetIdClassFromGradedQuery } from '@/_queries/UseGradeQuery';
import { usePostStudent } from '@/_queries/UseStudentQuery';
import { useGetParentQuery } from '@/_queries/UseParentQuery';
import { useGetPaymentQuery } from '@/_queries/UsePaymentQuery';
import { AlertErro, AlertSucesso } from './Alert';

const TFormCreate = z.object({
  cursoId: z.number(),
  classeId: z.number(),
  turmaId: z.number(),
  metodoPagamentoId: z.number(),
  aluno: z.object({
    nomeCompleto: nomeCompletoZod,
    nomeCompletoPai: nomeCompletoZod,
    nomeCompletoMae: nomeCompletoZod,
    numeroBi: numeroBiZod,
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
    responsaveis: z.array(
      z.object({
        nomeCompleto: nomeCompletoZod,
        parentescoId: z.number(),
        endereco: z.object({
          bairro: bairroZod,
          rua: ruaZod,
          numeroCasa: z.number(),
        }),
        contacto: z.object({
          telefone: telefoneZod,
          email: emailZod,
        }),
      })
    ),
  }),
});

export default function StudentEnrollment() {
  const form = useForm<z.infer<typeof TFormCreate>>({
    mode: 'all',
    resolver: zodResolver(TFormCreate),
    defaultValues: {
      aluno: {
        responsaveis: [
          {
            nomeCompleto: '',
            parentescoId: 0,
            endereco: {
              bairro: '',
              rua: '',
            },
            contacto: {
              telefone: '',
            },
          },
        ],
      },
    },
  });
  const {
    control,
    watch,
    formState: { errors, isValid },
    register,
  } = form;
  //use of useFieldArray to create dynamic fields
  const { fields, append, remove } = useFieldArray({
    name: 'aluno.responsaveis',
    control,
  });

  const [
    fieldNome,
    fieldBi,
    fieldGenero,
    fieldTelefone,
    fieldDataNascimento,
    fieldNumeroCasa,
    fieldBairro,
    fieldRua,
    fieldNomeCompleMae,
    fieldNomeCompletoPai,
    fieldRespNome,
    fieldRespParentescoId,
    fieldRespBairro,
    fieldRespRua,
    fieldRespNumeroCasa,
    fieldRespTelefone,
    fieldCursoId,
    fieldClasseId,
    fieldTurmaId,
    fieldMetodoId,
  ] = watch([
    'aluno.nomeCompleto',
    'aluno.genero',
    'aluno.numeroBi',
    'aluno.dataNascimento',
    'aluno.contacto.telefone',
    'aluno.endereco.numeroCasa',
    'aluno.endereco.bairro',
    'aluno.endereco.rua',
    'aluno.nomeCompletoMae',
    'aluno.nomeCompletoPai',
    'aluno.responsaveis.0.nomeCompleto',
    'aluno.responsaveis.0.parentescoId',
    'aluno.responsaveis.0.endereco.bairro',
    'aluno.responsaveis.0.endereco.rua',
    'aluno.responsaveis.0.endereco.numeroCasa',
    'aluno.responsaveis.0.contacto.telefone',
    'cursoId',
    'classeId',
    'turmaId',
    'metodoPagamentoId',
  ]);

  const handleSubmitCreates = async (dados: z.infer<typeof TFormCreate>) => {
    try {
      const response = await fetch('http://localhost:8000/api/matriculas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'matricula.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        //setDialogMessage(null);
        //setShowDialog(true);
      } else {
        const errorData = await response.json();

        //setShowDialog(true);
        /* console.error('Erro ao gerar PDF:', response.statusText, errorData);
            let index = Object.values(errorData.errors.aluno)
            let conv = parseInt(String(Object.keys(index)))
            if (Object.keys(errorData.errors.aluno)[0] == "numeroBi")
            {
                setDialogMessage("Erro Nos dados do Aluno, "+Object.values(errorData.errors.aluno)[0][0])
            }
            if (Object.keys(errorData.errors.aluno)[0] == "contacto")
            {
                setDialogMessage("Erro Nos dados do Aluno, "+Object.values(Object.values(errorData.errors.aluno)[0])[0][0])
            }
            if (Object.keys(errorData.errors.aluno)[0] == "responsaveis")
            {
                setDialogMessage("Erro Nos dados do Responsavel, "+Object.values(Object.values(Object.values(Object.values(errorData.errors.aluno)[0])[0])[0])[0][0])
            }
            if (Object.values(Object.values(errorData.errors.aluno)[0])[0] == "responsaveis não podem conter contactos duplicados.")
            {
                setDialogMessage("responsaveis não podem conter contactos duplicados.")
            }*/
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };
  //Get
  const { data: dataCurses } = useGetCurseQuery();
  const { data: dataParents } = useGetParentQuery();
  const { data: dataPayment } = useGetPaymentQuery();
  const { dataGradesCurse } = useGetIdGradeCurseQuery(fieldCursoId);
  const { dataClassGradeId } = useGetIdClassFromGradedQuery(fieldClasseId);
  //Post
  const { postStudent, postError, postLevel } = usePostStudent();
  const handleSubmitCreate = async (data: z.infer<typeof TFormCreate>) => {
    postStudent(data);
  };

  const step = ['Info. Aluno', 'Info. Encarregado', 'Último Passo'];
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [complete, setComplete] = React.useState<boolean>(false);
  const registerWithMask = useHookFormMask(register);
  return (
    <>
      <div className="w-full flex items-center justify-center">
        <div className="flex flex-col space-y-2 justify-center sm:[376px] md:w-[550px] lg:w-[600px]">
          <div className="flex justify-center items-center ">
            <div className="flex justify-between text-sm">
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
                  <p className="text-gray-500">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmitCreate)}>
                <div>
                  {currentStep === 1 && (
                    <fieldset className="animate-fade-left animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-inflex flex-col">
                      <div className="legend-div">
                        <h1>Informações do Aluno</h1>
                      </div>
                      <div className="flex flex-row space-x-3 mb-2">
                        <div className="flex flex-col w-full">
                          <FormField
                            control={form.control}
                            name="aluno.nomeCompleto"
                            render={({ field }) => (
                              <FormItem>
                                <label>
                                  Nome Completo
                                  <span className="text-red-500">*</span>
                                </label>
                                <FormControl>
                                  <Input
                                    type="text"
                                    {...field}
                                    className={
                                      errors?.aluno?.nomeCompleto?.message &&
                                      `input-error ${animateShake}`
                                    }
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex flex-col w-full mb-2">
                          <FormField
                            control={form.control}
                            name="aluno.genero"
                            render={({ field }) => (
                              <FormItem>
                                <label>
                                  Gênero
                                  <span className="text-red-500">*</span>
                                </label>
                                <FormControl>
                                  <select
                                    {...field}
                                    className={
                                      errors?.aluno?.genero?.message &&
                                      `${animateShake} select-error`
                                    }
                                  >
                                    <option>Selecione o gênero</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                  </select>
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="flex flex-row space-x-3 mb-2">
                        <div className="flex flex-col w-full">
                          <FormField
                            control={form.control}
                            name="aluno.numeroBi"
                            render={({ field }) => (
                              <FormItem>
                                <label>
                                  Número do BI
                                  <span className="text-red-500">*</span>
                                </label>
                                <FormControl>
                                  <Input
                                    type="text"
                                    maxLength={14}
                                    {...field}
                                    className={
                                      errors?.aluno?.numeroBi?.message &&
                                      `input-error ${animateShake}`
                                    }
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                          <FormField
                            control={form.control}
                            name="aluno.dataNascimento"
                            render={({ field }) => (
                              <FormItem>
                                <label>
                                  Data de Nasc.
                                  <span className="text-red-500">*</span>
                                </label>
                                <FormControl>
                                  <Input
                                    type="date"
                                    className={
                                      errors?.aluno?.dataNascimento?.message &&
                                      `input-error ${animateShake}`
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
                      <div className="flex flex-row space-x-3 mb-2">
                        <div className="flex flex-col w-full">
                          <FormField
                            control={form.control}
                            name="aluno.contacto.email"
                            render={({ field }) => (
                              <FormItem>
                                <label>Email</label>
                                <FormControl>
                                  <Input
                                    type="email"
                                    {...field}
                                    className={
                                      errors?.aluno?.contacto?.email?.message &&
                                      `input-error ${animateShake}`
                                    }
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <FormField
                            control={form.control}
                            name="aluno.contacto.telefone"
                            render={({ field }) => (
                              <FormItem>
                                <label>
                                  Telefone
                                  <span className="text-red-500">*</span>
                                </label>
                                <FormControl>
                                  <Input
                                    {...registerWithMask(
                                      'aluno.contacto.telefone',
                                      ['999999999'],
                                      { required: true }
                                    )}
                                    className={
                                      errors?.aluno?.contacto?.telefone
                                        ?.message &&
                                      `input-error ${animateShake}`
                                    }
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="flex flex-row space-x-3 mb-2">
                        <div className="flex flex-col w-full">
                          <FormField
                            control={form.control}
                            name="aluno.endereco.numeroCasa"
                            render={({ field }) => (
                              <FormItem>
                                <label>
                                  Número da Residência
                                  <span className="text-red-500">*</span>
                                </label>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    className={
                                      errors?.aluno?.endereco?.numeroCasa
                                        ?.message &&
                                      `input-error ${animateShake}`
                                    }
                                    min={0}
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(parseInt(e.target.value));
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <FormField
                            control={form.control}
                            name="aluno.endereco.bairro"
                            render={({ field }) => (
                              <FormItem>
                                <label>
                                  Bairro
                                  <span className="text-red-500">*</span>
                                </label>

                                <FormControl>
                                  <Input
                                    type="text"
                                    {...field}
                                    className={
                                      errors?.aluno?.endereco?.bairro
                                        ?.message &&
                                      `input-error ${animateShake}`
                                    }
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <FormField
                            control={form.control}
                            name="aluno.endereco.rua"
                            render={({ field }) => (
                              <FormItem>
                                <label>
                                  Rua<span className="text-red-500">*</span>
                                </label>
                                <FormControl>
                                  <Input
                                    type="text"
                                    {...field}
                                    className={
                                      errors?.aluno?.endereco?.rua?.message &&
                                      `input-error ${animateShake}`
                                    }
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="flex flex-row space-x-3 mb-2">
                        <div className="flex flex-col w-full">
                          <FormField
                            control={form.control}
                            name="aluno.nomeCompletoPai"
                            render={({ field }) => (
                              <FormItem>
                                <label>
                                  Nome do Pai
                                  <span className="text-red-500">*</span>
                                </label>

                                <FormControl>
                                  <Input
                                    type="text"
                                    {...field}
                                    className={
                                      errors?.aluno?.nomeCompletoPai?.message &&
                                      `input-error ${animateShake}`
                                    }
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <FormField
                            control={form.control}
                            name="aluno.nomeCompletoMae"
                            render={({ field }) => (
                              <FormItem>
                                <label>
                                  Nome da Mãe
                                  <span className="text-red-500">*</span>
                                </label>

                                <FormControl>
                                  <Input
                                    type="text"
                                    {...field}
                                    className={
                                      errors?.aluno?.nomeCompletoMae?.message &&
                                      `input-error ${animateShake}`
                                    }
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {currentStep === 2 &&
                    fields.map((field, index) => {
                      return (
                        <fieldset
                          className="animate-fade-left animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-in"
                          key={field.id}
                        >
                          <div className="legend-div">
                            Informações do Encarregado
                          </div>
                          {index != 0 && (
                            <div className="w-full">
                              <h2 className="text-green-500 uppercase text-center bg-green-200 text-wrap">
                                Certifique-se que os encarregados não possuem
                                mesmo contacto!
                              </h2>
                            </div>
                          )}
                          <div className="flex flex-row space-x-3">
                            <div className="flex flex-col w-full">
                              <FormField
                                control={form.control}
                                name={`aluno.responsaveis.${index}.nomeCompleto`}
                                render={({ field }) => (
                                  <FormItem>
                                    <label>
                                      Nome Completo
                                      <span className="text-red-500">*</span>
                                    </label>

                                    <FormControl>
                                      <Input
                                        type="text"
                                        {...field}
                                        className={
                                          errors?.aluno?.responsaveis?.[index]
                                            ?.nomeCompleto?.message &&
                                          `input-error ${animateShake}`
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex flex-col w-full">
                              <FormField
                                control={form.control}
                                name={`aluno.responsaveis.${index}.parentescoId`}
                                render={({ field }) => (
                                  <FormItem>
                                    <label>
                                      Parentescos
                                      <span className="text-red-500">*</span>
                                    </label>

                                    <FormControl>
                                      <select
                                        {...field}
                                        className={
                                          errors?.aluno?.responsaveis?.[index]
                                            ?.parentescoId?.message &&
                                          `${animateShake} select-error`
                                        }
                                        onChange={(e) => {
                                          field.onChange(
                                            parseInt(e.target.value)
                                          );
                                        }}
                                      >
                                        <option>Selecione o grau</option>
                                        {dataParents?.data?.data?.map(
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
                          </div>

                          <div className="flex flex-row space-x-3 mb-2">
                            <div className="flex flex-col w-full">
                              <FormField
                                control={form.control}
                                name={`aluno.responsaveis.${index}.contacto.telefone`}
                                render={({ field }) => (
                                  <FormItem>
                                    <label>
                                      Telefone
                                      <span className="text-red-500">*</span>
                                    </label>

                                    <FormControl>
                                      <Input
                                        {...registerWithMask(
                                          `aluno.responsaveis.${index}.contacto.telefone`,
                                          ['999999999'],
                                          { required: true }
                                        )}
                                        className={
                                          errors?.aluno?.responsaveis?.[index]
                                            ?.contacto?.telefone?.message &&
                                          `input-error ${animateShake}`
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex flex-col w-full">
                              <FormField
                                control={form.control}
                                name={`aluno.responsaveis.${index}.contacto.email`}
                                render={({ field }) => (
                                  <FormItem>
                                    <label>Email</label>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        {...field}
                                        className={
                                          errors?.aluno?.responsaveis?.[index]
                                            ?.contacto?.email?.message &&
                                          `input-error ${animateShake}`
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          <div className="flex flex-row space-x-3 mb-2">
                            <div className="flex flex-col w-full">
                              <FormField
                                control={form.control}
                                name={`aluno.responsaveis.${index}.endereco.numeroCasa`}
                                render={({ field }) => (
                                  <FormItem>
                                    <label>
                                      Número da Residência
                                      <span className="text-red-500">*</span>
                                    </label>

                                    <FormControl>
                                      <Input
                                        type="number"
                                        min={1}
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(
                                            parseInt(e.target.value)
                                          );
                                        }}
                                        className={
                                          errors?.aluno?.responsaveis?.[index]
                                            ?.endereco?.numeroCasa?.message &&
                                          `input-error ${animateShake}`
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex flex-col w-full">
                              <FormField
                                control={form.control}
                                name={`aluno.responsaveis.${index}.endereco.bairro`}
                                render={({ field }) => (
                                  <FormItem>
                                    <label>
                                      Bairro
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        {...field}
                                        className={
                                          errors?.aluno?.responsaveis?.[index]
                                            ?.endereco?.bairro?.message &&
                                          `input-error ${animateShake}`
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex flex-col w-full">
                              <FormField
                                control={form.control}
                                name={`aluno.responsaveis.${index}.endereco.rua`}
                                render={({ field }) => (
                                  <FormItem>
                                    <label>
                                      Rua
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        {...field}
                                        className={
                                          errors?.aluno?.responsaveis?.[index]
                                            ?.endereco?.rua?.message &&
                                          `input-error ${animateShake}`
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          {index > 0 && (
                            <p
                              className="text-red-600 cursor-pointer text-center"
                              onClick={() => {
                                remove(index);
                              }}
                            >
                              remove
                            </p>
                          )}
                        </fieldset>
                      );
                    })}
                  {currentStep === 2 && fields.length < 2 && (
                    <div className="w-full flex items-center justify-center mb-4">
                      <div
                        className=" flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 cursor-pointer hover:bg-blue-800"
                        onClick={() => {
                          append({
                            nomeCompleto: '',
                          });
                        }}
                      >
                        <PlusIcon className="text-white h-6 w-6" />
                      </div>
                    </div>
                  )}
                </div>
                {currentStep === 3 && (
                  <fieldset className="animate-fade-left animate-once animate-duration-[550ms] animate-delay-[400ms] animate-ease-in">
                    <div className="legend-div">Informações Essenciais</div>
                    {postLevel === 1 && <AlertSucesso message={postError} />}
                    {postLevel === 2 && <AlertErro message={postError} />}
                    <div className="flex flex-col space-y-3 mb-2">
                      <div className="flex flex-row space-x-3 mb-2">
                        <div className="flex flex-col w-full">
                          <FormField
                            control={form.control}
                            name="cursoId"
                            render={({ field }) => (
                              <FormItem>
                                <label>
                                  Cursos
                                  <span className="text-red-500">*</span>
                                </label>
                                <FormControl>
                                  <select
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(
                                        parseInt(e.target.value, 10)
                                      );
                                    }}
                                  >
                                    <option>Selecione o curso</option>
                                    {dataCurses?.data?.data?.map((field) => {
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
                            control={form.control}
                            name="classeId"
                            render={({ field }) => (
                              <FormItem>
                                <label>
                                  Classes
                                  <span className="text-red-500">*</span>
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
                      </div>
                      <div className="flex flex-row space-x-3 mb-2">
                        <div className="flex flex-col w-full">
                          <FormField
                            control={form.control}
                            name="turmaId"
                            render={({ field }) => (
                              <FormItem>
                                <label>
                                  Turmas
                                  <span className="text-red-500">*</span>
                                </label>
                                <FormControl>
                                  <select
                                    {...field}
                                    className={
                                      errors.turmaId?.message &&
                                      `${animateShake} select-error`
                                    }
                                    onChange={(e) => {
                                      field.onChange(parseInt(e.target.value));
                                    }}
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
                      </div>
                      <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="col-span-1">
                          <FormField
                            control={form.control}
                            name="metodoPagamentoId"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <select
                                    {...field}
                                    className={
                                      errors.metodoPagamentoId?.message &&
                                      `${animateShake} select-error`
                                    }
                                    onChange={(e) => {
                                      field.onChange(parseInt(e.target.value));
                                    }}
                                  >
                                    <option>
                                      Pagar Em
                                      <span className="text-red-500">*</span>
                                    </option>
                                    {dataPayment?.data?.data?.map((field) => {
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
                )}
                <div className="w-full flex items-center justify-between">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        currentStep === step.length && setComplete(false);

                        currentStep > 1 && setCurrentStep((prev) => prev - 1);
                      }}
                      className={`${animatePing} responsive-button bg-gray-700 hover:bg-gray-600 text-white font-semibold border-gray-700`}
                    >
                      Voltar
                    </button>
                  )}

                  {currentStep === step.length ? (
                    <div>
                      {!errors.classeId &&
                        !errors.turmaId &&
                        !errors.metodoPagamentoId &&
                        fieldClasseId &&
                        fieldTurmaId &&
                        fieldMetodoId && (
                          <button
                            type={
                              currentStep === step.length && complete
                                ? 'submit'
                                : 'button'
                            }
                            onClick={() => {
                              currentStep === step.length
                                ? setComplete(true)
                                : setCurrentStep((prev) => prev + 1);
                            }}
                            className={`${
                              currentStep === 3 && complete
                                ? `${animateFadeLeft} bg-green-700 hover:bg-green-500 border-green-700`
                                : `${animateFadeLeft}  bg-blue-700 hover:bg-blue-600 border-blue-700`
                            } text-white font-semibold sm:text-sm md:text-[10px] lg:text-[12px] xl:text-[16px]
    py-1 sm:py-[2px] lg:py-1 xl:py-2 `}
                            disabled={!isValid}
                          >
                            {!isValid}Cadastrar
                          </button>
                        )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const isStep1Valid =
                          !errors?.aluno?.nomeCompleto &&
                          !errors?.aluno?.numeroBi &&
                          !errors?.aluno?.genero &&
                          !errors?.aluno?.contacto?.telefone &&
                          !errors?.aluno?.dataNascimento &&
                          !errors?.aluno?.endereco?.numeroCasa &&
                          !errors?.aluno?.endereco?.bairro &&
                          !errors?.aluno?.endereco?.rua &&
                          !errors?.aluno?.nomeCompletoMae &&
                          !errors?.aluno?.nomeCompletoPai &&
                          fieldNome &&
                          fieldBi &&
                          fieldGenero &&
                          fieldTelefone &&
                          fieldDataNascimento &&
                          fieldNumeroCasa &&
                          fieldBairro &&
                          fieldRua &&
                          fieldNomeCompleMae &&
                          fieldNomeCompletoPai;

                        const isResponsavelValid =
                          !Object.values(
                            errors?.aluno?.responsaveis?.[0] || {}
                          ).some(Boolean) &&
                          fieldRespNome &&
                          fieldRespBairro &&
                          fieldRespNumeroCasa &&
                          fieldRespParentescoId &&
                          fieldRespRua &&
                          fieldRespTelefone;

                        if (isStep1Valid) {
                          // Se Step 1 estiver válido, tente ir para Step 2
                          if (currentStep === 1) {
                            setCurrentStep(2);
                          }
                          // Se o Step 2 estiver válido (responsável validado), vá para o Step 3
                          else if (currentStep === 2 && isResponsavelValid) {
                            setCurrentStep(3);
                          }
                          // Caso contrário, finalize o formulário se estiver no último Step
                          else if (currentStep === step.length) {
                            setComplete(true);
                          }
                        } else {
                          // Retorne ao Step 1 caso as condições de validação não estejam atendidas
                          setCurrentStep(1);
                        }
                      }}
                      className={`${animatePing} responsive-button bg-blue-700 hover:bg-blue-600 text-white font-semibold border-blue-700`}
                    >
                      Próximo
                    </button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
