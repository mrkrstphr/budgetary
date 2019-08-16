import { HTMLTable } from '@blueprintjs/core';
import { sortBy } from 'lodash';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpendingBreakdown } from 'query';

export default function SpendBreakdown({ month }) {
  const [sortedBy, setSortBy] = useState('amount');
  const { spendingBreakdown } = useSpendingBreakdown({ month });

  return (
    <div>
      <h3 style={{}}>Spending Breakdown</h3>
      <HTMLTable striped interactive style={{ width: '100%' }}>
        <thead>
          <tr>
            <th
              onClick={() => setSortBy('category')}
              style={{ cursor: 'pointer' }}
            >
              Category
            </th>
            <th
              className="right"
              onClick={() => setSortBy('amount')}
              style={{ cursor: 'pointer' }}
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {sortBy(spendingBreakdown, sortedBy).map(
            ({ id, category, amount }) => (
              <tr key={`category--total--${category}`}>
                <td>
                  <Link to={`/categories/${id}`}>{category}</Link>
                </td>
                <td className="right">{amount.toFixed(2)}</td>
              </tr>
            ),
          )}
        </tbody>
      </HTMLTable>
    </div>
  );
}
