import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getCookies } from '@/_cookies/Cookies';

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
const auxPostStudent = (data) => {
	return axios.post('http://localhost:8000/api/matriculas/', data, {
		headers: {
			'Content-Type': 'application/json',
		},
		responseType: 'blob',
	});
};

const auxPostConfirmEnrollment = (data) => {
	return axios.post(
		`http://localhost:8000/api/alunos/${data.id}/matriculas/confirm`,
		data,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			responseType: 'blob',
		}
	);
};

const auxPostGuardianStudent = (data) => {
	return axios.post(
		`http://localhost:8000/api/alunos/${getCookies('idAluno')}/responsaveis`,
		data
	);
};

/* Put */
const auxPutStudent = (data) => {
	return axios.put(`http://localhost:8000/api/alunos/${data.id}`, data);
};

//Main Functions

//Post
export const usePostStudent = () => {
	const [postError, setResp] = React.useState<string>('');
	const [postLevel, setLevel] = React.useState<number>(null);
	const [count, setCount] = React.useState<number>(0);
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: auxPostStudent,
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ['alunos'] });
			setResp(`(${count}) Operação realizada com sucesso!`);
			setLevel(1);
			const url = window.URL.createObjectURL(
				new Blob([response.data], { type: 'application/pdf' })
			);
			window.open(url, '_blank');
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
	return { postStudent: mutate, postError, postLevel };
};

export const usePostConfirmEnrollment = () => {
	const [postConfirmError, setResp] = React.useState<string>('');
	const [postConfirmLevel, setLevel] = React.useState<number>(null);
	const [count, setCount] = React.useState<number>(0);
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: auxPostConfirmEnrollment,
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ['alunos'] });
			setResp(`(${count}) Operação realizada com sucesso!`);
			setLevel(1);
			const url = window.URL.createObjectURL(
				new Blob([response.data], { type: 'application/pdf' })
			);
			window.open(url, '_blank');
		},
		onError: (error) => {
			console.log(error);
			setResp(`(${count}) Matrícula Já existe!`);
			setLevel(2);
		},
		onMutate() {
			setCount((prev) => prev + 1);
		},
	});
	return { postConfirmStudent: mutate, postConfirmError, postConfirmLevel };
};

export const usePostGuardianStudent = () => {
	const [postGuardianStudentError, setResp] = React.useState<string>('');
	const [postGuardianStudentLevel, setLevel] = React.useState<number>(null);
	const [count, setCount] = React.useState<number>(0);
	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: auxPostGuardianStudent,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['responsaveisalunos', getCookies('idAluno')],
			});
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
	return {
		postGuardianStudent: mutate,
		postGuardianStudentError,
		postGuardianStudentLevel,
	};
};

//Put
export const usePutStudent = () => {
	const [putStudentError, setResp] = React.useState<string>('');
	const [putStudentLevel, setLevel] = React.useState<number>(null);
	const [count, setCount] = React.useState<number>(0);
	const queryClient = useQueryClient();
	const { mutate, variables } = useMutation({
		mutationFn: auxPutStudent,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['alunosportuma', variables?.classeId, variables?.turmaId],
			});
			queryClient.invalidateQueries({
				queryKey: ['alunoId', variables?.id],
			});
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
	return {
		putStudent: mutate,
		putStudentError,
		putStudentLevel,
	};
};

//Get
export const useGetIdStudent = (id) => {
	const { data, isFetched } = useQuery({
		queryKey: ['alunoId', id],
		queryFn: () => axios.get(`http://localhost:8000/api/alunos/${id}`),
		enabled: !!id,
	});

	return { data, isFetched };
};

export const useGetIdGuardianStudent = () => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['responsaveisalunos', getCookies('idAluno')],
		queryFn: () =>
			axios.get(
				`http://localhost:8000/api/alunos/${getCookies('idAluno')}/responsaveis`
			),
		enabled: !!getCookies('idAluno'),
	});

	return { data, isLoading, isError };
};

export const useGetStudentByClassQuery = (classeId, turmaId) => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['alunosportuma', classeId, turmaId],
		queryFn: () =>
			axios.get(
				`http://localhost:8000/api/classes/${classeId}/alunos?turmaId=${turmaId}`
			),
	});

	return { data, isLoading, isError };
};

export const useGetStudentNotesQuery = (alunoId, trimestreId, classeId) => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['alunosnotas', alunoId, trimestreId, classeId],
		queryFn: () =>
			axios.get(
				`http://localhost:8000/api/alunos/${alunoId}/notas?trimestreId=${trimestreId}&classeId=${classeId}`
			),
		enabled: !!alunoId,
	});

	return { data, isLoading, isError };
};
