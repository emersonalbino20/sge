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

  export  const auxPostGrade = (data) => {
    return (axios.post(`http://localhost:8000/api/classes/`, data));
  }

  /* Put */
  export  const auxPutGrade = (data) => {
    return (axios.put(`http://localhost:8000/api/classes/${data?.id}`, {
      nomeCompleto: data?.nomeCompleto,
      dataNascimento: data.dataNascimento,
      contacto: {
        telefone: data?.telefone,
        email: data?.email,
      }
    }));
  }

//Main Functions

//Post
export const usePostGrade = () => {
  const [postError, setResp] = React.useState<string>(null);
  const [postLevel, setLevel] = React.useState<number>(0)
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostGrade,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['classes']});
        setResp(' Operação realizada com sucesso!')
        setLevel(1);
      },
      onError: (error) => {
        if(axios.isAxiosError(error)){
          if (error.response && error.response.data) {
            const err = error.response.data?.errors;
            const errorMessages = collectErrorMessages(err);
            setResp(errorMessages[0])
            setLevel(2);
           }
          }
      }
  });
  return { postGrade: mutate, postError, postLevel};
};

//Put
export const usePutGrade = () => {
  const [updateError, setResp] = React.useState<string>(null);
  const [updateLevel, setLevel] = React.useState<number>(0)
  const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: auxPutGrade,
	  onSuccess: () => {
	  	queryClient.invalidateQueries({queryKey: ['classes']});
      setResp(' Operação realizada com sucesso!')
      setLevel(1);
	  },
    onError: (error) => {
      if(axios.isAxiosError(error)){
        if (error.response && error.response.data) {
          const err = error.response.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(errorMessages[0])
          setLevel(2);
         }
        }
    }
  }
	);
	return { putGrade: mutate, updateError, updateLevel };
}

//Get

export const useGetGradeQuery = () => {
    const { data, isLoading, isError } = useQuery(
        {
          queryKey: ['classes'],
          queryFn: () => axios.get("http://localhost:8000/api/classes/")
        }
      );
    
      return { data, isLoading, isError };
  };

export const useGetIdGradedQuery = (id: string) => {
    const { data, isFetched } = useQuery(
        {
          queryKey: ['classes', id],
          queryFn: () => axios.get(`http://localhost:8000/api/classes/${id}`),
          enabled: !!id
        }
      );
      return { dataGradeId: data, isFetched};
};

export const useGetIdClassFromGradedQuery = (id: number) => {
  const { data, isFetched } = useQuery(
      {
        queryKey: ['turmasclasses', id],
        queryFn: () => axios.get(`http://localhost:8000/api/classes/${id}/turmas`),
        enabled: !!id
      }
    );
    return { dataClassGradeId: data };
};



