import *  as React from 'react'
import { PrinterIcon } from 'lucide-react'
import DataTable from 'react-data-table-component'

const tableStyle = {
        
    headCells: {
        style: {
            backgroundColor: '#e8e9eb',
            fontWeight: 'bold',
            fontSize: '14px',
            color: '#008ae1'
        }
    }
    }
       
    const conditionalRowStyles = [
        {
            when: row => row.id % 2 === 0,
            style: {
                backgroundColor: '#e8e9eb'
            },
        },
        {
            when: row => row.id % 2 !== 0,
            style: {
                backgroundColor: '#ffffff'
            },
        },
    ];


export default function Table(props){
    return ( <div className='w-full h-72 '>
    <br/><br/><br/>
    
    <DataTable 
        customStyles={ tableStyle }
        conditionalRowStyles={conditionalRowStyles}
        columns={props.columns}
        data={props.dados}
        fixedHeader
        fixedHeaderScrollHeight='400px'
        pagination
        defaultSortFieldId={1}
        onSelectedRowsChange={props.handleRows}
        onSort={props.handleSort}
        subHeader
        subHeaderComponent={
            <div className='flex flex-row space-x-2'><input className=' rounded-sm border-2 border-gray-400 placeholder:text-gray-400 placeholder:font-bold outline-none py-1 indent-2' type='text' placeholder='Pesquisar aqui...' onChange={props.handleFilter}/>
            
            <div title='imprimir' className='relative flex justify-center items-center'>
                <PrinterIcon className='w-5 h-4 absolute text-white font-extrabold'/>
                <button className='py-4 px-5 bg-green-700 border-green-700 rounded-sm ' onClick={() => window.print()}></button>
            </div>
            </div>
        }
    >
    </DataTable>
</div>
)
}