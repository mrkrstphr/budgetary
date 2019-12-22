import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const markReconciledMutation = gql`
  mutation markReconciled($accountId: ID!, $reconciliationId: ID) {
    markReconciled(accountId: $accountId, reconciliationId: $reconciliationId) {
      id
      account {
        id
        name
      }
      amount
      reconciliation {
        id
      }
    }
  }
`;

export function useMarkReconciled() {
  const [markReconciled] = useMutation(markReconciledMutation);

  return [
    function wrapMarkReconciled(accountId, reconciliationId) {
      const variables = { accountId };

      if (reconciliationId) {
        variables.reconciliationId = reconciliationId;
      }

      return markReconciled({ variables });
    },
  ];
}
