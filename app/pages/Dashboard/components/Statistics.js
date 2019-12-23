import React from 'react';
import { StatisticTile } from 'component/StatisticTile';
import { currencyFormatter } from 'lib/currencyFormatter';
import { useNetIncomeStats } from 'query';

export default function Statistics() {
  const { error, loading, netIncomeStats } = useNetIncomeStats();

  if (error || loading) {
    // TODO FIXME
    return null;
  }

  const { lastMonth, thisMonth, threeMonths, twelveMonths } = netIncomeStats;

  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <StatisticTile
        title="This Month"
        value={currencyFormatter(thisMonth)}
        intent={thisMonth <= 0 ? 'danger' : 'success'}
      />
      <StatisticTile
        title="Last Month"
        value={currencyFormatter(lastMonth)}
        intent={lastMonth <= 0 ? 'danger' : 'success'}
      />
      <StatisticTile
        title="Last 3"
        value={currencyFormatter(threeMonths)}
        intent={threeMonths <= 0 ? 'danger' : 'success'}
      />
      <StatisticTile
        title="Last 12"
        value={currencyFormatter(twelveMonths)}
        intent={twelveMonths <= 0 ? 'danger' : 'success'}
      />
    </div>
  );
}
