import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';

export const netIncomeStats = gql`
  query netIncomeStats {
    netIncomeStats {
      thisMonth
      lastMonth
      threeMonths
      twelveMonths
    }
  }
`;

export const NetIncomeStats = ({ children }) => (
  <Query query={netIncomeStats}>
    {({ data, loading }) => {
      if (loading) return null;
      return children(data.netIncomeStats);
    }}
  </Query>
);
