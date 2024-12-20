import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

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

/*  Post */
export const auxPostTeacher = (data) => {
  return axios.post(`http://localhost:8000/api/professores/`, data);
};

export const auxPostClassToTeacher = (data) => {
  return axios.post(
    `http://localhost:8000/api/professores/${data.idProfessor}/classes`,
    {
      disciplinaId: data.disciplinaId,
      classeId: data.classeId,
      turmaId: data.turmaId,
    }
  );
};

export const auxPostMatchSubjectTeacher = (data) => {
  return axios.post(
    `http://localhost:8000/api/professores/${data.idProfessor}/disciplinas`,
    {
      disciplinas: data.disciplinas,
    }
  );
};

/* Delete */
const auxPostDisMatchSubjectTeacher = (data) => {
  return axios.request({
    url: `http://localhost:8000/api/professores/${data.idProfessor}/disciplinas`,
    method: 'delete',
    data: { disciplinas: data.disciplinas },
  });
};

/* Put */
export const auxPutTeacher = (data) => {
  return axios.put(`http://localhost:8000/api/professores/${data?.id}`, {
    nomeCompleto: data?.nomeCompleto,
    dataNascimento: data.dataNascimento,
    contacto: {
      telefone: data?.telefone,
      email: data?.email,
    },
  });
};

//Main Functions

//Post
export const usePostTeacher = () => {
  const [postError, setResp] = React.useState<string>(null);
  const [postLevel, setLevel] = React.useState<number>(0);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professores'] });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err =
            error.response.data?.errors || error.response.data?.message;
          console.log(error);
          setResp(`(${count}) ${err}`);
          setLevel(2);
        }
      }
    },
    onMutate() {
      setCount((prev) => prev + 1);
    },
  });
  return { postTeacher: mutate, postError, postLevel };
};

export const usePostClassToTeacher = () => {
  const [postClassToError, setResp] = React.useState<string>(null);
  const [postClassToLevel, setLevel] = React.useState<number>(0);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostClassToTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professores'] });
      queryClient.invalidateQueries({ queryKey: ['classesprofessores'] });
      queryClient.invalidateQueries({ queryKey: ['sbjAbsentProfessor'] });
      queryClient.invalidateQueries({ queryKey: ['turmasprofessores'] });
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
  return { postClassToTeacher: mutate, postClassToError, postClassToLevel };
};

export const usePostMatchSubjectTeacher = () => {
  const [postMatchSubjectError, setResp] = React.useState<string>(null);
  const [postMatchSubjectLevel, setLevel] = React.useState<number>(0);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate, variables } = useMutation({
    mutationFn: auxPostMatchSubjectTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professores'] });
      queryClient.invalidateQueries({ queryKey: ['disciplinasprofessores'] });
      console.log(variables);
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
    },
    onError: (error) => {
      console.log(error)
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err = error.response?.data?.errors?.disciplinas[0];
          setResp(`(${count}) ${err}`);
          setLevel(2);
        }
      }
    },
    onMutate() {
      setCount((prev) => prev + 1);
    },
  });
  return {
    postMatchTeacher: mutate,
    postMatchSubjectError,
    postMatchSubjectLevel,
  };
};

//Delete
export const usePostDisMatchSubjectTeacher = () => {
  const [postDisMatchSubjectError, setResp] = React.useState<string>(null);
  const [postDisMatchSubjectLevel, setLevel] = React.useState<number>(0);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate, variables } = useMutation({
    mutationFn: auxPostDisMatchSubjectTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professores'] });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err =
            error.response?.data?.message ||
            error.response?.data?.errors?.disciplinas[0];
          setResp(`(${count}) ${err}`);
          setLevel(2);
        }
      }
    },
    onMutate() {
      setCount((prev) => prev + 1);
    },
  });
  return {
    postDisMtachTeacher: mutate,
    postDisMatchSubjectError,
    postDisMatchSubjectLevel,
  };
};

//Put
export const usePutTeacher = () => {
  const [updateError, setResp] = React.useState<string>(null);
  const [updateLevel, setLevel] = React.useState<number>(0);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professores'] });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err = error?.response?.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(
            `(${count}) ${
              error?.response?.data?.errors
                ? errorMessages[0]
                : error?.response?.data?.message
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
  return { putTeacher: mutate, updateError, updateLevel };
};

//Get
interface Professor {
  id: number;
  nomeCompleto: string;
  dataNascimento: string;
}

interface ApiResponse {
  data: Professor[];
  next_cursor: number;
}

const PAGE_SIZE = 10;

export const useGetTeacherQuery = () => {
  return useInfiniteQuery<ApiResponse>({
    queryKey: ['professores'],
    queryFn: async ({ pageParam = null }) => {
      const response = await axios.get(
        'http://localhost:8000/api/professores',
        {
          params: {
            cursor: pageParam,
            PAGE_SIZE,
          },
        }
      );
      return response.data;
    },

    getNextPageParam: (lastPage) => {
      // Retorna a última página só se o next_cursor for maior que 1
      return lastPage.next_cursor > 1 ? lastPage.next_cursor : undefined;
    },
    initialPageParam: null,
  });
};

export const useGetIdTeacherdQuery = (id) => {
  const { data, isFetched, dataUpdatedAt } = useQuery({
    queryKey: ['professores', id],
    queryFn: () => axios.get(`http://localhost:8000/api/professores/${id}`),
    enabled: !!id,
  });

  return { dataTeacherId: data, isFetched, dataUpdatedAt };
};

export const useGetIdTeacherSubjectsdQuery = (id) => {
  const { data, isFetched } = useQuery({
    queryKey: ['disciplinasprofessores', id],
    queryFn: () =>
      axios.get(`http://localhost:8000/api/professores/${id}/disciplinas`),
    enabled: !!id,
  });

  return { dataTeacherSubjects: data, subjectFetched: isFetched };
};

export const useGetIdTeacherGradesQuery = (id) => {
  const { data } = useQuery({
    queryKey: ['classesprofessores', id],
    queryFn: () =>
      axios.get(`http://localhost:8000/api/professores/${id}/classes`),
    enabled: !!id,
  });
  return { dataTeacherGrades: data };
};

export const useGetIdTeacherClassQuery = (id, classeId) => {
  const { data } = useQuery({
    queryKey: ['turmasprofessores', id, classeId],
    queryFn: () =>
      axios.get(
        `http://localhost:8000/api/professores/${id}/classes/${classeId}/turmas`
      ),
    enabled: !!id,
  });

  return { data };
};
