import * as React from 'react';

//Retorna um estudante
export async function setIdStudent (id){
    try {
        const response = await fetch(`http://localhost:8000/api/alunos/4`);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar aluno');
        }
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Erro:", error);
        return null; 
    }
}
//Retorna o id do ano-lectivo actual
const [anoId, setAnoId] = React.useState();
const URLLECTIVO = "http://localhost:8000/api/ano-lectivos";
React.useEffect(()=>{
    const funcao = async () => {
        const resp = await fetch (URLLECTIVO);
        const respJson = await resp.json();
        const conv1 = JSON.stringify(respJson.data)
        const conv2 = JSON.parse(conv1)
        var meuarray = conv2.filter((c)=>{
            return c.activo === true
          })
          setAnoId(meuarray[parseInt(String(Object.keys(meuarray)))].id)
    }
    funcao();
},[])


