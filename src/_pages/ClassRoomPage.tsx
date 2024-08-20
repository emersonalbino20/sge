import ClassRoom from '@/_components/ClassRoom'
import Header from '@/_components/Header'
import * as React from 'react'
export default function ClassRoomPage(){
    return( 
    <>
        <Header title="Lista das Salas" visible={true}/>
        <ClassRoom/>
    </>)
}