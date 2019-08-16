import React from 'react';
import { StatisticTile } from 'component/StatisticTile';
import { currencyFormatter } from 'lib/currencyFormatter';

export default ({ account }) => {
  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <StatisticTile
        title="This Month"
        value={currencyFormatter(account.thisMonth)}
        success={account.thisMonth > 0}
        danger={account.thisMonth <= 0}
      />
      <StatisticTile
        title="Last Month"
        value={currencyFormatter(account.lastMonth)}
        success={account.lastMonth > 0}
        danger={account.lastMonth <= 0}
      />
      <StatisticTile
        title="This Year"
        value={currencyFormatter(account.thisYear)}
        success={account.thisYear > 0}
        danger={account.thisYear <= 0}
      />
      <StatisticTile
        title="Total"
        value={currencyFormatter(account.total)}
        success={account.total > 0}
        danger={account.total <= 0}
      />
    </div>
  );
};
