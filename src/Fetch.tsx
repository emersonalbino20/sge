import { Button } from "./components/ui/button";
import * as React from "react"
import {useEffect, useState } from "react";
export default function Fetch(){

    const [data, setData] = useState([]);
    useEffect (()=>{
    
     fetch('./src/fake-api.json')
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => console.log(`error:${error}`))
    },[])
    
    
    
    return  <> {data ? <pre> {JSON.stringify(data[0], null, 2)}</pre> : 'Carregando...'}</>
    
}