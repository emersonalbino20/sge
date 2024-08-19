import * as React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { EditIcon } from 'lucide-react'
import DataTable from 'react-data-table-component'
export default function ListStudent(){

    const columns = 
    [
        { 
            name: 'Id',
            selector: row => row.id,
            sortable:true
         },
        { 
            name: 'Nome',
            selector: row => row.nome,
            sortable:true
         },
        { 
            name: 'Número de Bi',
            selector: row => row.bi,
            sortable:true
        },
        { 
            name: 'Data de Nascimento',
            selector: row => row.dataNasc,
            sortable:true
        },
        {
            name: 'Actions',
            cell: (row) => (<div className='relative flex justify-center items-center cursor-pointer'  onClick={() => alert(row.nome)}><EditIcon className='w-5 h-4 absolute text-white'/> <button className='py-3 px-5 rounded-sm bg-blue-600'></button></div>),
        }, 
    ];
    
    const data = [
        {
            id: 1,
            nome: 'Emerson Albino',
            bi: '7736221LA',
            dataNasc: '2005-06-12'
        },
        {
            id: 2,
            nome: 'Manuela Joaquim',
            bi: 'ee36221LA',
            dataNasc: '2009-03-12'
        },
        {
            id: 3,
            nome: 'Catarina Larissa',
            bi: '7006221LA',
            dataNasc: '2015-02-15'
        },
        {
            id: 4,
            nome: 'Lusia Mercedes',
            bi: '77126221BN',
            dataNasc: '1975-01-11'
        },
        {
            id: 5,
            nome: 'João Gonçalve',
            bi: '000136221LA',
            dataNasc: '1963-04-22'
        }
    ]
  
    const [records, setRecords] = useState(data)
    const handleFilter = (event) => {
        const newData = data.filter( row => {
            return row.nome.toLowerCase().includes(event.target.value.toLowerCase())
        })
        setRecords(newData)
    }
    return (
        <div className='container mt-5'>
            <DataTable 
                title="Estudantes"
                columns={columns}
                data={records}
                selectableRows
                fixedHeader
                fixedHeaderScrollHeight='400px'
                pagination
                highlightOnHover
                subHeader
                subHeaderComponent={
                    <input className=' rounded-sm border border-gray-500 placeholder:text-gray-500 outline-none py-1 indent-2' type='text' placeholder='search here' onChange={handleFilter}/>
                }
            >
            </DataTable>
        </div>
    )
}