import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import transaction from './fragment/transaction';
import { fetchMonths } from './WithMonths';
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

export default WrappedComponent => ({ currentMonth: month, ...props }) => {
  return (
    <Mutation
      mutation={createTransaction}
      refetchQueries={[
        { query: fetchTransactions, variables: { filters: { month } } },
        { query: fetchMonths },
      ]}
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
};
