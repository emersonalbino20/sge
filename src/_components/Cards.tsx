import * as React from 'react';

export default function Cards({ bgColor, textColor, titleColor }) {
  return (
    <>
      <div className={`w-[350px] h-[240px] ${bgColor} m-3 p-3 rounded-md text-left ${textColor}`}>
        <header className='w-[400px]'>
          <h2 className={`md:text-md lg:text-lg xl:text-xl font-extrabold ${titleColor}`}>
            Estatística dos Estudantes
          </h2>
          <h3 className="md:text-[14px] lg:text-[16px] xl:text-lg font-medium lowercase">
            Todas as estatísticas relacionadas aos estudantes são categorizadas neste card.
          </h3>
          
          <hr className="my-2" />
        </header>
        <div className="md:text-[12px] lg:text-[14px] xl:text-md">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Primeiro Item</li>
            <li>Segundo Item</li>
            <li>Terceiro Item</li>
          </ol>
        </div>
        <footer className="mt-3">
          <h4>Footer</h4>
        </footer>
      </div>
    </>
  );
}
