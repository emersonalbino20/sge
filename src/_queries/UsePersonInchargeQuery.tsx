import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getCookies } from '@/_cookies/Cookies';

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

/* Put */
const auxPutPersonIncharge = (data) => {
  return axios.put(
    `http://localhost:8000/api/responsaveis/${data.responsavelId}`,
    data
  );
};

/* Delete */
const auxDelete = (data) => {
  return axios.request({
    url: `http://localhost:8000/api/responsaveis/${data.responsavelId}`,
    method: 'delete',
    data: { responsavelId: data.responsavelId },
  });
};

//Main Functions

//Put
export const usePutPersonIncharge = () => {
  const [putPersonInchargeError, setResp] = React.useState<string>('');
  const [putPersonInchargeLevel, setLevel] = React.useState<number>(null);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate, variables } = useMutation({
    mutationFn: auxPutPersonIncharge,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['responsaveisalunos', getCookies('idAluno')],
      });
      queryClient.invalidateQueries({
        queryKey: ['responsaveis', variables?.responsavelId],
      });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const err =
            error.response?.data?.message || error.response?.data?.errors;
          const errorMessages = collectErrorMessages(err);
          console.log(err);
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
    putPersonIncharge: mutate,
    putPersonInchargeError,
    putPersonInchargeLevel,
  };
};

//Delete
export const useDeletePersonIncharge = () => {
  const [deleteError, setResp] = React.useState<string>('');
  const [deleteLevel, setLevel] = React.useState<number>(null);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate, variables } = useMutation({
    mutationFn: auxDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['responsaveisalunos', getCookies('idAluno')],
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
  return { deletePersonIncharge: mutate, deleteError, deleteLevel };
};

//Get
export const useGetIdPersonInchargeQuery = (id: string) => {
  const { data, isFetched } = useQuery({
    queryKey: ['responsaveis', id],
    queryFn: () => axios.get(`http://localhost:8000/api/responsaveis/${id}`),
    enabled: !!id,
  });
  return { dataPersonInchargeId: data, isFetched };
};
