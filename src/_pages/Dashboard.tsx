import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
	Users,
	GraduationCap,
	Calendar,
	Bell,
	Book,
	Clock,
	User,
	DollarSign,
	BarChart,
	CheckCircle,
	AlertCircle,
	FileText,
} from 'lucide-react';

import Header from './../_components/Header';

const Dashboard = () => {
	return (
		<div className="m-0 w-screen h-screen bg-gray-50">
			{/* Barra Superior 
			<header className="bg-white shadow">
				<div className="px-8 py-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<GraduationCap className="h-8 w-8 text-blue-600" />
						<h1 className="text-2xl font-bold">Escola Sistema</h1>
					</div>
					<div className="flex items-center gap-4">
						<Button variant="outline" size="icon">
							<Bell className="h-5 w-5" />
						</Button>
						<div className="flex items-center gap-2">
							<div className="text-right">
								<p className="font-medium">Admin</p>
								<p className="text-sm text-gray-500">admin@escola.com</p>
							</div>
							<User className="h-8 w-8 bg-gray-100 rounded-full p-1" />
						</div>
					</div>
				</div>
			</header>
			*/}
			
			<main className="p-8">
				{/* Ações Rápidas */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
					<Button className="flex items-center gap-2 h-auto py-4 text-lg">
						<Users className="h-5 w-5" />
						Nova Matrícula
					</Button>
					<Button
						variant="outline"
						className="flex items-center gap-2 h-auto py-4 text-lg"
					>
						<FileText className="h-5 w-5" />
						Lançar Notas
					</Button>
					<Button
						variant="outline"
						className="flex items-center gap-2 h-auto py-4 text-lg"
					>
						<Clock className="h-5 w-5" />
						Registrar Presença
					</Button>
					<Button
						variant="outline"
						className="flex items-center gap-2 h-auto py-4 text-lg"
					>
						<Calendar className="h-5 w-5" />
						Agendar Evento
					</Button>
				</div>

				{/* Estatísticas Principais */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardContent className="flex items-center gap-4 pt-6">
							<div className="bg-blue-100 p-3 rounded-lg">
								<Users className="h-6 w-6 text-blue-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Total de Alunos</p>
								<p className="text-2xl font-bold">1,234</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="flex items-center gap-4 pt-6">
							<div className="bg-green-100 p-3 rounded-lg">
								<GraduationCap className="h-6 w-6 text-green-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Professores</p>
								<p className="text-2xl font-bold">48</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="flex items-center gap-4 pt-6">
							<div className="bg-yellow-100 p-3 rounded-lg">
								<Book className="h-6 w-6 text-yellow-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Turmas Ativas</p>
								<p className="text-2xl font-bold">32</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="flex items-center gap-4 pt-6">
							<div className="bg-purple-100 p-3 rounded-lg">
								<DollarSign className="h-6 w-6 text-purple-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Mensalidades Pagas</p>
								<p className="text-2xl font-bold">89%</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Conteúdo Principal */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Coluna 1 - Atividades Recentes */}
					<Card className="lg:col-span-2">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<BarChart className="h-5 w-5" />
								Atividades Recentes
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								<div className="flex items-center gap-4">
									<div className="bg-green-100 p-2 rounded-full">
										<CheckCircle className="h-4 w-4 text-green-600" />
									</div>
									<div className="flex-1">
										<p className="font-medium">Nova matrícula realizada</p>
										<p className="text-sm text-gray-500">João Silva - 9º Ano</p>
									</div>
									<p className="text-sm text-gray-500">Há 2 horas</p>
								</div>

								<div className="flex items-center gap-4">
									<div className="bg-blue-100 p-2 rounded-full">
										<Book className="h-4 w-4 text-blue-600" />
									</div>
									<div className="flex-1">
										<p className="font-medium">Notas lançadas</p>
										<p className="text-sm text-gray-500">
											Matemática - 8º Ano B
										</p>
									</div>
									<p className="text-sm text-gray-500">Há 3 horas</p>
								</div>

								<div className="flex items-center gap-4">
									<div className="bg-yellow-100 p-2 rounded-full">
										<AlertCircle className="h-4 w-4 text-yellow-600" />
									</div>
									<div className="flex-1">
										<p className="font-medium">Falta registrada</p>
										<p className="text-sm text-gray-500">
											Maria Santos - 7º Ano A
										</p>
									</div>
									<p className="text-sm text-gray-500">Há 4 horas</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Coluna 2 - Calendário e Tarefas */}
					<div className="space-y-6">
						{/* Próximos Eventos */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calendar className="h-5 w-5" />
									Próximos Eventos
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div>
										<p className="font-medium">Reunião de Pais</p>
										<p className="text-sm text-gray-500">
											15 de Novembro, 19:00
										</p>
									</div>
									<div>
										<p className="font-medium">Feira de Ciências</p>
										<p className="text-sm text-gray-500">
											20 de Novembro, 14:00
										</p>
									</div>
									<div>
										<p className="font-medium">Conselho de Classe</p>
										<p className="text-sm text-gray-500">
											25 de Novembro, 13:30
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Tarefas Pendentes */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Clock className="h-5 w-5" />
									Tarefas Pendentes
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div>
										<div className="flex justify-between mb-1">
											<p className="text-sm font-medium">Lançamento de Notas</p>
											<p className="text-sm text-gray-500">70%</p>
										</div>
										<Progress value={70} className="h-2" />
									</div>
									<div>
										<div className="flex justify-between mb-1">
											<p className="text-sm font-medium">
												Registro de Frequência
											</p>
											<p className="text-sm text-gray-500">85%</p>
										</div>
										<Progress value={85} className="h-2" />
									</div>
									<div>
										<div className="flex justify-between mb-1">
											<p className="text-sm font-medium">
												Planejamento Semanal
											</p>
											<p className="text-sm text-gray-500">45%</p>
										</div>
										<Progress value={45} className="h-2" />
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
