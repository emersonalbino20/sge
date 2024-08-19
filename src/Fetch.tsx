import { Button } from "./components/ui/button";
import * as React from "react"
import {useEffect, useState } from "react";
import axios from 'axios'
export default function Fetch(){

   useEffect( ()=>{
    
    axios.get(
        'http://localhost:8000/api/alunos?page_size=2'
    )
    .then((response) => {
  
        console.log(response.data)})
    .catch(error => {console.log('erro na requisição',error)})
},[])
    
    
    
    return <><button>Render</button></>
    
}