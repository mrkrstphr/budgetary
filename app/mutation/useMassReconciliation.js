import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const massReconciliationsMutation = gql`
  mutation massReconciliation(
    $transactionAccounts: [MassReconciliationInput]!
  ) {
    massReconciliation(transactionAccounts: $transactionAccounts) {
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

export function useMassReconciliation() {
  const [massReconciliation] = useMutation(massReconciliationsMutation);

  return [
    function wrapMassReconciliation(transactionAccounts) {
      return massReconciliation({ variables: { transactionAccounts } });
    },
  ];
}
