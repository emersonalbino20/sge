import * as React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from '../_pages/Index'
import RegisterPage from '../_pages/RegisterPage'
import HomePage from '../_pages/HomePage'
import AuthContext from '../Context/AuthContext'



const Private = ({ Item }) => {
    const signed = true;
    return signed  ? <Item/> : <LoginPage/>;
}

export default function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/RegisterPage" element={<RegisterPage/>}/>
                <Route path="/HomePage" element={<Private Item={HomePage}/>}/>
            </Routes>
        </BrowserRouter>
    );
}