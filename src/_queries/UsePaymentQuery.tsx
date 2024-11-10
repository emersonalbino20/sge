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
   const auxPostPayment = (data) => {
    return (axios.post(`http://localhost:8000/api/metodos-pagamento/`, data));
  }

  /* Put */
  const auxPutPayment = (data) => {
    return (axios.put(`http://localhost:8000/api/metodos-pagamento/${data.id}`, data));
  }

//Main Functions

//Post

export const usePostPayment = () => {
  const [postError, setResp] = React.useState<string>('');
  const [postLevel, setLevel] = React.useState<number>(null)
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: auxPostPayment,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['metodos-pagamento']});
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
  return { postPayment: mutate, postError, postLevel };
};

//Put
export const usePutPayment = () => {
  const [putPaymentError, setResp] = React.useState<string>('');
  const [putPaymentLevel, setLevel] = React.useState<number>(null)
  const [count, setCount] = React.useState<number>(0);
  const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: auxPutPayment,
	  onSuccess: () => {
	  	queryClient.invalidateQueries({queryKey: ['metodos-pagamento']});
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
	return { putPayment: mutate, putPaymentError, putPaymentLevel };
}

//Get

export const useGetPaymentQuery = () => {
    const { data, isLoading, isError } = useQuery(
        {
          queryKey: ['metodos-pagamento'],
          queryFn: () => axios.get("http://localhost:8000/api/metodos-pagamento/")
        }
      );
    
      return { data, isLoading, isError };
  };

export const useGetIdPaymentQuery = (id: string) => {
    const { data, isFetched } = useQuery(
        {
          queryKey: ['metodos-pagamento', id],
          queryFn: () => axios.get(`http://localhost:8000/api/metodos-pagamento/${id}`),
          enabled: !!id
        }
      );
    
      return { dataPaymentId: data, isFetched};
};



