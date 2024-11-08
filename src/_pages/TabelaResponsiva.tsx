import * as React from 'react';
import { ChevronLeft, ChevronRight, Search, MoreVertical, EditIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const TabelaResponsiva = ({ colunas, dados, renderAcoes }) => {

  const [pagina, setPagina] = React.useState(1);
  const [termoBusca, setTermoBusca] = React.useState('');
  const itensPorPagina = 5;


  const dadosFiltrados = dados.filter(item =>
    Object.values(item).some(valor =>
      valor.toString().toLowerCase().includes(termoBusca.toLowerCase())
    )
  );


  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);
  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const dadosPaginados = dadosFiltrados.slice(inicio, fim);

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow">
      
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
          <Input
            type="text"
            placeholder="Buscar..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 "
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex gap-2">
        
          <select className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
            <option>10 por página</option>
            <option>25 por página</option>
            <option>50 por página</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
            {colunas.map((coluna, index) => (
            <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{coluna}</th>
             ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dadosPaginados.map((aluno) => (
              <tr key={aluno.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{aluno.nome}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{aluno.matricula}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{aluno.turma}</div>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{aluno.email}</div>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{aluno.telefone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                    ${aluno.status === 'Ativo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'}`}>
                    {aluno.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Popover >
                <PopoverTrigger asChild className='bg-white'>
              <button className="text-gray-400 hover:text-gray-600 border-none">
                <MoreVertical className="h-5 w-5" />
                </button>
                </PopoverTrigger >
                <PopoverContent className="w-80 bg-white flex space-x-2">
                {renderAcoes(aluno)}
                </PopoverContent>
              </Popover>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setPagina(Math.max(1, pagina - 1))}
            disabled={pagina === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPagina(Math.min(totalPaginas, pagina + 1))}
            disabled={pagina === totalPaginas}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Próxima
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{inicio + 1}</span> a{' '}
              <span className="font-medium">{Math.min(fim, dadosFiltrados.length)}</span> de{' '}
              <span className="font-medium">{dadosFiltrados.length}</span> resultados
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setPagina(Math.max(1, pagina - 1))}
                disabled={pagina === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-none bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {[...Array(totalPaginas)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPagina(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                    ${pagina === i + 1
                      ? 'z-10 bg-blue-50 border-none text-blue-600'
                      : 'bg-white border-none text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPagina(Math.min(totalPaginas, pagina + 1))}
                disabled={pagina === totalPaginas}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md   bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 border-none"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabelaResponsiva;