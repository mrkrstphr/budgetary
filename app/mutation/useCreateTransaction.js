import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { fetchMonthsQuery, fetchTransactionsQuery } from 'query';

export const createTransactionMutation = gql`
  mutation addTransaction($transaction: CreateTransactionInput!) {
    createTransaction(transaction: $transaction) {
      errors {
        field
        details
      }
      transaction {
        id
        date
        description
        amount
        accounts {
          id
          account {
            id
            name
          }
          amount
        }
      }
    }
  }
`;

export function useCreateTransaction() {
  const [createTransactionFunc, { data }] = useMutation(
    createTransactionMutation,
  );

  const createTransaction = (date, description, accounts) => {
    const month = date.replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})/, '$1-$2');

    return createTransactionFunc({
      variables: { transaction: { date, description, accounts } },
      refetchQueries: [
        {
          query: fetchTransactionsQuery,
          variables: { filters: { month } },
        },
        { query: fetchMonthsQuery },
      ],
    });
  };

  return [createTransaction, { data }];
}
