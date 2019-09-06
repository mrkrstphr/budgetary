import React from 'react';
import { StatisticTile } from 'component/StatisticTile';
import { currencyFormatter } from 'lib/currencyFormatter';

export default ({ month }) => {
  const cashflow = month.totalIncome - month.totalExpenses;

  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <StatisticTile
        title="Expenses"
        value={currencyFormatter(month.totalExpenses)}
        intent="danger"
      />
      <StatisticTile
        title="Income"
        value={currencyFormatter(month.totalIncome)}
        intent="success"
      />
      <StatisticTile
        title="Net Cash"
        value={currencyFormatter(cashflow)}
        intent={cashflow <= 0 ? 'danger' : 'success'}
      />
    </div>
  );
};
