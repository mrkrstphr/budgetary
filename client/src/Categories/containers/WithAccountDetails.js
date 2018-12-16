import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';

export const fetchAccountDetails = gql`
  query fetchAccountDetails($id: ID!) {
    account(id: $id) {
      id
      name
      type

      thisMonth
      lastMonth
      thisYear
      total
    }
  }
`;

export default WrappedComponent => ({ id, ...props }) => (
  <Query query={fetchAccountDetails} variables={{ id }}>
    {({ data, loading }) => {
      if (loading) return null;
      return <WrappedComponent {...{ ...props, id }} account={data.account} />;
    }}
  </Query>
);
