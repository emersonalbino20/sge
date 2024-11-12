import * as React from 'react';
import { Link } from 'react-router-dom';
import {
	Home,
	Users,
	BookOpen,
	Calendar,
	ClipboardList,
	Menu,
	X,
	ChevronDown,
	Bell,
	Settings,
	User,
} from 'lucide-react';

function Header() {
	const [openSubMenu, setOpenSubMenu] = React.useState(null);
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

	const menuItems = [
		{
			titulo: 'Início',
			icone: <Home className="w-5 h-5 text-white" />,
			link: '/Home',
		},
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
			link: '/ExportBulletinPage',
		},
		{
			titulo: 'Configuração',
			icone: <Settings className="w-5 h-5 text-white" />,
			link: '/config',
		},
	];

	const toggleSubMenu = (index) => {
		setOpenSubMenu(openSubMenu === index ? null : index);
	};

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	return (
		<>
			{/* Barra Superior */}
			<nav className="bg-blue-600 text-white">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex justify-between items-center h-16 md:h-20">
						{/* Logo 
						<div className="flex items-center">
							<span className="text-xl font-bold md:text-2xl">
								Gestão Escolar
							</span>
						</div>
						*/}
						{/* Menu Desktop */}
						<div className="hidden md:flex items-center space-x-6">
							{menuItems.map((item, index) => (
								<div key={item.titulo} className="relative group">
									{item.subItems ? (
										<button
											className="flex items-center px-2 py-2 rounded hover:bg-blue-700 border-none"
											onClick={() => toggleSubMenu(index)}
										>
											{item.icone}
											<span className="ml-2 text-white text-base">
												{item.titulo}
											</span>
											<ChevronDown className="w-4 h-4 ml-1 text-white" />
										</button>
									) : (
										<Link
											to={item.link}
											className="flex items-center px-3 py-2 rounded hover:bg-blue-700 border-none"
										>
											{item.icone}
											<span className="ml-2 text-white text-base">
												{item.titulo}
											</span>
										</Link>
									)}

									{item.subItems && openSubMenu === index && (
										<div className="absolute block w-48 bg-white text-gray-700 rounded shadow-lg z-20">
											{item.subItems.map((subItem, subIndex) => (
												<Link
													key={subIndex}
													to={subItem.link}
													className="block px-4 py-2 hover:bg-gray-100"
												>
													{subItem.titulo}
												</Link>
											))}
										</div>
									)}
								</div>
							))}
						</div>

						{/* Ícones da direita */}
						<div className="hidden md:flex items-center space-x-4">
							<button className="p-2 rounded hover:bg-blue-700 border-none">
								<Bell className="w-5 h-5 text-white" />
							</button>
							<button className="p-2 rounded hover:bg-blue-700 border-none">
								<User className="w-5 h-5 text-white" />
							</button>
						</div>

						{/* Botão Menu Mobile */}
						<div className="md:hidden">
							<button
								onClick={toggleMobileMenu}
								className="p-2 rounded hover:bg-blue-700 border-none"
							>
								{mobileMenuOpen ? (
									<X className="w-6 h-6 text-white" />
								) : (
									<Menu className="w-6 h-6 text-white" />
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Menu Mobile */}
				{mobileMenuOpen && (
					<div className="md:hidden bg-blue-600 px-4 py-2 space-y-2">
						{menuItems.map((item, index) => (
							<div key={item.titulo}>
								{item.subItems ? (
									<>
										<button
											className="w-full flex items-center px-4 py-2 hover:bg-blue-700 border-none"
											onClick={() => toggleSubMenu(index)}
										>
											{item.icone}
											<span className="ml-2 text-white text-base">
												{item.titulo}
											</span>
											<ChevronDown className="w-4 h-4 ml-1 text-white" />
										</button>
										{openSubMenu === index && (
											<div className="bg-blue-700 px-4 py-2 space-y-2">
												{item.subItems.map((subItem, subIndex) => (
													<Link
														key={subIndex}
														to={subItem.link}
														className="block px-4 py-2 hover:bg-gray-600 text-base"
													>
														{subItem.titulo}
													</Link>
												))}
											</div>
										)}
									</>
								) : (
									<Link
										to={item.link}
										className="w-full flex items-center px-4 py-2 hover:bg-blue-700 border-none"
									>
										{item.icone}
										<span className="ml-2 text-white text-base">
											{item.titulo}
										</span>
									</Link>
								)}
							</div>
						))}
					</div>
				)}
			</nav>
		</>
	);
}

export default Header;
