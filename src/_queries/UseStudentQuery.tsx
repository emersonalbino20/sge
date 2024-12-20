import * as React from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { getCookies } from '@/_cookies/Cookies';

const PAGE_SIZE = 10;
interface ApiResponse {
  data: ClassStudent[];
  next_cursor: number;
}
//Auxilary Functions

/* Show the message error */
const collectErrorMessages = (obj) => {
  let messages = [];
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      messages = messages.concat(obj[key]);
    } else if (typeof obj[key] === 'object') {
      messages = messages.concat(collectErrorMessages(obj[key]));
    }
  }
  return messages;
};

/* Post */
const auxPostStudent = (data) => {
  return axios.post('http://localhost:8000/api/matriculas/', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const auxPostConfirmEnrollment = (data) => {
  return axios.post(
    `http://localhost:8000/api/alunos/${data.id}/matriculas/confirm`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

const auxPostStudentNote = (data) => {
  return axios.post('http://localhost:8000/api/notas/', data);
};

const auxPostGuardianStudent = (data) => {
  return axios.post(
    `http://localhost:8000/api/alunos/${getCookies('idAluno')}/responsaveis`,
    data
  );
};

/* Put */
const auxPutStudent = (data) => {
  return axios.put(`http://localhost:8000/api/alunos/${data.id}`, data);
};

const auxPutStudentNote = (data) => {
  return axios.put(
    `http://localhost:8000/api/alunos/${data.alunoId}/notas`,
    data
  );
};

//Main Functions

//Post
export const usePostStudent = () => {
  const [postError, setResp] = React.useState<string>('');
  const [postLevel, setLevel] = React.useState<number>(null);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostStudent,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['alunos'] });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      );
      window.open(url, '_blank');
    },
    onError: (error) => {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err = error?.response?.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(
            `(${count}) ${
              error?.response?.data?.message
                ? error?.response?.data?.message
                : errorMessages[0]
            }`
          );
          setLevel(2);
        }
      }
    },
    onMutate() {
      setCount((prev) => prev + 1);
    },
  });
  return { postStudent: mutate, postError, postLevel };
};

export const usePostConfirmEnrollment = () => {
  const [postConfirmError, setResp] = React.useState<string>('');
  const [postConfirmLevel, setLevel] = React.useState<number>(null);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostConfirmEnrollment,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['alunos'] });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      );
      window.open(url, '_blank');
    },
    onError: (error) => {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err = error?.response?.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(
            `(${count}) ${
              err ? errorMessages[0] : error?.response?.data?.message
            }`
          );
          setLevel(2);
        }
      }
    },
    onMutate() {
      setCount((prev) => prev + 1);
    },
  });
  return { postConfirmStudent: mutate, postConfirmError, postConfirmLevel };
};

export const usePostStudentNote = () => {
  const [postNoteError, setResp] = React.useState<string>('');
  const [postNoteLevel, setLevel] = React.useState<number>(null);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate, variables } = useMutation({
    mutationFn: auxPostStudentNote,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [
          'alunos-com-notas',
          variables?.classeId,
          variables?.turmaId,
          variables?.trimestreId,
          variables?.disciplina,
        ],
      });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
    },
    onError: (error) => {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err = error.response?.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(`(${count}) ${errorMessages[0]}`);
          setLevel(2);
        }
      }
    },
    onMutate() {
      setCount((prev) => prev + 1);
    },
  });
  return { postStudentNote: mutate, postNoteError, postNoteLevel };
};

export const usePostGuardianStudent = () => {
  const [postGuardianStudentError, setResp] = React.useState<string>('');
  const [postGuardianStudentLevel, setLevel] = React.useState<number>(null);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostGuardianStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['responsaveisalunos', getCookies('idAluno')],
      });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.log(error);
        if (error.response && error.response.data) {
          if (error.response?.data?.message) {
            setResp(`(${count}) ${error.response?.data?.message}`);
            setLevel(2);
          } else {
            const err = error.response?.data?.errors;
            const errorMessages = collectErrorMessages(err);
            setResp(`(${count}) ${errorMessages[0]}`);
            setLevel(2);
          }
        }
      }
    },
    onMutate() {
      setCount((prev) => prev + 1);
    },
  });
  return {
    postGuardianStudent: mutate,
    postGuardianStudentError,
    postGuardianStudentLevel,
  };
};

//Put
export const usePutStudent = () => {
  const [putStudentError, setResp] = React.useState<string>('');
  const [putStudentLevel, setLevel] = React.useState<number>(null);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate, variables } = useMutation({
    mutationFn: auxPutStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['alunosportuma', variables?.classeId, variables?.turmaId],
      });
      queryClient.invalidateQueries({
        queryKey: ['alunoId', variables?.id],
      });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err = error.response?.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(`(${count}) ${errorMessages[0]}`);
          setLevel(2);
        }
      }
    },
    onMutate() {
      setCount((prev) => prev + 1);
    },
  });
  return {
    putStudent: mutate,
    putStudentError,
    putStudentLevel,
  };
};

export const usePutStudentNote = () => {
  const [putNoteError, setResp] = React.useState<string>('');
  const [putNoteLevel, setLevel] = React.useState<number>(null);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate, variables } = useMutation({
    mutationFn: auxPutStudentNote,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [
          'alunos-com-notas',
          variables?.classeId,
          variables?.turmaId,
          variables?.trimestreId,
          variables?.disciplina,
        ],
      });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
      console.log(variables);
    },
    onError: (error) => {
      console.log(variables);
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err = error.response?.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(`(${count}) ${errorMessages[0]}`);
          setLevel(2);
        }
      }
    },
    onMutate() {
      setCount((prev) => prev + 1);
    },
  });
  return { putStudentNote: mutate, putNoteError, putNoteLevel };
};

//Get
interface Aluno {
  id: number;
  nomeCompleto: string;
  numeroBi: string;
  dataNascimento: string;
  genero: 'M' | 'F';
}
export const useGetAllStudentsQuery = () => {
  return useInfiniteQuery<ApiResponse>({
    queryKey: ['alunos'],
    queryFn: async ({ pageParam = null }) => {
      const response = await axios.get('http://localhost:8000/api/alunos', {
        params: {
          cursor: pageParam,
          PAGE_SIZE,
        },
      });
      return response.data;
    },

    getNextPageParam: (lastPage) => {
      // Retorna a última página só se o next_cursor for maior que 1
      return lastPage.next_cursor > 1 ? lastPage.next_cursor : undefined;
    },
    initialPageParam: null,
  });
};

export const useGetIdStudent = (id) => {
  const { data, isFetched } = useQuery({
    queryKey: ['alunoId', id],
    queryFn: () => axios.get(`http://localhost:8000/api/alunos/${id}`),
    enabled: !!id,
  });

  return { data, isFetched };
};

export const useGetIdGuardianStudent = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['responsaveisalunos', getCookies('idAluno')],
    queryFn: () =>
      axios.get(
        `http://localhost:8000/api/alunos/${getCookies('idAluno')}/responsaveis`
      ),
    enabled: !!getCookies('idAluno'),
  });

  return { data, isLoading, isError };
};

interface ClassStudent {
  id: number;
  nomeCompleto: string;
  numeroBi: string;
  dataNascimento: string;
  genero: 'M' | 'F';
}

export const useGetStudentByClassQuery = (
  classeId: number,
  turmaId: number
) => {
  return useInfiniteQuery<ApiResponse>({
    queryKey: ['alunosporturma', classeId, turmaId],
    queryFn: async ({ pageParam = null }) => {
      const query = turmaId
        ? `http://localhost:8000/api/turmas/${turmaId}/alunos`
        : `http://localhost:8000/api/classes/${classeId}/alunos`;
      const response = await axios.get(query, {
        params: {
          cursor: pageParam,
          PAGE_SIZE,
        },
      });
      return response.data;
    },

    getNextPageParam: (lastPage) => {
      // Retorna a última página só se o next_cursor for maior que 1
      return lastPage.next_cursor > 1 ? lastPage.next_cursor : undefined;
    },
    initialPageParam: null,
  });
};

export const useGetStudentNotesQuery = (alunoId, trimestreId, classeId) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['alunosnotas', alunoId, trimestreId, classeId],
    queryFn: () =>
      axios.get(
        `http://localhost:8000/api/alunos/${alunoId}/notas?trimestreId=${trimestreId}&classeId=${classeId}`
      ),
    enabled: !!alunoId,
  });

  return { data, isLoading, isError };
};

export const useGetStudentHistoryQuery = (alunoId) => {
  const { data } = useQuery({
    queryKey: ['alunohistory', alunoId],
    queryFn: () =>
      axios.get(`http://localhost:8000/api/alunos/${alunoId}/matriculas`),
    enabled: !!alunoId,
  });
  return { data };
};

export const useGetStudentGradesQuery = (alunoId) => {
  const { data } = useQuery({
    queryKey: ['alunogrades', alunoId],
    queryFn: () =>
      axios.get(`http://localhost:8000/api/alunos/${alunoId}/classes`),
    enabled: !!alunoId,
  });
  return { data };
};

export const useGetStudentAtGradeQuery = (alunoId) => {
  const { data } = useQuery({
    queryKey: ['alunoatgrades', alunoId],
    queryFn: () =>
      axios.get(`http://localhost:8000/api/alunos/${alunoId}/classes/actual`),
    enabled: !!alunoId,
  });
  return { data };
};

interface Aluno {
  id: number;
  nome: string;
  // ... outros campos do aluno
}

interface Nota {
  disciplina: string;
  nota: number;
}

// Função para buscar alunos de uma turma
async function fetchAlunos(turmaId: number) {
  const response = await fetch(
    `http://localhost:8000/api/turmas/${turmaId}/alunos`
  );
  if (!response.ok) {
    throw new Error('Erro ao buscar alunos');
  }
  return response.json();
}

// Função para buscar nota de um aluno
async function fetchNotaAluno(
  alunoId: number,
  trimestreId: number,
  classeId: number
) {
  const response = await fetch(
    `http://localhost:8000/api/alunos/${alunoId}/notas?trimestreId=${trimestreId}&classeId=${classeId}`
  );
  if (!response.ok) {
    throw new Error('Erro ao buscar nota');
  }
  return response.json();
}

// Hook principal que combina os dados
export function useAlunosComNotas({
  classeId,
  turmaId,
  trimestreId,
  nomeDisciplina,
}: {
  classeId: number;
  turmaId: number;
  trimestreId: number;
  nomeDisciplina: string;
}) {
  return useQuery({
    queryKey: [
      'alunos-com-notas',
      classeId,
      turmaId,
      trimestreId,
      nomeDisciplina,
    ],
    queryFn: async () => {
      // Primeiro, busca todos os alunos
      const alunosResponse = await fetchAlunos(turmaId);
      const alunos = alunosResponse.data;

      // Depois, busca as notas para cada aluno
      const alunosComNotas = await Promise.all(
        alunos.map(async (aluno) => {
          try {
            const notasResponse = await fetchNotaAluno(
              aluno.id.toString(),
              trimestreId,
              classeId
            );

            const notaDisciplina = notasResponse.data?.find(
              (nota: Nota) => nota.disciplina === nomeDisciplina
            );

            return {
              ...aluno,
              nota: notaDisciplina?.nota ?? null,
              nomeDisciplina,
            };
          } catch (error) {
            return {
              ...aluno,
              nota: null,
              nomeDisciplina,
            };
          }
        })
      );

      return alunosComNotas;
    },
    // Habilita o stale time para evitar requisições desnecessárias
    staleTime: 1000 * 60 * 5, // 5 minutos
    // Habilita o cache time
    gcTime: 1000 * 60 * 15, // 15 minutos
  });
}
