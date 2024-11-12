import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	User,
	Book,
	Calendar,
	FileText,
	Clock,
	Bell,
	Settings,
	LogOut,
} from 'lucide-react';

const UserDashboard = () => {
	return (
		<div className="min-h-screen bg-gray-100 p-8">
			{/* Header com informações do usuário */}
			<div className="mb-8 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
						<User className="h-8 w-8 text-white" />
					</div>
					<div>
						<h1 className="text-2xl font-bold">Bem-vindo(a), João Silva</h1>
						<p className="text-gray-500">Aluno - 9º Ano A</p>
					</div>
				</div>

				<div className="flex gap-4">
					<Button variant="outline" size="icon">
						<Bell className="h-5 w-5" />
					</Button>
					<Button variant="outline" size="icon">
						<Settings className="h-5 w-5" />
					</Button>
					<Button variant="outline" size="icon">
						<LogOut className="h-5 w-5" />
					</Button>
				</div>
			</div>

			{/* Grid de cards principais */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{/* Card de Horário */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Clock className="h-5 w-5" />
							Horário de Aulas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<p className="text-sm">Próxima aula: Matemática</p>
							<p className="text-sm">Horário: 10:00 - 11:30</p>
							<p className="text-sm">Sala: 203</p>
							<Button className="w-full mt-4">Ver horário completo</Button>
						</div>
					</CardContent>
				</Card>

				{/* Card de Disciplinas */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Book className="h-5 w-5" />
							Minhas Disciplinas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<span>Matemática</span>
								<span className="text-blue-500">85%</span>
							</div>
							<div className="flex justify-between items-center">
								<span>Português</span>
								<span className="text-blue-500">92%</span>
							</div>
							<Button className="w-full mt-4">Ver todas as disciplinas</Button>
						</div>
					</CardContent>
				</Card>

				{/* Card de Atividades */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5" />
							Atividades Pendentes
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<p className="text-sm">Trabalho de História - Entrega: 15/11</p>
							<p className="text-sm">
								Exercícios de Matemática - Entrega: 18/11
							</p>
							<Button className="w-full mt-4">Ver todas as atividades</Button>
						</div>
					</CardContent>
				</Card>

				{/* Card de Calendário */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5" />
							Calendário Escolar
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<p className="text-sm">Próximo evento: Feira de Ciências</p>
							<p className="text-sm">Data: 20/11</p>
							<Button className="w-full mt-4">Ver calendário completo</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default UserDashboard;
