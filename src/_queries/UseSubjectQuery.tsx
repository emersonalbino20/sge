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
  }

  /* Post */
   const auxPostSubject = (data) => {
    return (axios.post(`http://localhost:8000/api/disciplinas/`, data));
  }

  const auxPostMatchCurseToSubject = (data) => {
    return (axios.post(`http://localhost:8000/api/disciplinas/${data.disciplinaId}/cursos`, {
      "cursos": data.cursoId
    }));
  }

  /* Put */
  const auxPutSubject = (data) => {
    return (axios.put(`http://localhost:8000/api/disciplinas/${data.id}`, data));
  }

//Main Functions

//Post

export const usePostSubject = () => {
   const [responsePostSubject, setErrorMessage] = React.useState<string | null>(null);
 
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostSubject,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['disciplinas']});
        setErrorMessage(null);
      },
      onError: (error) => {
        if(axios.isAxiosError(error)){
          if (error.response && error.response.data) {
          const err = error.response?.data?.errors?.disciplinas;
          const errorMessages = collectErrorMessages(err);
          setErrorMessage(errorMessages[0]);
        }
          }
      }
  });
  return { postSubject: mutate, responsePostSubject };
};

export const usePostMatchCurseToSubject = () => {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostMatchCurseToSubject,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['disciplinas']});
        setErrorMessage(null);
      },
      onError: (error) => {
        if(axios.isAxiosError(error)){
          if (error.response && error.response.data) {
          const err = error.response?.data?.errors;
          console.log('Processed error:', err);
          const errorMessages = collectErrorMessages(err);
          setErrorMessage("Disciplina Já Registrada Ao Cursos");
        }

          }
      }
  });
  return { postMatchSubject: mutate, error: errorMessage };
};

//Put

export const usePutSubject = () => {
  const [responsePutSubject, setResp] = React.useState<string>(null);
  const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: auxPutSubject,
	  onSuccess: () => {
	  	queryClient.invalidateQueries({queryKey: ['disciplinas']});
      setResp(null);
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
  }
	);
	return { putSubject: mutate, responsePutSubject };
}

//Get

export const useGetSubjectQuery = () => {
    const { data, isLoading, isError } = useQuery(
        {
          queryKey: ['disciplinas'],
          queryFn: () => axios.get("http://localhost:8000/api/disciplinas/")
        }
      );
    
      return { data, isLoading, isError };
  };

export const useGetIdSubjectQuery = (id: string) => {
    const { data, isFetched } = useQuery(
        {
          queryKey: ['disciplinas', id],
          queryFn: () => axios.get(`http://localhost:8000/api/disciplinas/${id}`),
          enabled: !!id
        }
      );
    
      return { dataSubjectId: data, isFetched};
};



