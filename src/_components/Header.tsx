import * as React from 'react';
import {
	Menu,
	X,
	ChevronDown,
	Users,
	BookOpen,
	Calendar,
	ClipboardList,
	Settings,
	Bell,
	User,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
	const [openSubMenuI, setOpenSubMenuI] = React.useState(false);
	const [openSubMenuII, setOpenSubMenuII] = React.useState(false);
	const [openSubMenuIII, setOpenSubMenuIII] = React.useState(false);

	const [menuAberto, setMenuAberto] = React.useState(false);
	const [subMenuAlunos, setSubMenuAlunos] = React.useState(false);

	const menuItems = [
		{
			titulo: 'Pessoal',
			icone: <Users className="w-5 h-5 text-white" />,
			subItems: [
				{ titulo: 'Cadastro de Alunos', link: '/StudentEnrollmentPage' },
				{ titulo: 'Lista de Alunos', link: '/StudentListPage' },
				{ titulo: 'Lista de Professores', link: '/TeacherPage' },
				{ titulo: 'Tipos de Parentesco', link: '/ParentsPage' },
				{ titulo: 'Notas', link: '/BulletinPage' },
			],
		},
		{
			titulo: 'Académica',
			icone: <BookOpen className="w-5 h-5 text-white" />,
			subItems: [
				{ titulo: 'Cursos', link: '/CursePage' },
				{ titulo: 'Disciplinas', link: '/SubjectPage' },
				{ titulo: 'Turnos', link: '/PeriodPage' },
				{ titulo: 'Salas', link: '/ClassRoomPage' },
				{ titulo: 'Ano-Lectivo', link: '/AcademicYearPage' },
			],
		},
		{
			titulo: 'Calendário',
			icone: <Calendar className="w-5 h-5 text-white" />,
			link: '/calendario',
		},
		{
			titulo: 'Notas e Avaliações',
			icone: <ClipboardList className="w-5 h-5 text-white" />,
			link: '/BulletimPage',
		},
	];

	return (
		<>
			{/* Barra Superior */}
			<nav className="bg-blue-600 text-white">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex justify-between items-center h-16">
						{/* Logo */}
						<div className="flex items-center">
							<span className="text-xl font-bold">Gestão Escolar</span>
						</div>

						{/* Menu Desktop */}
						<div className="hidden md:flex items-center space-x-4">
							{menuItems.map((item) => (
								<div key={item.titulo} className="relative group">
									<button
										className="flex items-center px-3 py-2 rounded hover:bg-blue-700 border-none"
										onClick={() =>
											item.subItems && setSubMenuAlunos(!subMenuAlunos)
										}
									>
										{item.icone}
										<span className="ml-2 text-white">{item.titulo}</span>
										{item.subItems && (
											<ChevronDown className="w-4 h-4 ml-1 text-white" />
										)}
									</button>

									{item.subItems && (
										<div className="absolute hidden group-hover:block w-48 bg-white text-gray-700 rounded shadow-lg z-20">
											{item.subItems.map((subItem, index) => (
												<span
													key={index}
													className="block px-4 py-2 hover:bg-gray-100"
												>
													<Link to={subItem.link}>{subItem.titulo}</Link>
												</span>
											))}
										</div>
									)}
								</div>
							))}
						</div>

						{/* Ícones da direita */}
						<div className="hidden md:flex items-center space-x-4">
							<button className="p-2 rounded hover:bg-blue-700  border-none">
								<Bell className="w-5 h-5 text-white" />
							</button>
							<button className="p-2 rounded hover:bg-blue-700 border-none">
								<Settings className="w-5 h-5 text-white" />
							</button>
							<button className="p-2 rounded hover:bg-blue-700 border-none">
								<User className="w-5 h-5 text-white" />
							</button>
						</div>

						{/* Botão Menu Mobile */}
						<div className="md:hidden">
							<button
								onClick={() => setMenuAberto(!menuAberto)}
								className="p-2 rounded hover:bg-blue-700 border-none"
							>
								{menuAberto ? (
									<X className="w-6 h-6 text-white" />
								) : (
									<Menu className="w-6 h-6 text-white" />
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Menu Mobile */}
				{menuAberto && (
					<div className="md:hidden">
						{menuItems.map((item) => (
							<div key={item.titulo}>
								<button
									className="w-full flex items-center px-4 py-2 hover:bg-blue-700 border-none "
									onClick={() =>
										item.subItems && setSubMenuAlunos(!subMenuAlunos)
									}
								>
									{item.icone}
									<span className="ml-2 text-white">{item.titulo}</span>
									{item.subItems && (
										<ChevronDown className="w-4 h-4 ml-1 text-white" />
									)}
								</button>

								{item.subItems && subMenuAlunos && (
									<div className="bg-blue-700">
										{item.subItems.map((subItem, index) => (
											<span
												key={index}
												className="block px-4 py-2 hover:bg-gray-100"
											>
												<Link to={subItem.link}>{subItem.titulo}</Link>
											</span>
										))}
									</div>
								)}
							</div>
						))}

						<div className="border-t border-blue-700 px-4 py-2">
							<div className="flex justify-between">
								<button className="p-2 rounded hover:bg-blue-700 border-none">
									<Bell className="w-5 h-5 text-white" />
								</button>
								<button className="p-2 rounded hover:bg-blue-700 border-none">
									<Settings className="w-5 h-5 text-white" />
								</button>
								<button className="p-2 rounded hover:bg-blue-700  border-none">
									<User className="w-5 h-5 text-white" />
								</button>
							</div>
						</div>
					</div>
				)}
			</nav>
		</>
	);
}
