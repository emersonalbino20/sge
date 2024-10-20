import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import IPPUImage from '../assets /_images/IPPU.png'
import Footer from './Footer'
import Cards from './Cards'
import Header from './Header'
import SideBar from './SideBar'

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
  
    return (
      <div className="flex flex-row min-h-screen w-screen">
        
        {/*<SideBar/>*/}
        
          
      <div className="flex flex-col w-screen">
        
        {/*HEADER*/}
        <Header title={false}/>
        <section className="flex-grow bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300 bg-center bg-no-repeat w-full ">
         
          <div className="w-full items-center px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
            <div className="flex flex-col justify-center items-center w-full">
              <img src={IPPUImage} className="h-40 w-40" alt="IPPU Logo" />
              <h1 className="mb-4 text-h1 capitalize font-extrabold tracking-tight leading-none text-black md:text-h2 lg:text-h1">
                Acreditamos no potencial dos nossos alunos
              </h1>
            </div>
            <p className="mb-8 text-lg font-normal text-gray-800 lg:text-font-h2 sm:px-16 lg:px-48">
              Aqui na IPPU focamos em melhorar, ensinar e orientar nossos estudantes, com o mais alto escalão de ensino, com nossos profissionais vamos longe!
            </p>
  
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
              <Link to="/StudentInsertPage">
                <button className="inline-flex justify-center items-center py-2 px-3 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                  Dar início
                  <svg
                    className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </button>
              </Link>
              <button className="inline-flex justify-center hover:text-gray-900 items-center py-2 px-3 sm:ms-4 text-base font-medium text-center text-black rounded-lg border border-white hover:bg-white focus:ring-4 focus:ring-gray-400">
                Saber mais
              </button>
            </div>
  
            <div
              ref={scrollRef}
              className="flex flex-row space-x-2 overflow-x-auto w-full mt-8"
            >
              <Cards bgColor="bg-blue-600" textColor="text-white" titleColor="text-yellow-300" />
              <Cards bgColor="bg-red-600" textColor="text-white" titleColor="text-yellow-300" />
              <Cards bgColor="bg-green-600" textColor="text-white" titleColor="text-yellow-300" />
              <Cards bgColor="bg-pink-600" textColor="text-white" titleColor="text-yellow-300" />
            </div>
          </div>
        </section>
  
        <Footer />
      </div>
      
        </div>
    );
  }