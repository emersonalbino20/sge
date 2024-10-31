import axios from 'axios';

    export const getAnoAcademico = () =>{
       return axios.get("http://localhost:8000/api/ano-lectivos/");
    }

    export const getAnoAcademicoId = (id) =>{
        return axios.get(`http://localhost:8000/api/ano-lectivos/${id}`);
    }
  
    export const postAnoAcademico = (post) => {
        return (axios.post("http://localhost:8000/api/ano-lectivos/", post));
    }
  
    export  const putAnoAcademico = (data) => {
        return (axios.put(`http://localhost:8000/api/ano-lectivos/${data.id}`, data));
    }