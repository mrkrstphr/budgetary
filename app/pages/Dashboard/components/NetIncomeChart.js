import PropTypes from 'prop-types';
import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { currencyFormatter } from 'lib';

function mapMonths(months) {
  const chartValues = months.map(month => ({
    name: month.name,
    amount: (month.totalIncome - month.totalExpenses).toFixed(2),
  }));

  chartValues.reverse();

  return chartValues;
}

export default function NetIncomeChart({ months }) {
  return (
    <ResponsiveContainer>
      <BarChart
        data={mapMonths(months)}
        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={currencyFormatter} />
        <ReferenceLine y={0} stroke="#000" />
        <Tooltip
          cursor={{ fill: 'rgba(240, 240, 240, .6)' }}
          formatter={currencyFormatter}
        />
        <Bar dataKey="amount">
          {mapMonths(months).map(point => (
            <Cell key={point} fill={point.amount > 0 ? '#38c072' : '#e2342f'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
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
