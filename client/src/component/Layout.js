import React from 'react';
import styled from 'styled-components';

const AppContainer = styled.div`
  border-radius: 4px;
  box-sizing: border-box;
  height: calc(100vh - 48px);
  overflow-y: scroll;
  padding: 10px 20px;
`;

export default ({ children }) => <AppContainer>{children}</AppContainer>;
