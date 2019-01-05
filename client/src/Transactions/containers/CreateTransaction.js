import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import { getMutationContext } from 'lib';
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
        {
          query: fetchTransactions,
          variables: { filters: { month } },
          context: getMutationContext(),
        },
        { query: fetchMonths, context: getMutationContext() },
      ]}
      context={getMutationContext()}
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
