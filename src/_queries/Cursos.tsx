import axios from 'axios';



    export const getCursos = () =>{
       return axios.get("http://localhost:8000/api/cursos/");
    }

    export const getCursosId = (id) =>{
        return axios.get(`http://localhost:8000/api/cursos/${id}`);
    }
  
    export const postCursos = (post) => {
        return (axios.post("http://localhost:8000/api/cursos/", post));
    }
  
    export  const putCursos = (data) => {
        return (axios.put(`http://localhost:8000/api/cursos/${data.id}`, data));
    }