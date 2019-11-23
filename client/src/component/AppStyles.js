import { createGlobalStyle } from 'styled-components';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700|Lora:400,700&display=swap');

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
    font-family: 'Lato', serif;
    padding: 0px 20px;
  }

  a, a:visited {
    color: #cc1f1a;
    text-decoration: none;

    &:hover {
      color: #621b18;
    }
  }

  .bp3-select-popover .bp3-popover-content {
    padding: 5px;
  }

  .bp3-select-popover .bp3-menu {
    max-width: 400px;
    max-height: 300px;
    overflow: auto;
    padding: 0;
}

.bp3-select-popover .bp3-menu:not(:first-child) {
    padding-top: 5px;
}

.bp3-html-table {
  th.right, td.right {
    text-align: right;
  }

  &.valignMiddle td {
    vertical-align: middle !important;
  }

  tr.even td {
    background-color: rgba(191, 204, 214, 0.15);
  }
}
`;
