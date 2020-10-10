import { ResponsiveBar } from '@nivo/bar';
import { patternLinesDef } from '@nivo/core';
import PropTypes from 'prop-types';
import React from 'react';
import { currencyFormatter, formatShortMonthAndYear } from 'lib';

function mapValues(values) {
  const chartValues = values.slice(0, 18).map((month) => ({
    month: month.name,
    netIncome: month.totalIncome - month.totalExpenses,
  }));

  chartValues.reverse();

  return chartValues;
}

export default function NetIncomeChart({ months }) {
  return (
    <ResponsiveBar
      colors={(v) => (v.value >= 0 ? '#66bd63' : '#d6604d')}
      data={mapValues(months)}
      keys={['netIncome']}
      indexBy="month"
      margin={{ top: 0, right: 20, bottom: 50, left: 80 }}
      padding={0.3}
      defs={[
        patternLinesDef('positive', {
          spacing: 5,
          rotation: -45,
          lineWidth: 2,
          background: 'inherit',
          color: '#52b44e',
        }),
        patternLinesDef('negative', {
          spacing: 5,
          rotation: -45,
          lineWidth: 2,
          background: 'inherit',
          color: '#d04a35',
        }),
      ]}
      fill={[
        {
          match: ({ data: { value } }) => value >= 0,
          id: 'positive',
        },
        {
          match: ({ data: { value } }) => value < 0,
          id: 'negative',
        },
      ]}
      tooltip={({ indexValue, value, color }) => (
        <strong style={{ color }}>
          {formatShortMonthAndYear(indexValue)}: {currencyFormatter(value)}
        </strong>
      )}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisBottom={{
        format: (v) => formatShortMonthAndYear(new Date(`${v}-01`)),
        tickRotation: -45,
      }}
      axisRight={null}
      axisLeft={{
        format: (v) => currencyFormatter(v, { minimumFractionDigits: 0 }),
      }}
      enableLabel={false}
      animate
      motionStiffness={90}
      motionDamping={15}
    />
  );
}

NetIncomeChart.propTypes = {
  months: PropTypes.arrayOf(
    PropTypes.shape({
      totalExpenses: PropTypes.number.isRequired,
      totalIncome: PropTypes.number.isRequired,
    }),
  ).isRequired,
};
