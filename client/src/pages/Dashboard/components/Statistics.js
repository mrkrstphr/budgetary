import React from 'react';
import { StatisticTile } from 'component/StatisticTile';
import { currencyFormatter } from 'lib/currencyFormatter';
import { NetIncomeStats } from '../container/NetIncomeStats';

export default () => {
  return (
    <NetIncomeStats>
      {({ lastMonth, thisMonth, threeMonths, twelveMonths }) => (
        <div style={{ alignItems: 'center', display: 'flex' }}>
          <StatisticTile
            title="This Month"
            value={currencyFormatter(thisMonth)}
            success={thisMonth > 0}
            danger={thisMonth <= 0}
          />
          <StatisticTile
            title="Last Month"
            value={currencyFormatter(lastMonth)}
            success={lastMonth > 0}
            danger={lastMonth <= 0}
          />
          <StatisticTile
            title="Last 3"
            value={currencyFormatter(threeMonths)}
            success={threeMonths > 0}
            danger={threeMonths <= 0}
          />
          <StatisticTile
            title="Last 12"
            value={currencyFormatter(twelveMonths)}
            success={twelveMonths > 0}
            danger={twelveMonths <= 0}
          />
        </div>
      )}
    </NetIncomeStats>
  );
};
