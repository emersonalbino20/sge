import axios from 'axios';

    export const getTrimestres = () =>{
       return axios.get("http://localhost:8000/api/trimestres/");
    }

    export const getTrimestresId = (id) =>{
        return axios.get(`http://localhost:8000/api/trimestres/${id}`);
    }
  
    export const postTrimestres = (data) => {
        return (axios.post("http://localhost:8000/api/trimestres/", data));
    }
  
    export  const putTrimestres = (data) => {
        return (axios.put(`http://localhost:8000/api/trimestres/${data.id}`, data));
    }