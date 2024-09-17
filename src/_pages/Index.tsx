import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import IPPUImage from '../assets /_images/IPPU.png'

export default function Index()
{
    const nav = useNavigate();
    const goHome = () =>{
        nav('/Home')
    }
    return(
        <div className='flex items-center justify-center lg:w-[500px] md:w-[320px] sm:w-[270px]'>
            <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                <form className="space-y-6" action="#" onSubmit={goHome}>
                    <div>
                <img src={IPPUImage} className="h-20 w-20" alt="Ulumbo Logo" />
                    <h5 className="text-h2 font-medium text-gray-900 dark:text-white">Entre Na Nossa Plataforma</h5>
                    </div>
                    <div>
                        <label htmlFor='email' className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seu email</label>
                        <input type="email"  name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
                    </div>
                    <div>
                        <label htmlFor='password'  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sua senha</label>
                        <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <div className="flex items-start">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                            </div>
                            <label htmlFor='remember' className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Lembra me</label>
                        </div>
                        <a href="#" className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Esqueceu A Senha?</a>
                    </div>
                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={()=>(goHome)}>Entre Na Tua Conta</button>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                        Não registrado? <a href="#" className="text-blue-700 hover:underline dark:text-blue-500">Criar conta</a>
                    </div>
                </form>
            </div>
        </div>
    );
}