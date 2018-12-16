import React from 'react';
import { StatisticTile } from 'component/StatisticTile';
import { currencyFormatter } from 'lib/currencyFormatter';

export default ({ month }) => {
  const cashflow = month.totalIncome - Math.abs(month.totalExpenses);

  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <StatisticTile
        title="Expenses"
        value={currencyFormatter(month.totalExpenses)}
        danger
      />
      <StatisticTile
        title="Income"
        value={currencyFormatter(month.totalIncome)}
        success
      />
      <StatisticTile
        title="Net Cash"
        value={currencyFormatter(cashflow)}
        success={cashflow > 0}
        danger={cashflow <= 0}
      />
    </div>
  );
};
