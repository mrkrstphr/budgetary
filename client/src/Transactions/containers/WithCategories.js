import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';

export const filterCategoriesQuery = gql`
  query fetchAllAccounts($filter: String) {
    accounts(filter: $filter) {
      id
      parent {
        id
        name
      }
      type
      name
    }
  }
`;

export default WrappedComponent => ({ filter, ...props }) => (
  <Query query={filterCategoriesQuery} variables={{ filter }}>
    {({ data, loading }) => {
      if (loading) return null;
      return <WrappedComponent {...props} categories={data.accounts} />;
    }}
  </Query>
);
