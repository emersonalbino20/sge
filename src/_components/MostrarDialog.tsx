import * as React from 'react';
import { AlertCircleIcon, AlertTriangle, Check, CheckCircleIcon, Edit, EditIcon, FolderOpenIcon, InfoIcon, Save, SaveIcon, Search } from 'lucide-react';
import { tdStyle, thStyle, trStyle } from './table';
import { bairroZod, dataNascimentoZod, emailZod, generoZod, idZod, nomeCompletoZod, ruaZod, telefoneZod } from '@/_zodValidations/validations';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MyDialog, MyDialogContent } from './my_dialog';
import { Button } from '@/components/ui/button';


interface MostrarDialogProps {
    show: boolean;
    message: string | null;
    onClose: () => void;
  }
  
  const MostrarDialog: React.FC<MostrarDialogProps> = ({ show, message, onClose }) => {
    return (
        <>
           <MyDialog open={show} onOpenChange={onClose} >
        
        <MyDialogContent className="sm:max-w-[425px] bg-white p-0 m-0">
        {message == null &&
            <div role="alert" className='w-full'>
          <div className="bg-green-500 text-white font-bold rounded-t px-4 py-2 flex justify-between">
            <div>
                <p className='text-green-200'>Sucesso</p>
            </div>
            <div className='cursor-pointer'onClick={onClose}>
                <p className='text-green-200 hover:bg-green-400'>X</p>
              </div>
          </div>
          <div className="border border-t-0 border-green-400 rounded-b bg-green-100 px-4 py-3 text-green-700 flex flex-col items-center justify-center space-y-2">
          <CheckCircleIcon className='w-28 h-20 text-green-400'/>
          <p className='font-poppins uppercase text-green-400'>Operação foi bem sucedida!</p>
          <div className=' bottom-0 py-2 flex flex-col items-end justify-end font-lato border-t w-full border-green-400'>
            <Button className='bg-green-400 hover:bg-green-500
            hover:font-medium
             font-poppins text-md border-green-400 font-medium h-9 w-20 outline-none' onClick={onClose}>Fechar</Button>
        </div>
        </div>
        
          </div>
          
      }
       {message != null &&
            <div role="alert" className='w-full'>
          <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2 flex justify-between">
            <div>
                <p className='text-red-200'>Falhou</p>
            </div>
            <div className='cursor-pointer' onClick={onClose}>
                <p className='text-red-200 hover:bg-red-400'>X</p>
              </div>
          </div>
          <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700 flex flex-col items-center justify-center space-y-2">
          <AlertCircleIcon className='w-28 h-20 text-red-400'/>
          <p className='font-poppins uppercase text-red-400'>{message}</p>
          <div className='bottom-0 py-2 flex flex-col items-end justify-end font-lato border-t w-full border-red-400'>
            <Button className='hover:bg-red-500 bg-red-400 hover:font-medium font-poppins text-md border-red-400 font-medium h-9 w-20 outline-none' onClick={onClose}>Fechar</Button>
        </div>
        </div>
        
          </div>
      }
             </MyDialogContent>
      </MyDialog>
      </>
    );
  };
  
  export default MostrarDialog;