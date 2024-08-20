import * as React from 'react'
export default function Footer(){
    return(
        <div className='absolute bottom-0 py-3 flex flex-col items-center justify-center text-xs font-lato border-y border-gray-400'>
            <div>
                <p>Sistema de Gestão Escolar 
                    <span className='font-semibold'>
                        &copy;Todos Direitos Reservados
                    </span>
                </p>
            </div>
            <div>
                <p>NIF: 000000000 Email: IPPU@example.com Linha de Apoio: +244900000000</p>
            </div>
        </div>
        );
    }