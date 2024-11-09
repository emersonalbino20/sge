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
  export  const auxPostAcademic = (data) => {
    return (axios.post(`http://localhost:8000/api/ano-lectivos/`, data));
  }

  export  const auxPostTerm = (data) => {
    return (axios.post(`http://localhost:8000/api/trimestres/`, data));
  }

  export  const auxPostGradeToAcademic = (data) => {
    return (axios.post(`http://localhost:8000/api/ano-lectivos/${data.id}/classes`, {
      nome: data.nome,
      ordem: data.ordem,
      cursoId: data.cursoId,
      valorMatricula: data.valorMatricula
    }));
  }

  /* Patch */
  export const auxPatchAcademic = (data) => {
    return (axios.patch(`http://localhost:8000/api/ano-lectivos/${data.id}`, {activo: data.activo, matriculaAberta: data.matriculaAberta}));
    }

  /* Put */
  export  const auxPutAcademic = (data) => {
    return (axios.put(`http://localhost:8000/api/ano-lectivos/${data.id}`, {
      inicio: data.inicio,
      termino: data.termino,
      matriculaAberta: data.matriculaAberta
    }
    ));
  }

//Main Functions

//Post
export const usePostAcademic = () => {
  const [postError, setResp] = React.useState<string>('');
  const [postLevel, setLevel] = React.useState<number>(null)
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostAcademic,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['ano-lectivos']});
        setResp(`(${count}) Operação realizada com sucesso!`);
        setLevel(1);
      },
      onError: (error) => {
        if(axios.isAxiosError(error)){
          console.log(error)
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
  return { postAcademic: mutate, postLevel, postError };
};

export const usePostTerm = () => {
  const [postTermError, setResp] = React.useState<string>('');
  const [postTermLevel, setLevel] = React.useState<number>(null)
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostTerm,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['ano-lectivos']});
        setResp(`(${count}) Operação realizada com sucesso!`);
        console.log('success');
        setLevel(1);
      },
      onError: (error) => {
        console.log(error)
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
  return { postTerm: mutate, postTermLevel, postTermError };
};

export const usePostGradeToAcademic = () => {
  const [postGradeError, setResp] = React.useState<string>('');
  const [postGradeLevel, setLevel] = React.useState<number>(null)
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate, variables } = useMutation({
    mutationFn: auxPostGradeToAcademic,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['ano-lectivos']});
        setResp(`(${count}) Operação realizada com sucesso!`);
        console.log('success');
        setLevel(1);
      },
      onError: (error) => {
        console.log(error)
        if(axios.isAxiosError(error)){
          console.log(error)
          console.log(variables)
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
  return { postGrade: mutate, postGradeLevel, postGradeError };
};

//Patch
export const usePatchAcademic = () => {
  const [patchError, setResp] = React.useState<string>('');
  const [patchLevel, setLevel] = React.useState<number>(null)
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate, variables } = useMutation({
    mutationFn: auxPatchAcademic,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['ano-lectivos']});
        setResp(`(${count}) Operação realizada com sucesso!`);
        setLevel(1);
      },
      onError: (error) => {
        if(axios.isAxiosError(error)){
          console.log(error)
          console.log(variables)
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
  return { patchAcademic: mutate, patchLevel, patchError };
};

//Put
export const usePutAcademic = () => {
  const [putError, setResp] = React.useState<string>('');
  const [putLevel, setLevel] = React.useState<number>(null)
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: auxPutAcademic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ano-lectivos'] });
      setResp(`(${count}) Operação realizada com sucesso!`);
      setLevel(1);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.log(error)
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

  return { putAcademic: mutate, putError, putLevel };
};

//Get

export const useGetAcademicQuery = () => {
    const { data, isLoading, isError } = useQuery(
        {
          queryKey: ['ano-lectivos'],
          queryFn: () => axios.get("http://localhost:8000/api/ano-lectivos/")
        }
      );
    
      return { data, isLoading, isError };
  };

export const useGetIdAcademicQuery = (id: number) => {
    const { data, isFetched } = useQuery(
        {
          queryKey: ['ano-lectivos', id],
          queryFn: () => axios.get(`http://localhost:8000/api/ano-lectivos/${id}`),
          enabled: !!id
        }
      );
    
      return { dataAcademicById: data, isFetched};
};



