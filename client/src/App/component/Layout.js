import React from 'react';
import styled from 'styled-components';
import Footer from './Footer';

const ScrollableArea = styled.div`
  height: calc(100vh - 48px);
  overflow-y: scroll;
`;

const AppContainer = styled.div`
  background-color: ${({ theme }) => theme.bodyBgColor};
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 24px -2px;
  box-sizing: border-box;
  padding: 10px 20px;
`;

export default ({ children }) => (
  <ScrollableArea>
    <AppContainer>{children}</AppContainer>
    <Footer />
  </ScrollableArea>
);
