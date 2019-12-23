import { Card } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Footer from './Footer';

const ScrollableArea = styled.div`
  height: calc(100vh - 48px);
  overflow-y: scroll;
`;

export default function Layout({ children }) {
  return (
    <ScrollableArea>
      <Card>{children}</Card>
      <Footer />
    </ScrollableArea>
  );
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};
