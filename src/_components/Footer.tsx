import * as React from 'react'
export default function Footer(){
    return(
        <div className='absolute bottom-0 py-3 flex flex-col items-center justify-center text-sm font-lato'>
            <div>
                <p>Egleston Gestão Escolar &copy; <span className='italic font-thin'>All Rights Reserved</span></p>
            </div>
            <div><p>NIF: 7377823878 Email: egle@gmail.com Linha de Apoio: +244974838743</p></div>
        </div>
    )
}