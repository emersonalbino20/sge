import * as React from 'react';
import { Outlet, Navigate} from "react-router-dom";
import { getCookies } from '@/_cookies/Cookies';

export const PrivateRoutes = () => {
    return (getCookies('user') ? <Outlet/> : <Navigate to={'/'}/>)
}

export const ProtectLogin = () =>{
    return (!getCookies('user') ? <Outlet/> : <Navigate to={'/Home'}/>)
}
