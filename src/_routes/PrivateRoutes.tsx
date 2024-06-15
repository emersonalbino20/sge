import * as React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from '../_pages/Index'
import HomePage from '../_pages/HomePage'



export default function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}