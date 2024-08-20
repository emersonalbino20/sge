import * as React from 'react'
import Header from '../_components/Header'
import ListStudent from '@/_components/ListStudent';
export default function StudentListPage(){
    return(
    <div className='flex flex-col space-y-16 w-full'>
    <Header title="Lista dos Estudantes" visible={true}/>
    <ListStudent/>
    </div>
    );
}