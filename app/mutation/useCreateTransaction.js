import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

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

  const createTransaction = (date, description, accounts) =>
    createTransactionFunc({
      variables: { transaction: { date, description, accounts } },
    }).then(({ data: { createTransaction: { errors, transaction } } }) => ({
      errors,
      transaction,
    }));
  return [createTransaction, { data }];
}
