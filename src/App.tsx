import './App.css'
import * as React from "react"
import { useContext } from "react";
import Student from './_components/StudentForm'
import AppRoutes from './_routes/AppRoutes'

import { useSelector, useDispatch } from 'react-redux';
import rootReducer from './_redux/root-reducer';





function App(){
  return <><Student/></>;
}

export default App

