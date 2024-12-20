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

/* Post */
const auxPostParent = (data) => {
  return axios.post(`http://localhost:8000/api/parentescos/`, data);
};

/* Put */
const auxPutParent = (data) => {
  return axios.put(`http://localhost:8000/api/parentescos/${data.id}`, data);
};

//Main Functions

//Post

export const usePostParent = () => {
  const [postError, setResp] = React.useState<string>('');
  const [postLevel, setLevel] = React.useState<number>(null);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostParent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parentescos'] });
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
  return { postParent: mutate, postError, postLevel };
};

//Put
export const usePutParent = () => {
  const [putParentError, setResp] = React.useState<string>('');
  const [putParentLevel, setLevel] = React.useState<number>(null);
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPutParent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parentescos'] });
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
  return { putParent: mutate, putParentError, putParentLevel };
};

//Get

export const useGetParentQuery = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['parentescos'],
    queryFn: () => axios.get('http://localhost:8000/api/parentescos/'),
  });

  return { data, isLoading, isError };
};

export const useGetIdParentQuery = (id: string) => {
  const { data, isFetched } = useQuery({
    queryKey: ['parentescos', id],
    queryFn: () => axios.get(`http://localhost:8000/api/parentescos/${id}`),
  });

  return { data, isFetched };
};
