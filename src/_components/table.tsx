import * as React from 'react';
import { AroundDiv, EditButton, InfoButton, TrashButton } from './MyButton';
import { AlertTriangle, Search } from 'lucide-react';

export const trStyle = "text-base md:text-lg lg:text-xl text-blue-500 h-14 bg-gradient-to-r from-gray-300 via-gray-300 to-gray-200 md:h-14";
export const thStyle = "text-base md:text-lg lg:text-xl py-2 px-4 border-b border-gray-200 text-left";
export const tdStyle = "text-base md:text-lg lg:text-xl py-2 px-4 border-b border-gray-200";
export const tdStyleButtons = "w-full py-2 px-4 border-b border-gray-200 lg:justify-center md:justify-center flex lg:flex-row md:flex-row lg:space-x-2 md:space-x-2 lg:space-y-0 md:space-y-0 flex-col items-center space-y-2";

const Tabela = () => {
    
    const [dadosApi, setDadosApi] = React.useState([
        { nome: 'Alice', idade: 30, cidade: 'São Paulo' },
        { nome: 'Bob', idade: 25, cidade: 'Rio de Janeiro' },
        { nome: 'Bob', idade: 25, cidade: 'Rio de Janeiro' },
        { nome: 'Bob', idade: 25, cidade: 'Rio de Janeiro' },
        { nome: 'Carol', idade: 28, cidade: 'Belo Horizonte' },
        { nome: 'Carol', idade: 28, cidade: 'Belo Horizonte' },
    ]);

    const [dados, setDados] = React.useState([
        { nome: 'Alice', idade: 30, cidade: 'São Paulo' },
        { nome: 'Bob', idade: 25, cidade: 'Rio de Janeiro' },
        { nome: 'Bob', idade: 25, cidade: 'Rio de Janeiro' },
        { nome: 'Bob', idade: 25, cidade: 'Rio de Janeiro' },
        { nome: 'Carol', idade: 28, cidade: 'Belo Horizonte' },
        { nome: 'Carol', idade: 28, cidade: 'Belo Horizonte' },
    ]);

    const columns = ['Nome', 'Idade', 'Cidade', 'Acção'];
    const handleFilter = (event) => {
        const valores = dadosApi.filter((element) =>{ return (element.nome.toLowerCase().includes(event.target.value.toLowerCase().trim())) });
        setDados(valores)
    }

    return (
        <div className='flex flex-col space-y-2 justify-center w-[90%]'>
            <div className='relative flex justify-start items-center -space-x-2 w-[80%] md:w-80 lg:w-96'>
                <Search className='absolute text-gray-300'/>            
                <input className=' pl-6 rounded-md border-2 border-gray-400 placeholder:text-gray-400 placeholder:font-bold outline-none py-2 w-full indent-2' type='text' placeholder='Procure por registros...' onChange={handleFilter}/>
            </div>
            
        <div className="overflow-x-auto overflow-y-auto w-full  h-80 md:h-1/2 lg:h-1/3">
            
            <table className="w-full bg-white border border-gray-200 table-fixed">
                
                <thead className='sticky top-0 z-10'>
                    <tr className={trStyle}>
                        {columns.map((element, index) =>{ return( <th key={index} className={thStyle} >{element}</th>) })}
                    </tr>
                </thead>
                <tbody >
                    {dados.length == 0 ? (
                    <tr className='w-96 h-32'>
                        <td rowSpan={3} colSpan={3} className='w-full text-center text-xl text-red-500 md:text-2xl lg:text-2xl'>
                            <div>
                                <AlertTriangle className="inline-block h-7 w-7 md:h-12 lg:h-12 md:w-12 lg:w-12"/>
                                <p>Nenum Registro Foi Encontrado</p>
                            </div>
                        </td>
                    </tr>
                    ) : dados.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
                            <td className={tdStyle}>{item.nome}</td>
                            <td className={tdStyle}>{item.idade}</td>
                            <td className={tdStyle}>{item.cidade}</td>
                            <td className={tdStyleButtons} >
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
                <tfoot className='sticky bottom-0 bg-white"'>
                <tr>
                    <td colSpan={4} className="py-2 text-blue-500">
                        Total de registros: {dados.length}
                    </td>
                </tr>
            </tfoot>
            </table>
        </div></div>
    );
};

export default Tabela;
