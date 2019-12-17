import { Callout } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';

const Styles = styled(Callout)`
  border-radius: 4px;
  box-sizing: border-box;
  margin-right: 5px;
  padding: 10px;
  text-align: right;
  width: 320px;

  .title {
    margin: 0;
  }

  .value {
    font-size: 2.5em;
  }
`;

export const StatisticTile = ({ title, value, ...props }) => (
  <Styles {...props}>
    <h4 className="bp3-heading title">{title}</h4>
    <div className="value">{value}</div>
  </Styles>
);
