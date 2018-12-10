import React from 'react';
import styled from 'styled-components';

const AppContainer = styled.div`
  background-color: #f9f9f9;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 10px 20px;
`;

export default ({ children }) => <AppContainer>{children}</AppContainer>;
