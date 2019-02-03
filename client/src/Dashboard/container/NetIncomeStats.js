import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import { getMutationContext } from 'lib';

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
  <Query query={netIncomeStats} context={getMutationContext()}>
    {({ data, loading }) => {
      if (loading) return null;
      console.log({ data });
      return children(data.netIncomeStats);
    }}
  </Query>
);
