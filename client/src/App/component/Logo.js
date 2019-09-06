import React from 'react';
import styled from 'styled-components';

const Styles = styled.h1`
  color: ${({ theme }) => theme.textMutedColor};
  font-family: Lora, serif;
  font-weight: 700;
  height: 48px;
  line-height: 48px;
  margin: 0;
  text-align: center;
`;

export default props => <Styles {...props}>Budgetary</Styles>;
