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
  const [responsePostPeriod, setResp] = React.useState<string>(null);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostTurnos,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['turnos']});
      },
      onError: (error) => {
        if(axios.isAxiosError(error)){
          if (error.response && error.response.data) {
            const err = error.response.data?.errors;
            const errorMessages = collectErrorMessages(err);
            setResp(errorMessages[0])
           }
          }
      }
  });
  return { postPeriod: mutate, responsePostPeriod };
};

//Put

interface TurnoData {
  id: string;
}

interface QueryData {
  data: TurnoData[];
}

export const usePutPeriod = () => {
  const [responsePutPeriod, setResp] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: auxPutTurnos,
    onMutate: async (newData: TurnoData) => {
      await queryClient.cancelQueries({ queryKey: ['turnos'] });

      const previousData = queryClient.getQueryData<QueryData>(['turnos']);

      queryClient.setQueryData<QueryData>(['turnos'], (old) => {
        if (!old) return { data: [newData] };
        return {
          ...old,
          data: [...old.data, newData]
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turnos'] });
    },
    onError: (error, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['turnos'], context.previousData);
      }
      
      if (axios.isAxiosError(error)) {
        if (error.response?.data) {
          const err = error.response.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(errorMessages[0]);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['turnos'] });
    },
  });

  return { putPeriod: mutate, responsePutPeriod };
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



