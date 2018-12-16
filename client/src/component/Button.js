import { darken } from 'polished';
import styled from 'styled-components';
import styledMap from 'styled-map';

const danger = '#dd3245';
const primary = '#0077fa';
const success = '#22a94d';

const statusBackgroundColors = styledMap`
  danger: ${danger};
  primary: ${primary};
  success: ${success};
`;

const darkerStatusBackgroundColors = styledMap`
  danger: ${darken(0.15, danger)};
  primary: ${darken(0.15, primary)};
  success: ${darken(0.15, success)};
`;

const fontSizes = styledMap`
  xs: 7pt;
  sm: 9pt;
  md: 10pt;
  lg: 11pt;
  default: 10pt;
`;

const padding = styledMap`
  xs: 2px 3px;
  sm: 3px 6px;
  default: 5px 10px;
`;

export const Button = styled.button`
  background-color: ${statusBackgroundColors};
  border: 1px solid ${statusBackgroundColors};
  border-radius: 2px;
  color: #fff;
  cursor: pointer;
  font-size: ${fontSizes};
  margin-left: 5px;
  padding: ${padding};
  .svg-inline--fa {
    color: #fff;
  }

  .icon + .label {
    padding-left: 5px;
  }

  &:active,
  &:focus,
  &:hover {
    background-color: ${darkerStatusBackgroundColors};
    border: 1px solid ${darkerStatusBackgroundColors};
    outline: none;
  }

  &:disabled {
    background-color: #bbb;
    cursor: default;
  }
`;
