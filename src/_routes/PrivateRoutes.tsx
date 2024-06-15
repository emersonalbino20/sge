import * as React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from '../_pages/Index'
import HomePage from '../_pages/HomePage'
import { useSelector } from "react-redux";
import { selectUserState } from "@/_redux/User/slice";



export default function AppRoutes(){
    const state = useSelector(selectUserState)   
    return(
        <BrowserRouter>
            <Routes>
                {state ? <Route path="/HomePage" element={<HomePage/>}/>: <Route path="/" element={<LoginPage/>}/>}
            </Routes>
        </BrowserRouter>
    );
}