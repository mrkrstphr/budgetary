import { Spinner } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';

const AppLoadingStyles = styled.div`
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
`;

export function AppLoading() {
  return (
    <AppLoadingStyles>
      <Spinner intent="primary" />
    </AppLoadingStyles>
  );
}
