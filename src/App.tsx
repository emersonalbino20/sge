import * as React from "react";
import './App.css';
import AppRoutes from './_routes/AppRoutes';

import SistemaEscolar from "./_pages/SistemaEscolar";
import TabelaResponsiva from "./_pages/TabelaResponsiva";
import Index from "./_pages/Index";
import PaginaExemplo from "./_pages/PaginaExemplo";

function App(){
  return  <AppRoutes/>;
}
export default App;