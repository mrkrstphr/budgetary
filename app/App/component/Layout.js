import { Card } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import Footer from './Footer';

const ScrollableArea = styled.div`
  height: calc(100vh - 48px);
  overflow-y: scroll;
`;

export default ({ children }) => (
  <ScrollableArea>
    <Card>{children}</Card>
    <Footer />
  </ScrollableArea>
);
