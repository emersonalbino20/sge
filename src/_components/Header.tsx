import * as React from 'react'
import { useState, useEffect } from 'react';
import { setTimeout } from 'timers/promises';
export default function Header(){
    const lista = ['Home', 'Estudante', 'Pagamento','Professores','Curso','Classe','Relatórios Financeiro'];
    const [visivel, setVisivel] = useState(false)
    const newDate = new Date();
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);

    const handleVisivel = () => {setVisivel(!visivel)}

    
    const horario = (date: Date)=>{return new 
    Intl.DateTimeFormat("pt-pt",{
        dateStyle:"medium"
    }).format(date)}
    const periodo = (date: Date)=>{return new 
        Intl.DateTimeFormat("pt-pt",{
            dayPeriod:"long"
        }).format(date)}
        
    let timer;
    useEffect(()=>{
        timer = setInterval(()=>{
            setHour(newDate.getHours())
            setMinute(newDate.getMinutes())
            
        },1000)
        return () => clearInterval(timer)
    }, [])

    return( 
        
    <div className='absolute top-0 w-full'>
        <div className='flex flex-row space-x-3 py-4 items-end justify-end  bg-gradient-to-r from-slate-800 via-slate-400 to-white font-playfair' style={{backgroundImage: ''}}>
            <p>Bem-Vindo Hora:{hour < 10 ? '0' + hour : hour }:{minute < 10 ? '0' + minute: minute} {periodo(newDate)} {horario(newDate)}</ p>
            <button className='border-0 py-2 px-3 ml-2 rounded-full bg-red-600 text-white'>Sair</button>
        </div>
        <div className='sticky top-0 flex py-5 bg-slate-800 items-center justify-center'>
            <ul className='flex flex-row space-x-3 text-white shadow-2xl'>
            <li>Home</li>
            <li className='flex flex-col items-center justify-center  pb-2 cursor-pointer' onClick={handleVisivel}>Estudante
            {visivel &&
                <ul className=" absolute top-[72px] flex-col bg-slate-800 cursor-pointer">
                    <li  className=" px-4 py-2 hover:bg-slate-400">Matricular</li>
                    <li  className=" px-4 py-2 hover:bg-slate-400">Listagem</li>
                </ul>
                }
            </li>
            <li>Pagamento</li>
            <li>Professores</li>
            <li>Curso</li>
            <li>Classe</li>
            <li>Relatórios Financeiro</li>
            </ul>
        </div>
    </div>); 
}