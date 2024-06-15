import { createGlobalStyle } from "styled-components";
const globalStyle = `
.menuPerfil:hover > .dropdownPerfil {
    display: flex;
  }
  .dropdownPerfil{
    display: none;
  }
  .menuServicos:hover > .dropdownServicos {
    display: flex;
  }
  .dropdownServicos{
    display: none;
  }
  `;

export default globalStyle;