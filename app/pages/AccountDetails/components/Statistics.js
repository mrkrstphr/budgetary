import PropTypes from 'prop-types';
import React from 'react';
import { StatisticTile } from 'component/StatisticTile';
import { currencyFormatter } from 'lib/currencyFormatter';

export default function Statistics({ account }) {
  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <StatisticTile
        title="This Month"
        value={currencyFormatter(account.thisMonth)}
        intent={account.thisMonth > 0 ? 'success' : 'danger'}
      />
      <StatisticTile
        title="Last Month"
        value={currencyFormatter(account.lastMonth)}
        intent={account.lastMonth > 0 ? 'success' : 'danger'}
      />
      <StatisticTile
        title="This Year"
        value={currencyFormatter(account.thisYear)}
        intent={account.thisYear > 0 ? 'success' : 'danger'}
      />
      <StatisticTile
        title="Total"
        value={currencyFormatter(account.total)}
        intent={account.total > 0 ? 'success' : 'danger'}
      />
    </div>
  );
}

Statistics.propTypes = {
  account: PropTypes.shape({
    lastMonth: PropTypes.number.isRequired,
    thisMonth: PropTypes.number.isRequired,
    thisYear: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
};
