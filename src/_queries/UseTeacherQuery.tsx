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

  /*  Post */
  export  const auxPostTeacher = (data) => {
    return (axios.post(`http://localhost:8000/api/professores/`, data));
  }
  
  export  const auxPostClassToTeacher = (data) => {
    return (axios.post(`http://localhost:8000/api/professores/${data.idProfessor}/classes`, {
        disciplinaId: data.disciplinaId,
        classeId: data.classeId,
        turmaId: data.turmaId
    }));
  }

  export  const auxPostMatchSubjectTeacher = (data) => {
    return (axios.post(`http://localhost:8000/api/professores/${data.idProfessor}/disciplinas`, {
      disciplinas: data.disciplinas
    }));
  }

  /* Delete */
  const auxPostDisMatchSubjectTeacher = (data) => {
    return axios.request({
        url: `http://localhost:8000/api/professores/${data.idProfessor}/disciplinas`,
        method: 'delete',
        data: { disciplinas: data.disciplinas }
    });
};

  /* Put */
  export  const auxPutTeacher = (data) => {
    return (axios.put(`http://localhost:8000/api/professores/${data?.id}`, {
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
export const usePostTeacher = () => {
  const [postError, setResp] = React.useState<string>(null);
  const [postLevel, setLevel] = React.useState<number>(0)
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostTeacher,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['professores']});
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
  return { postTeacher: mutate, postError, postLevel};
};

export const usePostClassToTeacher = () => {
  const [postClassToError, setResp] = React.useState<string>(null);
  const [postClassToLevel, setLevel] = React.useState<number>(0)
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostClassToTeacher,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['professores']});
        setResp(' Operação realizada com sucesso!')
        console.log("successs")
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
  return { postClassToTeacher: mutate, postClassToError, postClassToLevel};
};

export const usePostMatchSubjectTeacher = () => {
  const [postMatchSubjectError, setResp] = React.useState<string>(null);
  const [postMatchSubjectLevel, setLevel] = React.useState<number>(0)
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostMatchSubjectTeacher,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['professores']});
        setResp(' Operação realizada com sucesso!')
        setLevel(1);
      },
      onError: (error) => {
        if(axios.isAxiosError(error)){
          if (error.response && error.response.data) {
            const err = error?.response?.data?.errors?.disciplinas[0];
            setResp(err)
            setLevel(2);
           }
          }
      }
  });
  return { postMatchTeacher: mutate, postMatchSubjectError, postMatchSubjectLevel};
};

//Delete
export const usePostDisMatchSubjectTeacher = () => {
  const [postDisMatchSubjectError, setResp] = React.useState<string>(null);
  const [postDisMatchSubjectLevel, setLevel] = React.useState<number>(0)
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostDisMatchSubjectTeacher,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['professores']});
        setResp(' Operação realizada com sucesso!')
        setLevel(1);
      },
      onError: (error) => {
        if(axios.isAxiosError(error)){
          if (error.response && error.response.data) {
            const err = error?.response?.data?.errors?.disciplinas[0];
            setResp(err)
            setLevel(2);
           }
          }
      }
  });
  return { postDisMtachTeacher: mutate, postDisMatchSubjectError, postDisMatchSubjectLevel};
};

//Put
export const usePutTeacher = () => {
  const [updateError, setResp] = React.useState<string>(null);
  const [updateLevel, setLevel] = React.useState<number>(0)
  const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: auxPutTeacher,
	  onSuccess: () => {
	  	queryClient.invalidateQueries({queryKey: ['professores']});
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
	return { putTeacher: mutate, updateError, updateLevel };
}

//Get

export const useGetTeacherQuery = () => {
    const { data, isLoading, isError } = useQuery(
        {
          queryKey: ['professores'],
          queryFn: () => axios.get("http://localhost:8000/api/professores/")
        }
      );
    
      return { data, isLoading, isError };
  };

export const useGetIdTeacherdQuery = (id: string) => {
    const { data, isFetched } = useQuery(
        {
          queryKey: ['professores', id],
          queryFn: () => axios.get(`http://localhost:8000/api/professores/${id}`),
          enabled: !!id
        }
      );
    
      return { dataTeacherId: data, isFetched};
};

export const useGetIdTeacherSubjectsdQuery = (id: string) => {
  const { data, isFetched } = useQuery(
      {
        queryKey: ['disciplinasprofessores', id],
        queryFn: () => axios.get(`http://localhost:8000/api/professores/${id}/disciplinas`),
        enabled: !!id
      }
    );
  
    return { dataTeacherSubjects: data};
};

export const useGetIdTeacherGradesdQuery = (id: string) => {
  const { data, isFetched } = useQuery(
      {
        queryKey: ['classesprofessores', id],
        queryFn: () => axios.get(`http://localhost:8000/api/professores/${id}/classes`),
        enabled: !!id
      }
    );
    return { dataTeacherGrades: data};
};

