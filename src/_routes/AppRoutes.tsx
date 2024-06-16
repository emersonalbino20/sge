import * as React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const LoginPage = lazy(()=>import('../_pages/Index'))
const RegisterPage = lazy(()=>import('../_pages/RegisterPage'))
const HomePage = lazy(()=>import('../_pages/HomePage'))
const StudentPage = lazy(()=>import('../_pages/StudentPage'))


export default function AppRoutes(){
    return(
        <BrowserRouter>
        <Suspense fallback={<div className="text-black">Carregando...</div>}>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/RegisterPage" element={<RegisterPage/>}/>
                <Route path="/HomePage" element={<HomePage/>}/>
                <Route path="/StudentPage" element={<StudentPage/>}/>
            </Routes>
        </Suspense>
        </BrowserRouter>
    );
}