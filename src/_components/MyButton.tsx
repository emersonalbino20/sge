import * as React from 'react'
import { EditIcon, CombineIcon, Trash, InfoIcon, UserPlus, LucideLibrary, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';


export const  AroundDiv = "relative flex justify-center items-center";

const ClassIcon= "w-5 h-4 absolute text-white font-extrabold cursor-pointer";

export function EditButton(Icon)
{
    return (
        <>
        <EditIcon 
        className={ClassIcon}/> 
        <Button 
        className="h-7 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-500 rounded-sm border-blue-600" ></Button>
        </>
    );
}

export function SubmitButton(Icon)
{
    return (
        <>
        <Save 
        className={ClassIcon}/> 
        <Button 
        className="h-7 px-5 bg-green-600 text-white font-semibold hover:bg-green-500 rounded-sm border-green-600" ></Button>
        </>
    );
}

export function CombineButton()
{
    return (
        <>
       
            <CombineIcon
             className={ClassIcon}/>
            <Button 
             className="h-7 px-5 bg-yellow-600 text-white font-semibold hover:bg-yellow-600 rounded-sm border-yellow-600"></Button>
        </>
    );
}

export function TrashButton()
{
    return (
        <>
            <Trash 
            className={ClassIcon}/>
            <Button 
            className="h-7 px-5 bg-red-600 text-white font-semibold hover:bg-red-600 rounded-sm border-red-600"></Button>
        </>
    );
}

export function InfoButton()
{
    return (
        <>
            <InfoIcon 
            className={ClassIcon}/>
            <Button 
            className="h-7 px-5 bg-green-600 text-white font-semibold hover:bg-green-500 rounded-sm border-green-600"></Button>
        </>
    );
}

export function UserPlusButton()
{
    return (
        <>
            <UserPlus
            className={ClassIcon}
            />
            <Button className='h-9 px-5 bg-blue-600 text-white font-semibold hover:bg-blue-500 rounded-sm'></Button>
        </>
    );
}

export function LibraryButton()
{
    return (
        <>
            <LucideLibrary
            className={ClassIcon}
            />
            <Button className='h-7 px-5 bg-amber-400 text-white font-semibold hover:bg-amber-400 rounded-sm border-amber-400'></Button>
        </>
    );
}

