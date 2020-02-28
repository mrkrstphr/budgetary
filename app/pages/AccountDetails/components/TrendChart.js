import PropTypes from 'prop-types';
import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useAccountSnapshot } from '../../../query';
import { currencyFormatter, formatShortMonthAndYear } from '../../../lib';

function makeData(account, snapshots) {
  const start = Math.max(0, snapshots.length - 18);

  const myData = [
    {
      id: 'balance',
      color: '#d6604d',
      data: snapshots.slice(start, snapshots.length).map(month => ({
        x: formatShortMonthAndYear(month.snapshotDate),
        y: month.balance * (account.type === 'liabilities' ? -1 : 1),
      })),
    },
  ];

  return myData;
}

export default function TrendChart({ account }) {
  const { loading, snapshots } = useAccountSnapshot(account.id);

  if (loading) {
    return 'LOADING';
  }

  return (
    <ResponsiveLine
      colors={['#d6604d']}
      animate
      data={makeData(account, snapshots)}
      margin={{ top: 20, right: 20, bottom: 60, left: 50 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
      }}
      axisBottom={{
        tickRotation: -45,
      }}
      axisTop={null}
      axisRight={null}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel="y"
      pointLabelYOffset={-12}
      tooltip={({
        point: {
          data: { x: month, y: amount },
        },
      }) => (
        <strong>
          {month}:{' '}
          {currencyFormatter(
            amount * (account.type === 'liabilities' ? -1 : 1),
          )}
        </strong>
      )}
      useMesh
    />
  );
}

TrendChart.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
};
