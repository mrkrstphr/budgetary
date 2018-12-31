import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import { getMutationContext } from 'lib';
import transaction from './fragment/transaction';

export const fetchTransactions = gql`
  query filterTransactions($filters: TransactionFilterInput) {
    transactions(filters: $filters) {
      paging {
        page
        totalPages
        perPage
        totalRecords
      }
      items {
        ${transaction}
      }
    }
  }
`;

export default WrappedComponent => ({ month, ...props }) => (
  <Query
    query={fetchTransactions}
    variables={{ filters: { month } }}
    context={getMutationContext()}
  >
    {({ data, loading }) => {
      if (loading) return null;
      return <WrappedComponent {...props} transactions={data.transactions} />;
    }}
  </Query>
);
