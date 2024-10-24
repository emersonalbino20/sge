import * as React from 'react'
import Header from '../_components/Header'
import Form from '../_components/FormStudent'
export default function StudentInsertPage(){

    const [ano, setAno] = React.useState();
    const URLLECTIVO = "http://localhost:8000/api/ano-lectivos"
    React.useEffect( () => {
        const respFetchCursos = async () => {
          const resplectivo = await fetch (URLLECTIVO);
          const resplectivoJson = await resplectivo.json();
          const convlectivo1 = JSON.stringify(resplectivoJson.data)
          const convlectivo2 = JSON.parse(convlectivo1)
          var meuarray = convlectivo2.filter((c)=>{
            return c.activo === true
          })
          setAno(meuarray[parseInt(String(Object.keys(meuarray)))].nome)
        } 
        respFetchCursos()
   },[])
   const resp = ano ? ano : 'Indisponível';
    return(
    <>
    <Form/>
    </>
    );
}