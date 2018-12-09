import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import transaction from './fragment/transaction';
import { fetchTransactions } from './WithTransactions';

const createTransaction = gql`
  mutation addTransaction($transaction: CreateTransactionInput!) {
    createTransaction(transaction: $transaction) {
      errors {
        field
        details
      }
      transaction {
        ${transaction}
      }
    }
  }
`;

export default WrappedComponent => ({ ...props }) => (
  <Mutation
    mutation={createTransaction}
    refetchQueries={[{ query: fetchTransactions }]}
  >
    {createTransaction => {
      return (
        <WrappedComponent
          {...props}
          createTransaction={(date, description, accounts) =>
            createTransaction({
              variables: { transaction: { date, description, accounts } },
            })
          }
        />
      );
    }}
  </Mutation>
);
