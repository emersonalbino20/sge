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
const auxPostTerm = (data) => {
	return axios.post(`http://localhost:8000/api/trimestres/`, data);
};

/* Put */
const auxPutTerm = (data) => {
	return axios.put(`http://localhost:8000/api/trimestres/${data.id}`, data);
};

//Main Functions

//Post

export const usePostTerm = () => {
	const [postError, setResp] = React.useState<string>('');
	const [postLevel, setLevel] = React.useState<number>(null);
	const [count, setCount] = React.useState<number>(0);
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: auxPostTerm,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['trimestres'] });
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
	return { postTerm: mutate, postError, postLevel };
};

//Put
export const usePutTerm = () => {
	const [putTermError, setResp] = React.useState<string>('');
	const [putTermLevel, setLevel] = React.useState<number>(null);
	const [count, setCount] = React.useState<number>(0);
	const queryClient = useQueryClient();
	const { mutate, variables } = useMutation({
		mutationFn: auxPutTerm,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['trimestres'] });
			setResp(`(${count}) Operação realizada com sucesso!`);
			setLevel(1);
		},
		onError: (error) => {
			if (axios.isAxiosError(error)) {
				if (error.response && error.response.data) {
					const err = error.response.data?.errors;
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
	return { putTerm: mutate, putTermError, putTermLevel };
};

//Get

export const useGetTermQuery = () => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['trimestres'],
		queryFn: () => axios.get('http://localhost:8000/api/trimestres/'),
	});

	return { data, isLoading, isError };
};

export const useGetIdTermQuery = (id: string) => {
	const { data, isFetched } = useQuery({
		queryKey: ['trimestres', id],
		queryFn: () => axios.get(`http://localhost:8000/api/trimestres/${id}`),
		enabled: !!id,
	});

	return { dataTermId: data, isFetched };
};
