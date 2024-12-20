import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export const auxPostBulletin = (data) => {
  return axios.post(`http://localhost:8000/api/notas/`, data);
};

/* Put */
export const auxPutBulletin = (data) => {
  return axios.put(`http://localhost:8000/api/notas/${data?.id}`, {
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
export const usePostBulletin = () => {
  const [postError, setResp] = React.useState<string>(null);
  const [postLevel, setLevel] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostBulletin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setResp(' Operação realizada com sucesso!');
      setLevel(1);
    },
    onError: (error) => {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err =
            error.response?.data?.message || error.response?.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(errorMessages[0]);
          setLevel(2);
        }
      }
    },
  });
  return { postBulletin: mutate, postError, postLevel };
};

//Put
export const usePutBulletin = () => {
  const [updateError, setResp] = React.useState<string>(null);
  const [updateLevel, setLevel] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutBulletin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setResp(' Operação realizada com sucesso!');
      setLevel(1);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err =
            error.response?.data?.message || error.response?.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(errorMessages[0]);
          setLevel(2);
        }
      }
    },
  });
  return { putBulletin: mutate, updateError, updateLevel };
};

//Get

export const useGetBulletinQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['classes'],
    queryFn: () => axios.get('http://localhost:8000/api/classes/'),
  });

  return { data, isLoading, isError };
};

export const useGetIdBulletindQuery = (id: string) => {
  const { data, isFetched } = useQuery({
    queryKey: ['classes', id],
    queryFn: () => axios.get(`http://localhost:8000/api/classes/${id}`),
    enabled: !!id,
  });
  return { dataBulletinId: data, isFetched };
};

export const useGetIdClassFromBulletindQuery = (id: number) => {
  const { data, isFetched } = useQuery({
    queryKey: ['turmasclasses', id],
    queryFn: () => axios.get(`http://localhost:8000/api/classes/${id}/turmas`),
    enabled: !!id,
  });
  return { dataClassBulletinId: data };
};

export const useGetNextBulletinQuery = (preveousBulletin) => {
  const { data } = useQuery({
    queryKey: ['nextBulletin', preveousBulletin],
    queryFn: () =>
      axios.get(`http://localhost:8000/api/classes/${preveousBulletin}/next`),
    enabled: !!preveousBulletin,
  });
  return { data };
};

export const useGetIdSubjectsBulletinQuery = (id) => {
  const { data, isFetched } = useQuery({
    queryKey: ['disciplinasclasse', id],
    queryFn: () =>
      axios.get(`http://localhost:8000/api/classes/${id}/disciplinas`),
    enabled: !!id,
  });
  return { dataSubjectsBulletin: data };
};
