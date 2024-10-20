import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom'

export default function(){
    return ( <div className="bg-blue-800 text-white w-80 p-4">
    <h1 className="text-2xl font-bold mb-6">Menu</h1>
    <nav className="flex flex-col space-y-4">
      <Link to="/" className="hover:bg-blue-700 p-2 rounded">
        Início
      </Link>
      <Link to="/about" className="hover:bg-blue-700 p-2 rounded">
        Sobre
      </Link>
      <Link to="/services" className="hover:bg-blue-700 p-2 rounded">
        Serviços
      </Link>
      <Link to="/contact" className="hover:bg-blue-700 p-2 rounded">
        Contato
      </Link>
    </nav>
  </div>);
}