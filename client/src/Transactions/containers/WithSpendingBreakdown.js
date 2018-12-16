import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';

export const fetchSpendingBreakdown = gql`
  query fetchSpendingBreakdown($month: String) {
    spendingBreakdown(month: $month) {
      category
      amount
    }
  }
`;

export default WrappedComponent => ({ month, ...props }) => (
  <Query query={fetchSpendingBreakdown} variables={{ month }}>
    {({ data, loading }) => {
      if (loading) return null;
      return (
        <WrappedComponent {...props} categories={data.spendingBreakdown} />
      );
    }}
  </Query>
);
