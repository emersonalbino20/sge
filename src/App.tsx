import * as React from 'react';
import './App.css';
import AppRoutes from './_routes/AppRoutes';

import SistemaEscolar from './_pages/SistemaEscolar';
import TabelaResponsiva from './_pages/TabelaResponsiva';
import Index from './_pages/Index';
import ConsultasAcademicas from './_pages/ConsultasAcdemicas';
import UserDashboard from './_pages/UserDashboard';
import GradesDashboard from './_pages/GradesDashboard';
import GeneratePdf from './_pages/GeneratePdf';
import GenerateBoletim from './_pages/GenerateBulletim';
import GenerateEnrollmentConfirmation from './_pages/GenerateEnrollmentConfirmation';
import StudentGradeTable from './_pages/StudentGradeTable';
import SettingsPage from './_pages/SettingsPage';
import Dashboard from './_pages/Dashboard';
import SchoolStatistics from './_pages/SchoolStatistics';
import ImplePagin from './_components/implePagin';
function App() {
  return <AppRoutes />;
}
export default App;
