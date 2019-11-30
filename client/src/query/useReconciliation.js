import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const reconciliationQuery = gql`
  query fetchReconciliationDetails($id: ID!) {
    reconciliation(id: $id) {
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
      transactions {
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
          reconciliation {
            id
          }
        }
      }
    }
  }
`;

export function useReconciliation(id) {
  const { data, error, loading, ...etc } = useQuery(reconciliationQuery, {
    variables: { id },
  });

  return {
    error,
    loading,
    reconciliation: error || loading ? null : data.reconciliation,
    ...etc,
  };
}
