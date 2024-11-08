import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import IPPUImage from './../assets/images/IPPU.png'
import Footer from './Footer'
import Cards from './Cards'
import Header from './Header'
import SideBar from './SideBar'
import { animateFadeLeft } from '@/AnimationPackage/Animates'

export default function HomeBody() {
    const scrollRef = React.useRef(null);
  
    React.useEffect(() => {
      const interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
  
          if (scrollLeft + clientWidth >= scrollWidth) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
          }
        }
      }, 3000);
      return () => clearInterval(interval);
    }, []);
  
    return (<><section className="m-0 w-screen h-screen  bg-gray-50">
      <Header />
      <div className=" max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
<div className="lg:grid lg:grid-cols-12 lg:gap-8">
  <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
    <h1>
      <span className="block text-base text-blue-600 font-semibold tracking-wide uppercase">
        Sistema de Gestão Escolar
      </span>
      <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
        <span className="block text-gray-900">Gestão escolar</span>
        <span className="block text-blue-600">simplificada</span>
      </span>
    </h1>
    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
      Uma plataforma completa para gestão escolar, permitindo o acompanhamento de alunos, 
      professores e atividades acadêmicas de forma simples e eficiente.
    </p>
    <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
     <Link to={'/StudentInsertPage'}> <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
        Começar agora
      </button></Link>
    </div>
  </div>
  <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
    <svg
      className="w-full"
      viewBox="0 0 400 300"
      xmlns="http://www.w3.org/2000/svg"
>
      {/* Fundo */}
     <rect width="400" height="300" fill="#f3f4f6" />
      
      {/* Prédio da escola */}
   <rect x="100" y="100" width="200" height="150" fill="#2563eb" />
      <rect x="150" y="150" width="40" height="100" fill="#ffffff" />
      <rect x="210" y="150" width="40" height="100" fill="#ffffff" />

      {/* Telhado */}
      <path d="M50 100 L200 20 L350 100 Z" fill="#1d4ed8" />
      
      {/* Porta */}
      <rect x="180" y="200" width="40" height="50" fill="#1e40af" />
      
      {/* Janelas superiores */}
     <rect x="130" y="120" width="30" height="20" fill="#ffffff" />
      <rect x="185" y="120" width="30" height="20" fill="#ffffff" />
      <rect x="240" y="120" width="30" height="20" fill="#ffffff" />

      {/* Árvores */}
      <circle cx="50" cy="200" r="20" fill="#059669" />
      <rect x="45" y="200" width="10" height="30" fill="#92400e" />
      
      <circle cx="350" cy="200" r="20" fill="#059669" />
      <rect x="345" y="200" width="10" height="30" fill="#92400e" />
      {/* Sol */}
    <circle cx="50" cy="50" r="20" fill="#fcd34d" />

{/* Nuvens */}
   <circle cx="300" cy="50" r="10" fill="#b9c2d5" />
      <circle cx="320" cy="50" r="15" fill="#b9c2d5" />
      <circle cx="340" cy="50" r="10" fill="#b9c2d5" />
    </svg>
  </div>
</div>
</div>
          
        </section>
  
        
      </>
    );
  }