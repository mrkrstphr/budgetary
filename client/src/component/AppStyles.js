import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Noto+Serif+TC');

  * {
    box-sizing: border-box;
  }

  html {
    margin: 0;
    padding: 0;
  }

  body {
    background-image: url("https://www.toptal.com/designers/subtlepatterns/patterns/circuit.png");
    font-family: 'Noto Serif TC', serif;
    padding: 0px 20px;
  }

  a, a:visited {
    color: blue;
    text-decoration: none;
    &:hover {
      color: darkblue;
    }
  }
`;
