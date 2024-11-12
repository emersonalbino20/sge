import axios from 'axios';

export const getAlunos = () => {
	return axios.get('http://localhost:8000/api/alunos/');
};

export const getAlunosId = (id) => {
	return axios.get(`http://localhost:8000/api/alunos/${id}`);
};

export const getAlunosMatriculas = (id) => {
	return axios.get(`http://localhost:8000/api/alunos/${id}/matriculas`);
};

export const getAlunosPorTurma = (classe, turma) => {
	return axios.get(
		`http://localhost:8000/api/classes/${classe}/alunos?turmaId=${turma}`
	);
};

export const getAlunosNotas = (aluno, trimestre, classe) => {
	return axios.get(
		`http://localhost:8000/api/alunos/${aluno}/notas?trimestreId=${trimestre}&classeId=${classe}`
	);
};

export const getAlunosClassesMatriculasCurso = (id) => {
	return axios.get(`http://localhost:8000/api/cursos/${id}/classes`);
};

export const postAlunos = (post) => {
	return axios.post('http://localhost:8000/api/alunos/', post);
};

export const putAlunos = (data) => {
	const dados = {
		nomeCompleto: data.nomeCompleto,
		nomeCompletoPai: data.nomeCompletoPai,
		nomeCompletoMae: data.nomeCompletoMae,
		dataNascimento: data.dataNascimento,
		genero: data.genero,
		endereco: {
			bairro: data.bairro,
			rua: data.rua,
			numeroCasa: data.numeroCasa,
		},
		contacto: {
			telefone: data.telefone,
			email: data.email,
		},
	};
	return axios.put(`http://localhost:8000/api/alunos/${data.id}`, dados);
};
export const confirmacaoAluno = (data) => {
	const dados = {
		classeId: data.classeId,
		turmaId: data.turmaId,
		turnoId: data.turnoId,
		metodoPagamentoId: data.metodoPagamentoId,
	};
	return axios.post(
		`http://localhost:8000/api/alunos/${data.id}/matriculas`,
		dados,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			responseType: 'blob',
		}
	);
};

export const matriculaAluno = (dados) => {
	return axios.post('http://localhost:8000/api/matriculas/', dados, {
		headers: {
			'Content-Type': 'application/json',
		},
		responseType: 'blob',
	});
};

export const collectErrorMessages = (obj) => {
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
