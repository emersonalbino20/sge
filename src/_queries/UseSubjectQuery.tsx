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
  const [postError, setResp] = React.useState<string>('');
  const [postLevel, setLevel] = React.useState<number>(null)
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostSubject,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['disciplinas']});
        setResp(`(${count}) Operação realizada com sucesso!`);
        setLevel(1);
      },
      onError: (error) => {
        if(axios.isAxiosError(error)){
          if (error.response && error.response.data) {
          const err = error.response?.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(`(${count}) ${errorMessages[0]}`)
          setLevel(2);
        }
          }
      }, onMutate() {
        setCount(prev=>prev+1);
      },
  });
  return { postSubject: mutate, postError, postLevel };
};

export const usePostMatchCurseToSubject = () => {
  const [postMatchError, setResp] = React.useState<string>('');
  const [postMatchLevel, setLevel] = React.useState<number>(null)
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostMatchCurseToSubject,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['disciplinas']});
        setResp(`(${count}) Operação realizada com sucesso!`)
        setLevel(1);
      },
      onError: (error) => {
        if(axios.isAxiosError(error)){
          if (error.response && error.response.data) {
          const err = error.response?.data?.errors?.disciplinas[0];
          setResp(`(${count}) ${err}`)
          setLevel(2);
        }

          }
      }, onMutate() {
        setCount(prev=>prev+1);
      }
  });
  return { postMatchSubject: mutate, postMatchError, postMatchLevel };
};

//Put
export const usePutSubject = () => {
  const [putSubjectError, setResp] = React.useState<string>('');
  const [putSubjectLevel, setLevel] = React.useState<number>(null)
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
	const { mutate, variables } = useMutation({
		mutationFn: auxPutSubject,
	  onSuccess: () => {
	  	queryClient.invalidateQueries({queryKey: ['disciplinas']});
      setResp(`(${count}) Operação realizada com sucesso!`)
      setLevel(1);
	  },
    onError: (error) => {
      if(axios.isAxiosError(error)){
        if (error.response && error.response.data) {
          const err = error.response.data?.errors;
          const errorMessages = collectErrorMessages(err);
          console.log(err)
          setResp(`(${count}) ${errorMessages[0]}`)
          setLevel(2);
         }
        }
    }, onMutate() {
      setCount(prev=>prev+1);
    },
  }
	);
	return { putSubject: mutate, putSubjectError, putSubjectLevel };
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



