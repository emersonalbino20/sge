## Descrição Das Fonts
As fonts usadas no projecto serão descritas nesse arquivo.

## Fontes para Títulos
Roboto Slab: Uma fonte serifada moderna que adiciona um toque de formalidade e clareza.  
Merriweather: Boa para títulos e cabeçalhos, proporcionando uma sensação de seriedade e confiança.  
## Fontes para Parágrafos
Roboto: Uma fonte sans-serif muito popular, altamente legível e versátil.
Open Sans: Outra excelente opção sans-serif, conhecida por sua legibilidade em textos longos.
## Fontes para Links
Lato: Uma fonte que combina bem com outras fontes e tem uma ótima legibilidade, ideal para links.  
Montserrat: Moderna e limpa, boa para links e elementos de navegação.  
## Combinações de Fontes
Títulos: Roboto Slab, Parágrafos: Roboto  
Títulos: Merriweather, Parágrafos: Open Sans  
Títulos: Montserrat, Parágrafos: Lato  
## Implementação no Tailwind CSS:  
Depois de escolher e importar as fontes no seu projeto (como descrito anteriormente), configure o tailwind.config.js para incluir essas fontes:    

 ``` tailwind.config.js
module.exports = {
  content: [
    ./src/**/*.{js,jsx,ts,tsx},
  ],
  theme: {
    extend: {
      fontFamily: {
        title: [Roboto Slab, serif],
        body: [Roboto, sans-serif],
        link: [Lato, sans-serif],
      },
    },
  },
  plugins: [],
} ```
## Exemplo de Uso no Componente React:  

```// src/App.js
import React from react;

function App() {
  return (
    <div className=font-body>
      <h1 className=font-title text-4xl>Bem-vindo ao Sistema de Gestão Escolar</h1>
      <p className=text-lg>Esta plataforma ajuda a gerenciar todas as atividades escolares de forma eficiente.</p>
      <a href=/register className=font-link text-blue-500>Registre-se agora</a>
    </div>
  );
}```

export default App
```

## Fontes Display para Educação:
Poppins  

Estilo: Sans-serif
Uso: Títulos, cabeçalhos
Descrição: Moderna e limpa, ideal para criar uma sensação de frescor e simplicidade.

Montserrat

Estilo: Sans-serif
Uso: Títulos, logotipos
Descrição: Inspirada nas placas e letreiros tradicionais do bairro de Montserrat em Buenos Aires, Montserrat é uma ótima opção para projetos educacionais que desejam uma aparência elegante e moderna.
Merriweather

Estilo: Serif
Uso: Títulos, subtítulos
Descrição: Desenvolvida para ser altamente legível, Merriweather é uma excelente escolha para títulos e textos em tamanhos grandes.
Playfair Display

Estilo: Serif
Uso: Títulos, citações
Descrição: Esta fonte serifada clássica traz um toque de elegância e é perfeita para criar um design educacional sofisticado.

Rubik

Estilo: Sans-serif
Uso: Títulos, navegação
Descrição: Rubik é uma fonte geométrica com bordas arredondadas, ideal para criar uma sensação amigável e acessível.
