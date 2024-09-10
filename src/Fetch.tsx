import { Button } from "./components/ui/button";
import * as React from "react"
import {useEffect, useState } from "react";
export default function Fetch(){
    const data = {
        "classeId": 1,
        "cursoId": 1,
        "turmaId": 1,
        "turnoId": 1,
        "metodoPagamentoId": 1,
        "aluno": {
          "nomeCompleto": "Mateus Vale Celestino Nelito",
          "nomeCompletoPai": "Nelito Cassule Toquessa",
          "nomeCompletoMae": "Ana Vale João",
          "numeroBi": "000000000KN000",
          "dataNascimento": "2005-06-01",
          "genero": "M",
          "endereco": {
            "bairro": "Simeone Mucune",
            "rua": "4 de Abril",
            "numeroCasa": 7
          },
          "contacto": {
            "telefone": "935555500",
            "email": "mateus@gmail.com"
          },
          "responsaveis": [
            {
              "nomeCompleto": "Nelito Cassule Toquessa",
              "parentescoId": 1,
              "endereco": {
                "bairro": "Rocha Padaria",
                "rua": "Da Max",
                "numeroCasa": 1000
              },
              "contacto": {
                "telefone": "926333123",
                "email": "nelito@gmail.com"
              }
            },
            {
              "nomeCompleto": "Ana Vale João",
              "parentescoId": 2,
              "endereco": {
                "bairro": "Simeone Mucune",
                "rua": "4 de Abril",
                "numeroCasa": 7
              },
              "contacto": {
                "telefone": "923333123",
                "outros": "Tel. Movicel: 991xxxxxx"
              }
            }
          ]
        }
      }
    async function teste()  {
    const resp = await fetch('http://localhost:8000/api/matriculas',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    const respJson = await resp.json();
    //show the erros receved from API response on console
    console.log("errors",JSON.parse(JSON.stringify(respJson)))
}
    const URL = "http://localhost:8000/api/parentescos?page_size=7";
       
       useEffect( () => {
            const respFetch = async () => {
                  const resp = await fetch (URL);
                  const respJson = await resp.json();
                  const conv1 = JSON.stringify(respJson.data)
                  const conv2 = JSON.parse(conv1)
                   console.log(conv2) 
            } 
             respFetch()
       },[])
    
    return <><button onClick={()=>teste()}>Render</button></>
    
}