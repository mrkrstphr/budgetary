import { sortBy } from 'lodash';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cell, Header, Row, Table } from 'component/SimpleTable';
import WithSpendingBreakdown from '../containers/WithSpendingBreakdown';

const SpendBreakdown = ({ categories }) => {
  const [sortedBy, setSortBy] = useState('amount');

  return (
    <div>
      <h3 style={{}}>Spending Breakdown</h3>
      <Table>
        <thead>
          <tr>
            <Header
              left
              onClick={() => setSortBy('category')}
              style={{ cursor: 'pointer' }}
            >
              Category
            </Header>
            <Header
              right
              onClick={() => setSortBy('amount')}
              style={{ cursor: 'pointer' }}
            >
              Amount
            </Header>
          </tr>
        </thead>
        <tbody>
          {sortBy(categories, sortedBy).map(
            ({ id, category, amount }, index) => (
              <Row key={`category--total--${category}`} odd={index % 2 === 1}>
                <Cell>
                  <Link to={`/categories/${id}`}>{category}</Link>
                </Cell>
                <Cell right>{amount.toFixed(2)}</Cell>
              </Row>
            ),
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default WithSpendingBreakdown(SpendBreakdown);
