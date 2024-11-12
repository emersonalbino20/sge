import * as React from 'react';
import './App.css';
import AppRoutes from './_routes/AppRoutes';

import SistemaEscolar from './_pages/SistemaEscolar';
import TabelaResponsiva from './_pages/TabelaResponsiva';
import Index from './_pages/Index';
import ConsultasAcademicas from './_pages/ConsultasAcdemicas';
import UserDashboard from './_pages/UserDashboard';
import GlobalSearch from './_pages/GlobalSearch';
import GradesDashboard from './_pages/GradesDashboard';

function App() {
	return <AppRoutes />;
}
export default App;
