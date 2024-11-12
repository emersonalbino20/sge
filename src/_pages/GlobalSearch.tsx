import * as React from 'react';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

// Consultas essenciais para gestão escolar
const SEARCH_TYPES = {
	students: {
		title: 'Alunos',
		queries: [
			{
				id: 1,
				title: 'Frequência por Aluno',
				description: 'Visualize o histórico de presença/faltas de cada aluno',
			},
			{
				id: 2,
				title: 'Notas por Período',
				description: 'Boletim completo com notas em todas as disciplinas',
			},
			{
				id: 3,
				title: 'Situação Financeira',
				description: 'Status de mensalidades e pagamentos pendentes',
			},
			{
				id: 4,
				title: 'Histórico de Ocorrências',
				description: 'Registro de eventos disciplinares e observações',
			},
			{
				id: 5,
				title: 'Alunos por Turma',
				description: 'Lista de alunos matriculados em cada turma',
			},
		],
	},
	academic: {
		title: 'Acadêmico',
		queries: [
			{
				id: 6,
				title: 'Desempenho por Turma',
				description: 'Média geral e estatísticas de aproveitamento',
			},
			{
				id: 7,
				title: 'Diário de Classe',
				description: 'Registro de aulas, conteúdos e frequência',
			},
			{
				id: 8,
				title: 'Horários de Aula',
				description: 'Grade horária por turma e professor',
			},
			{
				id: 9,
				title: 'Calendário Escolar',
				description: 'Eventos, provas e atividades programadas',
			},
			{
				id: 10,
				title: 'Planos de Aula',
				description: 'Planejamento pedagógico por disciplina',
			},
		],
	},
	financial: {
		title: 'Financeiro',
		queries: [
			{
				id: 11,
				title: 'Mensalidades em Atraso',
				description: 'Lista de inadimplências e valores pendentes',
			},
			{
				id: 12,
				title: 'Previsão de Receitas',
				description: 'Projeção financeira do período',
			},
			{
				id: 13,
				title: 'Controle de Bolsistas',
				description: 'Alunos com desconto ou bolsa integral',
			},
			{
				id: 14,
				title: 'Balanço Mensal',
				description: 'Relatório de receitas e despesas',
			},
		],
	},
	staff: {
		title: 'Funcionários',
		queries: [
			{
				id: 15,
				title: 'Carga Horária Docente',
				description: 'Horas-aula por professor e disponibilidade',
			},
			{
				id: 16,
				title: 'Frequência de Funcionários',
				description: 'Registro de presença da equipe',
			},
			{
				id: 17,
				title: 'Avaliação de Desempenho',
				description: 'Resultados de avaliações periódicas',
			},
		],
	},
	infrastructure: {
		title: 'Infraestrutura',
		queries: [
			{
				id: 18,
				title: 'Ocupação de Salas',
				description: 'Status de uso dos espaços físicos',
			},
			{
				id: 19,
				title: 'Manutenções Programadas',
				description: 'Agenda de manutenção predial e equipamentos',
			},
			{
				id: 20,
				title: 'Inventário',
				description: 'Controle de materiais e equipamentos',
			},
		],
	},
};

const GlobalSearch = () => {
	const [selectedQuery, setSelectedQuery] = useState(null);
	const [searchResults, setSearchResults] = useState(null);

	const handleSearch = () => {
		// Exemplo de resultados (adaptar baseado na consulta selecionada)
		setSearchResults([
			{ id: 1, name: 'João Silva', class: '3º Ano A', status: 'Regular' },
			{ id: 2, name: 'Maria Santos', class: '3º Ano A', status: 'Regular' },
			{ id: 3, name: 'Pedro Souza', class: '3º Ano B', status: 'Pendente' },
		]);
	};

	return (
		<div className="w-full max-w-6xl mx-auto p-4 space-y-6 bg-white">
			<h1 className="text-2xl font-bold text-blue-700">Pesquisa Global</h1>

			<Tabs defaultValue="students" className="w-full">
				<TabsList className="grid w-full max-w-4xl grid-cols-5 bg-blue-50">
					{Object.entries(SEARCH_TYPES).map(([key, value]) => (
						<TabsTrigger
							key={key}
							value={key}
							className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
						>
							{value.title}
						</TabsTrigger>
					))}
				</TabsList>

				{Object.entries(SEARCH_TYPES).map(([key, value]) => (
					<TabsContent key={key} value={key} className="mt-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{value.queries.map((query) => (
								<Card
									key={query.id}
									className={`cursor-pointer transition-all hover:shadow-lg border-blue-100 ${
										selectedQuery?.id === query.id
											? 'ring-2 ring-blue-500 bg-blue-50'
											: 'hover:bg-blue-50'
									}`}
									onClick={() => setSelectedQuery(query)}
								>
									<CardHeader>
										<CardTitle className="text-lg text-blue-700">
											{query.title}
										</CardTitle>
										<CardDescription className="text-blue-600/70">
											{query.description}
										</CardDescription>
									</CardHeader>
								</Card>
							))}
						</div>
					</TabsContent>
				))}
			</Tabs>

			{selectedQuery && (
				<div className="space-y-6">
					<Card className="border-blue-100">
						<CardHeader className="bg-blue-50">
							<CardTitle className="text-blue-700">
								Filtros - {selectedQuery.title}
							</CardTitle>
						</CardHeader>
						<CardContent className="flex gap-4 pt-6">
							<Input
								placeholder="Digite sua busca..."
								className="max-w-sm border-blue-200 focus:ring-blue-500 focus:border-blue-500"
							/>
							<Button
								onClick={handleSearch}
								className="bg-blue-600 hover:bg-blue-700 text-white"
							>
								<Search className="w-4 h-4 mr-2" />
								Buscar
							</Button>
						</CardContent>
					</Card>

					{searchResults && (
						<Card className="border-blue-100">
							<CardHeader className="bg-blue-50">
								<CardTitle className="text-blue-700">Resultados</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b border-blue-200 bg-blue-50">
												<th className="text-left p-2 text-blue-700">Nome</th>
												<th className="text-left p-2 text-blue-700">Turma</th>
												<th className="text-left p-2 text-blue-700">Status</th>
											</tr>
										</thead>
										<tbody>
											{searchResults.map((result) => (
												<tr
													key={result.id}
													className="border-b border-blue-100 hover:bg-blue-50"
												>
													<td className="p-2">{result.name}</td>
													<td className="p-2">{result.class}</td>
													<td className="p-2">
														<span
															className={`px-2 py-1 rounded-full text-sm ${
																result.status === 'Regular'
																	? 'bg-green-100 text-green-700'
																	: 'bg-red-100 text-red-700'
															}`}
														>
															{result.status}
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			)}
		</div>
	);
};

export default GlobalSearch;
