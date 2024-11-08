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
   const auxPostCurse = (data) => {
    return (axios.post(`http://localhost:8000/api/cursos/`, data));
  }
  
  const auxPostGradeToCurse = (data) => {
    return (axios.post(`http://localhost:8000/api/cursos/${data.idCursos}/classes`, {
      "nome": data.nome,
      "ordem": data.ordem,
      "valorMatricula": data.valorMatricula
    }));
  }

  const auxPostMatchCurseToCurse = (data) => {
    return (axios.post(`http://localhost:8000/api/cursos/${data.idCursos}/disciplinas`, {
      "disciplinas": data.disciplinas
    }));
  }

  /* Delete */
  const auxPostDisMatchCurseToCurse = (data) => {
    return axios.request({
        url: `http://localhost:8000/api/cursos/${data.idCursos}/disciplinas`,
        method: 'delete',
        data: { disciplinas: data.disciplinas }
    });
};

/* Put */
  const auxPutCurse = (data) => {
    return (axios.put(`http://localhost:8000/api/cursos/${data.id}`, data));
  }

//Main Functions

//Post
export const usePostCurse = () => {
  const [postError, setResp] = React.useState<string>(null);
  const [postLevel, setLevel] = React.useState<number>(0)
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostCurse,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['cursos']});
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
  return { postCurse: mutate, postError, postLevel };
};

export const usePostGradeToCurse = () => {
  const [postGradeError, setResp] = React.useState<string>(null);
  const [postGradeLevel, setLevel] = React.useState<number>(0)
  const queryClient = useQueryClient();
  const { mutate, variables } = useMutation({
    mutationFn: auxPostGradeToCurse,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['cursos']});
        setResp(' Operação realizada com sucesso!')
        setLevel(1);
      },
      onError: (error) => {
        if(axios.isAxiosError(error)){
          if (error.response && error.response.data) {
            const err = error.response.data?.message;
            setResp(err)
            setLevel(2);
           }
          }
      }
  });
  return { postGradeCurse: mutate, postGradeError, postGradeLevel };
};

export const usePostMatchSubjectToCurse = () => {
  const [postMatchError, setResp] = React.useState<string>(null);
  const [postMatchLevel, setLevel] = React.useState<number>(0)
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostMatchCurseToCurse,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['cursos']});
        console.log("success")
        setResp(' Operação realizada com sucesso!')
        setLevel(1);
      },
      onError: (error) => {
        if(axios.isAxiosError(error)){
          if (error.response && error.response.data) {
          const err = error.response?.data?.errors?.disciplinas[0];
          setResp(err);
          setLevel(2);
        }
          }
      }
  });
  return { postMatchCurse: mutate, postMatchError, postMatchLevel };
};

//Delete
export const usePostDisMatchSubjectToCurse = () => {
  const [postDisMatchError, setResp] = React.useState<string>(null);
  const [postDisMatchLevel, setLevel] = React.useState<number>(0)
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostDisMatchCurseToCurse,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['cursos']});
        setResp(' Operação realizada com sucesso!')
        setLevel(1);
      },
      onError: (error) => {
        if(axios.isAxiosError(error)){
          if (error.response && error.response.data) {
            const err = error.response?.data?.errors?.disciplinas[0];
            setResp(err)
            setLevel(2);
        }

          }
      }
  });
  return { postDisMatchCurse: mutate, postDisMatchError, postDisMatchLevel};
};

//Put

export const usePutCurse = () => {
  const [putError, setResp] = React.useState<string>(null);
  const [putLevel, setLevel] = React.useState<number>(0)
  const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: auxPutCurse,
	  onSuccess: () => {
	  	queryClient.invalidateQueries({queryKey: ['cursos']});
      setResp(' Operação realizada com sucesso!')
      setLevel(1);
	  },
    onError: (error) => {
      if(axios.isAxiosError(error)){
        if (error.response && error.response.data) {
          const err = error.response.data?.errors;
          const errorMessages = collectErrorMessages(err);
          setResp(errorMessages[0]);
          setLevel(2);
         }
        }
    }
  }
	);
	return { putCurse: mutate, putError, putLevel };
}

//Get

export const useGetCurseQuery = () => {
    const { data, isLoading, isError } = useQuery(
        {
          queryKey: ['cursos'],
          queryFn: () => axios.get("http://localhost:8000/api/cursos/")
        }
      );
      return { data, isLoading, isError };
  };

export const useGetIdCurseQuery = (id: string) => {
    const { data, isFetched } = useQuery(
        {
          queryKey: ['cursos', id],
          queryFn: () => axios.get(`http://localhost:8000/api/cursos/${id}`),
          enabled: !!id
        }
      );
      return { dataCurseId: data, isFetched};
};

export const useGetIdGradeCurseQuery = (id: number) => {
  const { data, isFetched } = useQuery(
      {
        queryKey: ['classescurso', id],
        queryFn: () => axios.get(`http://localhost:8000/api/cursos/${id}/classes`),
        enabled: !!id
      }
    );
    return { dataGradesCurse: data };
};


