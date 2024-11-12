import * as React from 'react';
import { School, User, BookOpen, Calendar, Clock, MapPin } from 'lucide-react';
import IPPUImage from './../assets/images/IPPU.png';
const PaginaExemplo = () => {
	// Dados de exemplo - em produção viriam das props
	const dados = {
		escola: {
			nome: 'Escola Secundária Example',
			endereco: 'Rua Principal, nº 123',
			telefone: '(+244) 923 456 789',
			email: 'info@escolaexample.ao',
			logo: '/api/placeholder/100/100',
		},
		matricula: {
			numero: '2024/0001',
			data: '11/11/2024',
			anoLetivo: '2024/2025',
			curso: 'Ciências Físicas e Biológicas',
			turno: 'Manhã',
			classe: '10ª Classe',
			sala: 'Sala 15',
			turma: 'A',
		},
		aluno: {
			nome: 'João Manuel da Silva',
			dataNascimento: '15/05/2008',
			numeroBI: '009988776LA042',
			endereco: 'Bairro Central, Casa 45',
			telefone: '(+244) 923 123 456',
			email: 'joao.silva@email.com',
		},
		encarregado: {
			nome: 'Maria da Silva',
			parentesco: 'Mãe',
			telefone: '(+244) 923 987 654',
			email: 'maria.silva@email.com',
		},
	};

	return (
		<div className="max-w-4xl mx-auto p-8 bg-yellow-100">
			{/* Cabeçalho */}
			<div className="flex items-center justify-between border-b-2 border-blue-600 pb-4">
				<div className="flex items-center gap-4">
					<img
						src={IPPUImage}
						alt="Logo da Escola"
						className="w-16 h-16 object-contain"
					/>
					<div>
						<h1 className="text-2xl font-bold text-blue-600">
							{dados.escola.nome}
						</h1>
						<p className="text-gray-600">{dados.escola.endereco}</p>
						<p className="text-gray-600">Tel: {dados.escola.telefone}</p>
					</div>
				</div>
				<div className="text-right">
					<h2 className="text-xl font-bold text-gray-800">
						Comprovativo de Matrícula
					</h2>
					<p className="text-gray-600">Nº: {dados.matricula.numero}</p>
					<p className="text-gray-600">Data: {dados.matricula.data}</p>
				</div>
			</div>

			{/* Informações da Matrícula */}
			<div className="mt-6 bg-yellow-100p-4 rounded-lg">
				<h3 className="text-lg font-semibold text-blue-600 mb-3 flex items-center">
					<School className="w-5 h-5 mr-2" />
					Informações Académicas
				</h3>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-gray-600">
							Ano Letivo:{' '}
							<span className="font-medium">{dados.matricula.anoLetivo}</span>
						</p>
						<p className="text-gray-600">
							Curso:{' '}
							<span className="font-medium">{dados.matricula.curso}</span>
						</p>
						<p className="text-gray-600">
							Classe:{' '}
							<span className="font-medium">{dados.matricula.classe}</span>
						</p>
					</div>
					<div>
						<p className="text-gray-600">
							Turno:{' '}
							<span className="font-medium">{dados.matricula.turno}</span>
						</p>
						<p className="text-gray-600">
							Sala: <span className="font-medium">{dados.matricula.sala}</span>
						</p>
						<p className="text-gray-600">
							Turma:{' '}
							<span className="font-medium">{dados.matricula.turma}</span>
						</p>
					</div>
				</div>
			</div>

			{/* Dados do Aluno */}
			<div className="mt-6">
				<h3 className="text-lg font-semibold text-blue-600 mb-3 flex items-center">
					<User className="w-5 h-5 mr-2" />
					Dados do Aluno
				</h3>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-gray-600">
							Nome Completo:{' '}
							<span className="font-medium">{dados.aluno.nome}</span>
						</p>
						<p className="text-gray-600">
							Data de Nascimento:{' '}
							<span className="font-medium">{dados.aluno.dataNascimento}</span>
						</p>
						<p className="text-gray-600">
							Nº do BI:{' '}
							<span className="font-medium">{dados.aluno.numeroBI}</span>
						</p>
					</div>
					<div>
						<p className="text-gray-600">
							Endereço:{' '}
							<span className="font-medium">{dados.aluno.endereco}</span>
						</p>
						<p className="text-gray-600">
							Telefone:{' '}
							<span className="font-medium">{dados.aluno.telefone}</span>
						</p>
						<p className="text-gray-600">
							Email: <span className="font-medium">{dados.aluno.email}</span>
						</p>
					</div>
				</div>
			</div>

			{/* Dados do Encarregado */}
			<div className="mt-6">
				<h3 className="text-lg font-semibold text-blue-600 mb-3">
					Encarregado de Educação
				</h3>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-gray-600">
							Nome:{' '}
							<span className="font-medium">{dados.encarregado.nome}</span>
						</p>
						<p className="text-gray-600">
							Parentesco:{' '}
							<span className="font-medium">
								{dados.encarregado.parentesco}
							</span>
						</p>
					</div>
					<div>
						<p className="text-gray-600">
							Telefone:{' '}
							<span className="font-medium">{dados.encarregado.telefone}</span>
						</p>
						<p className="text-gray-600">
							Email:{' '}
							<span className="font-medium">{dados.encarregado.email}</span>
						</p>
					</div>
				</div>
			</div>

			{/* Assinaturas */}
			<div className="mt-12 pt-8 border-t border-gray-200">
				<div className="grid grid-cols-2 gap-8">
					<div className="text-center">
						<div className="border-b-2 border-gray-400 w-48 mx-auto mb-2"></div>
						<p className="text-gray-600">Assinatura do Diretor</p>
					</div>
					<div className="text-center">
						<div className="border-b-2 border-gray-400 w-48 mx-auto mb-2"></div>
						<p className="text-gray-600">Carimbo da Escola</p>
					</div>
				</div>
			</div>

			{/* Rodapé */}
			<div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
				<p>
					Este documento é válido para o ano letivo {dados.matricula.anoLetivo}
				</p>
				<p className="mt-1">Emitido em {dados.matricula.data}</p>
			</div>
		</div>
	);
};

export default PaginaExemplo;
