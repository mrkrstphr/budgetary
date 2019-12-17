import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const finishReconciliationMutation = gql`
  mutation finishReconciliation($id: ID!) {
    finishReconciliation(id: $id) {
      reconciliation {
        id
        startDate
        endDate
        startingBalance
        endingBalance
        status
        account {
          id
          name
          type
        }
      }
      errors {
        field
        message
        details
      }
    }
  }
`;

export function useFinishReconciliation() {
  const [finishReconciliation, ...other] = useMutation(
    finishReconciliationMutation,
  );

  return [
    id =>
      finishReconciliation({ variables: { id } }).then(
        data => data.finishReconciliation,
      ),
    ...other,
  ];
}
