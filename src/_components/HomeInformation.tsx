import * as React from "react"
export default function HomeInformation(){
    return(
        <div className="flex justify-center h-screen m-0 items-center bg-form">
            <div className="flex flex-col space-y-2 text-white justify-center items-center">
            <h1 className="text-h2 font-robotoSlab font-semibold">Seja Bem-Vindo Aou Sistema de Gerenciamento Escolar</h1>
            <p>Este sistema tem como foco melhorar a experiência de como a escola gerência alguns serviços primordias</p>
            <button className='border-none bg-green-500 text-white rounded-lg w-28 h-10 mt-4'>Começar</button>
            </div>
        </div>
    );
}