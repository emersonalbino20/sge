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

export const auxPostClassToClassRoom = (data) => {
  return axios.post(`http://localhost:8000/api/salas/${data.id}/turmas`, {
    nome: data.nome,
    classeId: data.classeId,
    turnoId: data.turnoId,
  });
};

export const auxPostClassRoom = (data) => {
  return axios.post(`http://localhost:8000/api/salas/`, data);
};

/* Put */
export const auxPutClassRoom = (data) => {
  return axios.put(`http://localhost:8000/api/salas/${data.id}`, data);
};

//Main Functions

//Post
export const usePostClassRoom = () => {
  const [postError, setResp] = React.useState<string>(null);
  const [postLevel, setLevel] = React.useState<number>(0);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostClassRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salas'] });
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
  return { postClassRoom: mutate, postError, postLevel };
};

export const usePostClassToClassRoom = () => {
  const [postClassError, setResp] = React.useState<string>(null);
  const [postClassLevel, setLevel] = React.useState<number>(0);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostClassToClassRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salas'] });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err =
            error.response?.data?.message || error.response?.data?.errors;
          const errorMessages = collectErrorMessages(err);
          console.log(errorMessages);
          /*Teste de error*/
          setLevel(2);
          setResp(`(${count}) A turma já existe!`);
          setLevel(2);
        }
      }
    },
    onMutate() {
      setCount((prev) => prev + 1);
    },
  });
  return { postClass: mutate, postClassError, postClassLevel };
};

//Put
export const usePutClassRoom = () => {
  const [updateError, setResp] = React.useState<string>(null);
  const [updateLevel, setLevel] = React.useState<number>(0);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutClassRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salas'] });
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
  return { putClassRoom: mutate, updateError, updateLevel };
};

//Get

export const useGetClassRoomQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['salas'],
    queryFn: () => axios.get('http://localhost:8000/api/salas/'),
  });

  return { data, isLoading, isError };
};

export const useGetIdClassRoomdQuery = (id: string) => {
  const { data, isFetched } = useQuery({
    queryKey: ['salas', id],
    queryFn: () => axios.get(`http://localhost:8000/api/salas/${id}`),
    enabled: !!id,
  });

  return { dataClassRoomId: data, isFetched };
};
