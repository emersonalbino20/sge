import axios from 'axios';

    export const getPagamentos = () =>{
       return axios.get("http://localhost:8000/api/metodos-pagamento/");
    }

    export const getPagamentosId = (id) =>{
        return axios.get(`http://localhost:8000/api/metodos-pagamentos/${id}`);
    }
  
    export const postPagamentos = (post) => {
        return (axios.post("http://localhost:8000/api/metodos-pagamentos/", post));
    }
  
    export  const putPagamentos = (data) => {
        return (axios.put(`http://localhost:8000/api/metodos-pagamentos/${data.id}`, data));
    }