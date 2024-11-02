import axios from 'axios';

    export const getProfessores = () =>{
       return axios.get("http://localhost:8000/api/professores/");
    }

    export const getProfessoresId = (id) =>{
        return axios.get(`http://localhost:8000/api/professores/${id}`);
    }
  
    export const postProfessores = (post) => {
        return (axios.post("http://localhost:8000/api/professores/", post));
    }
  
    export  const putProfessores = (data) => {
        return (axios.put(`http://localhost:8000/api/professores/${data.id}`, data));
    }

    export  const getDisciplinasProfessores = (id) => {
        return axios.get(`http://localhost:8000/api/professores/${id}/disciplinas`);
    }

    export  const getTurmasProfessores = (id) => {
        return axios.get(`http://localhost:8000/api/professores/${id}/classes`);
    }