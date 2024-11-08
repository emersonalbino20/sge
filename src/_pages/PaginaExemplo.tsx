import * as React from 'react';
import TabelaBase from './TabelaResponsiva';
import TabelaResponsiva from './TabelaResponsiva';

const PaginaExemplo = () => {
  const colunas = ["Nome", "Matricula", "Turma", "Telefone", "Email", "Status", "Ações"];
  const dados = [
    {
      id: 1,
      nome: "Alexandre",
      matricula: "2024001",
      turma: "9º Ano A",
      email: "joao.silva@email.com",
      telefone: "(11) 99999-9999",
      status: "Ativo"
    },
    {
      id: 2,
      nome: "Maria Santos",
      matricula: "2024002",
      turma: "9º Ano B",
      email: "maria.santos@email.com",
      telefone: "(11) 98888-8888",
      status: "Ativo"
    },
    {
      id: 3,
      nome: "Pedro Oliveira",
      matricula: "2024003",
      turma: "9º Ano A",
      email: "pedro.oliveira@email.com",
      telefone: "(11) 97777-7777",
      status: "Inativo"
    },
    {
      id: 4,
      nome: "Ana Costa",
      matricula: "2024004",
      turma: "9º Ano C",
      email: "ana.costa@email.com",
      telefone: "(11) 96666-6666",
      status: "Ativo"
    },
    {
      id: 5,
      nome: "Lucas Ferreira",
      matricula: "2024005",
      turma: "9º Ano B",
      email: "lucas.ferreira@email.com",
      telefone: "(11) 95555-5555",
      status: "Ativo"
    }
  ];

  const renderAcoes = (linha) => (
    <>
      <button onClick={() => alert(`Exibir detalhes de ${linha.Nome}`)} className="bg-blue-500 text-white px-2 py-1 mr-2 rounded">Detalhes</button>
      <button onClick={() => alert(`Editar ${linha.Nome}`)} className="bg-green-500 text-white px-2 py-1 rounded">Editar</button>
      <button onClick={() => alert(`Editar ${linha.Nome}`)} className="bg-green-500 text-white px-2 py-1 rounded">Editar</button>
      <button onClick={() => alert(`Editar ${linha.Nome}`)} className="bg-green-500 text-white px-2 py-1 rounded">Editar</button>
      <button onClick={() => alert(`Editar ${linha.Nome}`)} className="bg-green-500 text-white px-2 py-1 rounded">Editar</button>
    </>
  );

  return <TabelaResponsiva colunas={colunas} dados={dados} renderAcoes={renderAcoes} />;
};

export default PaginaExemplo;
