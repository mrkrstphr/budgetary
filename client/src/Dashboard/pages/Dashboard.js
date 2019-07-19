import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import NetIncomeChart from '../components/NetIncomeChart';
import Statistics from '../components/Statistics';

export const fetchMonths = gql`
  query fetchMonths {
    months {
      name
      totalIncome
      totalExpenses
    }
  }
`;

const Dashboard = ({ months }) => (
  <div>
    <h2 style={{ flex: 1, margin: '0 0 10px 0' }}>Dashboard</h2>

    <Statistics statistics={{}} />

    <h3>Net Income by Month</h3>
    <div style={{ width: '100%', height: 320 }}>
      <NetIncomeChart months={months} />
    </div>

    <div style={{ alignItems: 'center', display: 'flex', width: '100%' }}>
      <h3>Recent Transactions</h3>
      <div style={{ flex: 1, textAlign: 'right' }}>
        <Link to="/transactions">View All</Link>
      </div>
    </div>
    <p>...</p>
  </div>
);

const WithMonths = ({ children }) => (
  <Query query={fetchMonths}>
    {({ data, loading }) => {
      if (loading) return null;
      return children(data.months);
    }}
  </Query>
);

export default () => (
  <WithMonths>{months => <Dashboard months={months} />}</WithMonths>
);
