import './App.css'
import * as React from "react"
import { useContext } from "react";
import Student from './_components/StudentForm'
import AppRoutes from './_routes/AppRoutes'
import Fetch from './Fetch';
import { useSelector, useDispatch } from 'react-redux';
import rootReducer from './_redux/root-reducer';





function App(){
  return <><AppRoutes/></>;
}

export default App

