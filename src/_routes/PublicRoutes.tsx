import * as React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from '../_pages/RegisterPage'
import HomePage from '../_pages/HomePage'


export default function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/RegisterPage" element={<RegisterPage/>}/>
                <Route path="/HomePage" element={<HomePage/>}/>
            </Routes>
        </BrowserRouter>
    );
}