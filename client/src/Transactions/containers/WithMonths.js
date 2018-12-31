import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import { getMutationContext } from 'lib';

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
  <Query query={fetchMonths} context={getMutationContext()}>
    {({ data, loading }) => {
      if (loading) return null;
      return <WrappedComponent {...props} months={data.months} />;
    }}
  </Query>
);
