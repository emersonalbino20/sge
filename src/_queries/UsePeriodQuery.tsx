import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

  //Auxilary Functions

  /* Show the message error */
  const collectErrorMessages = (obj) => {
    let messages = [];
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        messages = messages.concat(obj[key]);
      } else if (typeof obj[key] === "object") {
        messages = messages.concat(collectErrorMessages(obj[key]));
      }
    }
    return messages;
  };

  /* Post */
  export  const auxPostTurnos = (data) => {
    return (axios.post(`http://localhost:8000/api/turnos/`, data));
  }

  /* Put */
  export  const auxPutTurnos = (data) => {
    return (axios.put(`http://localhost:8000/api/turnos/${data.id}`, data));
  }

//Main Functions

//Post

export const usePostPeriod = () => {
  const [postError, setResp] = React.useState<string>('');
  const [postLevel, setLevel] = React.useState<number>(null)
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostTurnos,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['turnos']});
        setResp(`(${count}) Operação realizada com sucesso!`);
        setLevel(1);
      },
      onError: (error) => {
        if(axios.isAxiosError(error)){
          if (error.response && error.response.data) {
            const err = error.response.data?.errors;
            const errorMessages = collectErrorMessages(err);
            setResp(`(${count}) ${errorMessages[0]}`);
            setLevel(2);
           }
          }
      }, onMutate() {
        setCount(prev=>prev+1);
      }
  });
  return { postPeriod: mutate, postLevel, postError };
};

//Put

interface TurnoData {
  id: string;
}

interface QueryData {
  data: TurnoData[];
}

export const usePutPeriod = () => {
  const [putError, setResp] = React.useState<string>('');
  const [putLevel, setLevel] = React.useState<number>(null)
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: auxPutTurnos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turnos'] });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.data) {
          const err = error.response.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(errorMessages[0]);
          setResp(`(${count}) Operação realizada com sucesso!`);
          setLevel(2);
        }
      }
    }, onMutate() {
      setCount(prev=>prev+1);
    }
  });

  return { putPeriod: mutate, putError, putLevel };
};

//Get

export const useGetPeriodQuery = () => {
    const { data, isLoading, isError } = useQuery(
        {
          queryKey: ['turnos'],
          queryFn: () => axios.get("http://localhost:8000/api/turnos/")
        }
      );
    
      return { data, isLoading, isError };
  };

export const useGetIdPeriodQuery = (id: string) => {
    const { data, isFetched } = useQuery(
        {
          queryKey: ['turnos', id],
          queryFn: () => axios.get(`http://localhost:8000/api/turnos/${id}`),
          enabled: !!id
        }
      );
    
      return { dataTurnoById: data, isFetchedTurnoById: isFetched};
};



