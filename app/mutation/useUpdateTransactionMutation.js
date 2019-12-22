import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const updateTransactionMutation = gql`
  mutation updateTransaction($id: ID!, $transaction: UpdateTransactionInput!) {
    updateTransaction(id: $id, transaction: $transaction) {
      transaction {
        id
        date
        description
        amount
        accounts {
          id
          amount
          account {
            id
            name
          }
        }
      }
    }
  }
`;

export function useUpdateTransactionMutation() {
  const [updateTransactionFunc, { data }] = useMutation(
    updateTransactionMutation,
  );

  const updateTransaction = (id, date, description, accounts) =>
    updateTransactionFunc({
      variables: { id, transaction: { date, description, accounts } },
    });

  return [updateTransaction, { data }];
}
