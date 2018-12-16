import React from 'react';
import styled from 'styled-components';
import Icon from 'component/Icon';

const Styles = styled.h1`
  color: #555;
`;

export default () => (
  <Styles>
    Spend <Icon icon="usd-circle" color="#555" /> Tracking
  </Styles>
);
