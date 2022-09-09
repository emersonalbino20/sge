import * as React from 'react';
import { AroundDiv, EditButton, InfoButton, TrashButton } from './MyButton';

const Tabela = () => {
    const [dadosApi, setDadosApi] = React.useState([
        { nome: 'Alice', idade: 30, cidade: 'São Paulo' },
        { nome: 'Bob', idade: 25, cidade: 'Rio de Janeiro' },
        { nome: 'Bob', idade: 25, cidade: 'Rio de Janeiro' },
        { nome: 'Bob', idade: 25, cidade: 'Rio de Janeiro' },
        { nome: 'Bob', idade: 25, cidade: 'Rio de Janeiro' },
        { nome: 'Bob', idade: 25, cidade: 'Rio de Janeiro' },
        { nome: 'Carol', idade: 28, cidade: 'Belo Horizonte' },
        { nome: 'Carol', idade: 28, cidade: 'Belo Horizonte' },
        { nome: 'Carol', idade: 28, cidade: 'Belo Horizonte' },
        { nome: 'Carol', idade: 28, cidade: 'Belo Horizonte' },
        { nome: 'Carol', idade: 28, cidade: 'Belo Horizonte' },
    ]);

    const [dados, setDados] = React.useState([
        { nome: 'Alice', idade: 30, cidade: 'São Paulo' },
        { nome: 'Bob', idade: 25, cidade: 'Rio de Janeiro' },
        { nome: 'Bob', idade: 25, cidade: 'Rio de Janeiro' },
        { nome: 'Bob', idade: 25, cidade: 'Rio de Janeiro' },
        { nome: 'Bob', idade: 25, cidade: 'Rio de Janeiro' },
        { nome: 'Bob', idade: 25, cidade: 'Rio de Janeiro' },
        { nome: 'Carol', idade: 28, cidade: 'Belo Horizonte' },
        { nome: 'Carol', idade: 28, cidade: 'Belo Horizonte' },
        { nome: 'Carol', idade: 28, cidade: 'Belo Horizonte' },
        { nome: 'Carol', idade: 28, cidade: 'Belo Horizonte' },
        { nome: 'Carol', idade: 28, cidade: 'Belo Horizonte' },
    ]);
    const handleFilter = (event) => {
        const valores = dadosApi.filter((element) =>{ return (element.nome.toLowerCase().includes(event.target.value.toLowerCase().trim())) });
        setDados(valores)
    }

  

    return (
        <>
        <div className="overflow-x-auto overflow-y-auto w-5/6 h-2/4">
            
            <table className="w-full bg-white border border-gray-200 table-fixed">
                
                <thead>
                    <tr className="text-blue-500 h-10 bg-gray-200 md:h-14">
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Nome
                     
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Idade</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Cidade</th>
                        <th className="w-1/4 py-2 px-4 border-b border-gray-200 text-left">Acção</th>
                    </tr>
                </thead>
                <tbody>
                    {dados.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b border-gray-200">{item.nome}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{item.idade}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{item.cidade}</td>
                            <td className="w-full py-2 px-4 border-b border-gray-200 lg:justify-center md:justify-center flex lg:flex-row md:flex-row  
                            lg:space-x-2 md:space-x-2 lg:space-y-0 md:space-y-0 flex-col items-center space-y-2">
                                <div className={AroundDiv}><EditButton/>
                                </div>
                                <div className={AroundDiv}><TrashButton/>
                                </div>
                                <div className={AroundDiv}><InfoButton/>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div></>
    );
};

export default Tabela;
