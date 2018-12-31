import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import { getMutationContext } from 'lib';

const filterCategories = gql`
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
  <Query
    query={filterCategories}
    variables={{ filter }}
    context={getMutationContext()}
  >
    {({ data, loading }) => {
      if (loading) return null;
      return <WrappedComponent {...props} categories={data.accounts} />;
    }}
  </Query>
);
