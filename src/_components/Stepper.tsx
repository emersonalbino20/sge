import * as React from 'react';
import './stepper.css';
import { Check } from 'lucide-react';
export function Stepper(){
    const step = ['Info Aluno', 'Info Encarregados', 'Dados Essencias'];
    const[ currentStep, setCurrentStep ] = React.useState<number>(1);
    const[ complete, setComplete ] = React.useState<boolean>(false);
    return <>
    <div className='flex justify-between'>{
        step?.map((step, i) => 
            (
                <div key={i} className={`step-item ${currentStep === i + 1 ? 'active' : '' } ${ (i + 1 < currentStep || complete) && 'complete'}`}>
                    <div className='step'>{ 
                    (i + 1 < currentStep || complete) ?
                    <Check/> : i + 1 }</div>
                    <p className='text-gray-500'>{step}</p>
                </div>
                
            )
            )}
    </div>

    <div className='flex space-x-2'>
        {currentStep > 1 && 
    <button onClick={()=>{
        currentStep === step.length && setComplete(false);
        
        currentStep > 1 && setCurrentStep(prev => prev - 1);
    }} className='bg-gray-700 hover:bg-gray-600 text-slate-200 font-medium px-7 py-1 border-gray-700'>Previous</button>
    }
    <button type='button' onClick={()=>{
        currentStep === step.length ?
        setComplete(true) :
        setCurrentStep(prev => prev + 1);
    }} className='bg-gray-700 hover:bg-gray-600 text-slate-200 font-medium px-7 py-1 border-gray-700'>{currentStep === step.length ?'Finish' : 'Next'}</button>
    </div>
    </>
}