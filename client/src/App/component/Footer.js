import { Icon } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';

const Styles = styled.div`
  color: ${({ theme }) => theme.textMutedColor};
  padding: 20px;
  text-align: center;
`;

export default function Footer() {
  return (
    <Styles>
      <p>
        Handcrafed with love <Icon icon="heart" />
      </p>
      <p>
        Details on <a href="https://github.com/mrkrstphr/budgetary">GitHub</a>.
      </p>
    </Styles>
  );
}
