import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const fetchAccountSnapshotQuery = gql`
  query fetchAccountSnapshot($accountId: ID!) {
    accountSnapshot(accountId: $accountId) {
      id
      snapshotDate
      balance
    }
  }
`;

export function useAccountSnapshot(accountId) {
  const { loading, error, data, ...etc } = useQuery(fetchAccountSnapshotQuery, {
    variables: { accountId },
  });

  return {
    loading,
    error,
    snapshots: loading || error ? [] : data.accountSnapshot,
    ...etc,
  };
}
