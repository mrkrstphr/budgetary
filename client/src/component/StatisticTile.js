import React from 'react';
import styled from 'styled-components';
import styledMap from 'styled-map';

const tileColorMap = styledMap`
  danger: #e3342f;
  success: #0F9960;
`;

const Styles = styled.div`
  background-color: ${tileColorMap};
  border-radius: 4px;
  box-sizing: border-box;
  color: #fff;
  margin-right: 5px;
  padding: 10px;
  text-align: right;
  width: 320px;

  .value {
    font-size: 2.5em;
  }
`;

export const StatisticTile = ({ title, value, ...props }) => (
  <Styles {...props}>
    <div className="title">{title}</div>
    <div className="value">{value}</div>
  </Styles>
);
