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
  
    return (<><section className="m-0 w-screen h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-300  grid-flow-col grid-cols-3">
      <Header title={false}/>
          <div className="w-full pt-14 items-center justify-center px-4 mx-auto max-w-screen-xl text-center">
          <div className="flex flex-col justify-center items-center w-full">
  <img 
    src={IPPUImage} 
    className="md:h-20 md:w-20 lg:h-32 lg:w-32 xl:h-36 xl:w-36 shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] animate-ping animate-once animate-duration-[850ms] animate-delay-[400ms] animate-ease-in " 
    alt="IPPU Logo" 
  />
  <h1 className="animate-fade-up animate-duration-[750ms] animate-delay-200 animate-ease-in mb-2 md:text-md lg:text-lg xl:text-[2rem] capitalize font-medium tracking-wide text-gray-700">
    Acreditamos no potencial dos nossos alunos
  </h1>
</div>


            <p className="animate-fade-up animate-duration-[750ms] animate-delay-200 animate-ease-in  mb-8 text-[14px] lg:text-[16px] xl:text-xl   text-gray-600 font-medium sm:px-16 lg:px-48">
              Aqui na IPPU focamos em melhorar, ensinar e orientar nossos estudantes, com o mais alto escalão de ensino, com nossos profissionais vamos longe!
            </p>
  
            <div className={`${animateFadeLeft} flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0`}>
              <Link to="/StudentInsertPage">
                <button className=" inline-flex justify-center items-center sm:text-sm md:text-[10px] lg:text-[12px] xl:text-[16px]
                md:py-1 md:px-2 lg:py-1 lg:px-3 xl:py-2 xl:px-4 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
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
              <button className="inline-flex justify-center hover:text-gray-900 items-center sm:text-sm md:text-[10px] lg:text-[12px] xl:text-[16px] xl:px-4  text-base font-medium text-center text-black rounded-lg border border-white hover:bg-white focus:ring-4 focus:ring-gray-400">
                Saber mais
              </button>
            </div>
  
            <div
              ref={scrollRef}
              className="flex flex-row space-x-2 overflow-x-auto w-full mt-8 mb-5"
            >
              {/*<Cards bgColor="bg-blue-600" textColor="text-white" titleColor="text-yellow-300" />
              <Cards bgColor="bg-red-600" textColor="text-white" titleColor="text-yellow-300" />
              <Cards bgColor="bg-green-600" textColor="text-white" titleColor="text-yellow-300" />
              <Cards bgColor="bg-pink-600" textColor="text-white" titleColor="text-yellow-300" />*/}
            </div>
          </div>
          
        </section>
  
        
      </>
    );
  }