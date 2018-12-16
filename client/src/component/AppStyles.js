import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Noto+Serif+TC');

  * {
    box-sizing: border-box;
  }

  a, a:visited {
    color: #f6993f;
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
    color: #cc1f1a;
    text-decoration: none;

    &:hover {
      color: #621b18;
    }
  }
`;
