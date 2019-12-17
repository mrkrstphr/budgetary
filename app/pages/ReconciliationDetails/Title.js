import { Tag } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';

const TitleStyles = styled.div`
  align-items: center;
  display: flex;

  .bp3-tag {
    margin-right: 10px;
  }

  .title {
    flex: 1;
  }
`;

export default function Title({ reconciliation }) {
  return (
    <TitleStyles>
      <Tag
        intent={
          reconciliation.status.toLowerCase() === 'open' ? 'primary' : 'success'
        }
      >
        {reconciliation.status}
      </Tag>
      <h2 className="title">Account Reconciliation</h2>
    </TitleStyles>
  );
}
