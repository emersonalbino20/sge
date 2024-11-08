import axios from 'axios';

    export const getClasses = () =>{
       return axios.get("http://localhost:8000/api/classes/");
    }

    export const getClassesId = (id) =>{
        return axios.get(`http://localhost:8000/api/cursos/${id}/classes`);
    }
  
    export const postClasses = (post) => {
        return (axios.post("http://localhost:8000/api/classes/", post));
    }
  
    export  const putClasses = (data) => {
        return (axios.put(`http://localhost:8000/api/classes/${data.id}`, data));
    }