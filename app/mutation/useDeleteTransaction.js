import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { fetchTransactionsQuery } from 'query';

export const deleteTransactionMutation = gql`
  mutation deleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;

export function useDeleteTransaction({ refetchVariables = {} } = {}) {
  const [deleteTransaction, other] = useMutation(deleteTransactionMutation, {
    refetchQueries: [
      { query: fetchTransactionsQuery, variables: refetchVariables },
    ],
  });

  return [id => deleteTransaction({ variables: { id } }), other];
}
