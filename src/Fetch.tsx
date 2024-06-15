import { Button } from "./components/ui/button";
import * as React from "react"
import {useEffect, useState } from "react";
export default function Fetch(){

    const [data, setData] = useState([]);
    useEffect (()=>{
        async function fetching (){
            const response = await fetch('./src/fake-api.json');
            const result = await response.json()
            setData(result)
            console.log(result)
        }
        fetching()
     
    },[])
    
    
    
    return  <div> {data && data.map((d)=>{return <pre> {d.name} </pre>}) } <button>Render</button></div>
    
}