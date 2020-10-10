import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { fetchReconciliationsQuery } from 'query';

export const createReconciliationMutation = gql`
  mutation createReconciliation(
    $accountId: ID!
    $details: ReconciliationDetailsInput!
  ) {
    createReconciliation(accountId: $accountId, details: $details) {
      reconciliation {
        id
        account {
          id
          name
          type
        }
        startDate
        endDate
        startingBalance
        endingBalance
        status
      }
      errors {
        field
        message
        details
      }
    }
  }
`;

export function useCreateReconciliation() {
  const [createReconcilationFunc, ...other] = useMutation(
    createReconciliationMutation,
  );

  const createReconciliation = (accountId, details) =>
    createReconcilationFunc({
      variables: { accountId, details },
      refetchQueries: [
        {
          query: fetchReconciliationsQuery,
          variables: { accountId },
        },
      ],
    }).then((result) => {
      if (result.data && result.data.createReconciliation) {
        return result.data.createReconciliation;
      }

      return result;
    });

  return [createReconciliation, ...other];
}
