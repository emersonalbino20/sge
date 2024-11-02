import axios from 'axios';

export const getSalas = () =>{
  return axios.get("http://localhost:8000/api/salas/");
}

export const getSalasId = (id) =>{
  return axios.get(`http://localhost:8000/api/salas/${id}`);
}

export const postSalas = (post) => {
  return (axios.post("http://localhost:8000/api/salas/", post));
  }

export  const putSalas = (data) => {
  return (axios.put(`http://localhost:8000/api/salas/${data.id}`, data));
}


















  {/*axios.post("http://localhost:8000/api/salas/", post).catch(function (error) {
     if (error.response) {

    const errors = error?.response?.data?.errors;

      const errorMessages = [];
    
      // Função para extrair mensagens de erro
      const getErrorMessages = (obj) => {
        for (const key in obj) {
          if (Array.isArray(obj[key])) {
            errorMessages.push(...obj[key]);
          } else if (typeof obj[key] === 'object') {
            getErrorMessages(obj[key]); // Recursão para sub-objetos
          }
        }
      };
      getErrorMessages(errors);
    console.log( errorMessages.map((msg) => (
      {msg}
    )))*/}