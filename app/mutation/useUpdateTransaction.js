import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { transactionFragment } from 'query/fragment';

export const updateTransactionMutation = gql`
  mutation updateTransaction($id: ID!, $transaction: UpdateTransactionInput!) {
    updateTransaction(id: $id, transaction: $transaction) {
      transaction {
        ${transactionFragment}
      }
    }
  }
`;

export function useUpdateTransaction() {
  const [updateTransactionFunc, { data }] = useMutation(
    updateTransactionMutation,
  );

  const updateTransaction = (id, date, description, accounts) =>
    updateTransactionFunc({
      variables: { id, transaction: { date, description, accounts } },
    });

  return [updateTransaction, { data }];
}
