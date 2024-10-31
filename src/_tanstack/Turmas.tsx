import axios from 'axios';

    export const getTurmas = () =>{
       return axios.get("http://localhost:8000/api/turmas/");
    }

    export const getTurmasId = (id) =>{
        return axios.get(`http://localhost:8000/api/classes/${id}/turmas`);
    }
  
    export const postTurmas = (post) => {
        return (axios.post("http://localhost:8000/api/turmas/", post));
    }
  
    export  const putTurmas = (data) => {
        return (axios.put(`http://localhost:8000/api/turmas/${data.id}`, data));
    }