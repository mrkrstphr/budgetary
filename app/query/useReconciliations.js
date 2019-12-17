import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const fetchReconciliationsQuery = gql`
  query fetchReconciliations($accountId: ID!) {
    reconciliations(accountId: $accountId) {
      id
      startDate
      endDate
      startingBalance
      endingBalance
      status
    }
  }
`;

export function useReconciliations(accountId) {
  const { data, error, loading, ...etc } = useQuery(fetchReconciliationsQuery, {
    variables: { accountId },
  });

  return {
    error,
    loading,
    reconciliations: error || loading ? null : data.reconciliations,
    ...etc,
  };
}
