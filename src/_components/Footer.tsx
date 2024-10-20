import * as React from 'react'
import IPPUImage from '../assets /_images/IPPU.png'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-300 via-gray-100 to-white bg-center rounded-none shadow w-full">
      <div className="w-full max-w-screen-xl mx-auto p-2 md:py-2">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="#" className="flex items-center mb-4 sm:mb-0 space-x-1 rtl:space-x-reverse">
            <img src={IPPUImage} className="h-8" alt="Ulumbo Logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-600">
              Instituto Politecnico Privado Ulumbo
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0 text-gray-700">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">Sobre</a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">Política de Privacidade</a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">Licença</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Contato</a>
            </li>
          </ul>
        </div>
        <hr className="my-3 border-gray-500 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-600 sm:text-center">
          © 2024 <a href="https://flowbite.com/" className="hover:underline">IPPU™</a>. Todos Direitos Reservados.
        </span>
      </div>
    </footer>
  );
}