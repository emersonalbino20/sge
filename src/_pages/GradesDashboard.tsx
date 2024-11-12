import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Award, BarChart, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GradesDashboard = () => {
	const subjects = [
		{
			name: 'Matemática',
			teacher: 'Prof. Ana Silva',
			grades: [
				{ evaluation: 'Prova 1', grade: 8.5, weight: 3, date: '15/03/2024' },
				{ evaluation: 'Trabalho', grade: 9.0, weight: 2, date: '02/04/2024' },
				{ evaluation: 'Prova 2', grade: 7.5, weight: 3, date: '20/04/2024' },
			],
			average: 8.3,
			nextEval: 'Prova Final - 15/05/2024',
		},
		{
			name: 'Português',
			teacher: 'Prof. Carlos Santos',
			grades: [
				{ evaluation: 'Redação', grade: 9.0, weight: 2, date: '10/03/2024' },
				{ evaluation: 'Seminário', grade: 8.5, weight: 3, date: '05/04/2024' },
				{ evaluation: 'Prova', grade: 8.0, weight: 3, date: '25/04/2024' },
			],
			average: 8.5,
			nextEval: 'Trabalho - 10/05/2024',
		},
	];

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-2">
						<Award className="h-6 w-6 text-blue-500" />
						Notas e Avaliações
					</h1>
					<p className="text-gray-500">Ano Letivo 2024 - 1º Semestre</p>
				</div>
				<Button variant="outline" className="flex items-center gap-2">
					<Download className="h-4 w-4" />
					Exportar Boletim
				</Button>
			</div>

			{/* Resumo Geral */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart className="h-5 w-5" />
						Desempenho Geral
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<p className="text-gray-500 mb-2">Média Geral</p>
							<div className="text-3xl font-bold text-blue-500">8.4</div>
						</div>
						<div className="text-center">
							<p className="text-gray-500 mb-2">Melhor Desempenho</p>
							<div className="text-lg font-semibold">Português (8.5)</div>
						</div>
						<div className="text-center">
							<p className="text-gray-500 mb-2">Próximas Avaliações</p>
							<div className="text-lg font-semibold">2</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tabs por Disciplina */}
			<Tabs defaultValue={subjects[0].name} className="space-y-4">
				<TabsList className="grid grid-cols-2 lg:grid-cols-4">
					{subjects.map((subject) => (
						<TabsTrigger key={subject.name} value={subject.name}>
							{subject.name}
						</TabsTrigger>
					))}
				</TabsList>

				{subjects.map((subject) => (
					<TabsContent key={subject.name} value={subject.name}>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<div>
										<h3 className="text-xl">{subject.name}</h3>
										<p className="text-sm text-gray-500">{subject.teacher}</p>
									</div>
									<div className="text-right">
										<p className="text-sm text-gray-500">Média Atual</p>
										<p className="text-2xl font-bold text-blue-500">
											{subject.average}
										</p>
									</div>
								</CardTitle>
							</CardHeader>
							<CardContent>
								{/* Progresso */}
								<div className="mb-6">
									<div className="flex justify-between mb-2">
										<span className="text-sm">Progresso no Semestre</span>
										<span className="text-sm">75%</span>
									</div>
									<Progress value={75} className="h-2" />
								</div>

								{/* Tabela de Notas */}
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b">
												<th className="text-left py-2">Avaliação</th>
												<th className="text-center py-2">Nota</th>
												<th className="text-center py-2">Peso</th>
												<th className="text-right py-2">Data</th>
											</tr>
										</thead>
										<tbody>
											{subject.grades.map((grade, index) => (
												<tr key={index} className="border-b">
													<td className="py-2">{grade.evaluation}</td>
													<td className="text-center py-2">
														<span
															className={`font-semibold ${
																grade.grade >= 6
																	? 'text-green-500'
																	: 'text-red-500'
															}`}
														>
															{grade.grade.toFixed(1)}
														</span>
													</td>
													<td className="text-center py-2">{grade.weight}</td>
													<td className="text-right py-2">{grade.date}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								{/* Próxima Avaliação */}
								<div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
									<Calendar className="h-4 w-4" />
									Próxima Avaliação: {subject.nextEval}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
};

export default GradesDashboard;
