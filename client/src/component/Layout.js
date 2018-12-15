import React from 'react';
import styled from 'styled-components';

const AppContainer = styled.div`
  background-color: #fff;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 10px 20px;
  max-width: 1024px;
`;

export default ({ children }) => <AppContainer>{children}</AppContainer>;
