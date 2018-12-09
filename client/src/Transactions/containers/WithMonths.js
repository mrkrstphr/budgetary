import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';

export const fetchMonths = gql`
  query fetchMonths {
    months {
      name
      totalIncome
      totalExpenses
    }
  }
`;

export default WrappedComponent => ({ ...props }) => (
  <Query query={fetchMonths}>
    {({ data, loading }) => {
      if (loading) return null;
      return <WrappedComponent {...props} months={data.months} />;
    }}
  </Query>
);
