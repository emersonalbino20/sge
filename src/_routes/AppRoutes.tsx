import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PrivateRoutes, ProtectLogin } from './PrivateRoutes';

const Index = lazy(() => import('../_pages/Index'));
const HomePage = lazy(() => import('../_pages/HomePage'));
const StudentEnrollmentPage = lazy(
	() => import('../_pages/StudentEnrollmentPage')
);
const StudentListPage = lazy(() => import('../_pages/StudentListPage'));
const TeacherPage = lazy(() => import('../_pages/TeacherPage'));
const PersonInchargePage = lazy(() => import('../_pages/PersonInchargePage'));
const CursePage = lazy(() => import('../_pages/CursePage'));
const SubjectPage = lazy(() => import('../_pages/SubjectPage'));
const AcademicYearPage = lazy(() => import('../_pages/AcademicYearPage'));
const GradePage = lazy(() => import('../_pages/GradePage'));
const ClassRoomPage = lazy(() => import('../_pages/ClassRoomPage'));
const PeriodPage = lazy(() => import('../_pages/PeriodPage'));
const PaymentPage = lazy(() => import('../_pages/PaymentPage'));
const ParentsPage = lazy(() => import('../_pages/ParentsPage'));
const BulletinPage = lazy(() => import('../_pages/BulletinPage'));
const ExportBulletinPage = lazy(() => import('../_pages/ExportBulletinPage'));

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Suspense
				fallback={
					<div className="w-10 h-10 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
				}
			>
				<Routes>
					<Route element={<ProtectLogin />}>
						<Route path="/" element={<Index />} />
					</Route>
					<Route element={<PrivateRoutes />}>
						<Route path="/Home" element={<HomePage />} />
						<Route
							path="/StudentEnrollmentPage"
							element={<StudentEnrollmentPage />}
						/>
						<Route path="/StudentListPage" element={<StudentListPage />} />
						<Route path="/TeacherPage" element={<TeacherPage />} />
						<Route
							path="/PersonInchargePage"
							element={<PersonInchargePage />}
						/>
						<Route path="/CursePage" element={<CursePage />} />
						<Route path="/SubjectPage" element={<SubjectPage />} />
						<Route path="/AcademicYearPage" element={<AcademicYearPage />} />
						<Route path="/GradePage" element={<GradePage />} />
						<Route path="/ClassRoomPage" element={<ClassRoomPage />} />
						<Route path="/PeriodPage" element={<PeriodPage />} />
						<Route path="/PaymentPage" element={<PaymentPage />} />
						<Route path="/ParentsPage" element={<ParentsPage />} />
						<Route path="/BulletinPage" element={<BulletinPage />} />
						<Route
							path="/ExportBulletinPage"
							element={<ExportBulletinPage />}
						/>
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}
