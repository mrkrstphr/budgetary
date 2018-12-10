import React from 'react';
import styled from 'styled-components';
import styledMap from 'styled-map';

const tileColorMap = styledMap`
  danger: #e3342f;
  success: #38c172;
`;

const StatisticTile = styled.div`
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

const Tile = ({ title, value, ...props }) => (
  <StatisticTile {...props}>
    <div className="title">{title}</div>
    <div className="value">{value}</div>
  </StatisticTile>
);

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export default ({ month }) => {
  const cashflow = month.totalIncome - Math.abs(month.totalExpenses);

  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <Tile
        title="Expenses"
        value={formatter.format(month.totalExpenses)}
        danger
      />
      <Tile
        title="Income"
        value={formatter.format(month.totalIncome)}
        success
      />
      <Tile
        title="Net Cash"
        value={formatter.format(cashflow)}
        success={cashflow > 0}
        danger={cashflow <= 0}
      />
    </div>
  );
};
