import axios from 'axios';

    export const getTurnos = () =>{
       return axios.get("http://localhost:8000/api/turnos/");
    }

    export const getTurnosId = (id) =>{
        return axios.get(`http://localhost:8000/api/metodos-pagamento/${id}`);
    }
  
    export const postTurnos = (post) => {
        return (axios.post("http://localhost:8000/api/turnos/", post));
    }
  
    export  const putTurnos = (data) => {
        return (axios.put(`http://localhost:8000/api/turnos/${data.id}`, data));
    }