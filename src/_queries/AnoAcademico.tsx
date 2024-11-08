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

        return (axios.put(`http://localhost:8000/api/ano-lectivos/${data.id}`, {inicio: data.inicio, termino: data.termino}));
    }

    export const patchAnoAcademico = (data) => {
      const dados = {
        activo: data.values
      }
        return (axios.patch(`http://localhost:8000/api/ano-lectivos/${data.id}`, dados));
    }

    export const collectErrorMessages = (obj) => {
        let messages = [];
        for (const key in obj) {
          if (Array.isArray(obj[key])) {
            messages = messages.concat(obj[key]);
          } else if (typeof obj[key] === "object") {
            messages = messages.concat(collectErrorMessages(obj[key]));
          }
        }
        return messages;
      };