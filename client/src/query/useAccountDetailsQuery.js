import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const fetchAccountDetailsQuery = gql`
  query fetchAccountDetails($id: ID!) {
    account(id: $id) {
      id
      name
      type

      thisMonth
      lastMonth
      thisYear
      total
    }
  }
`;

export function useAccountDetailsQuery(id) {
  const { data, error, loading } = useQuery(fetchAccountDetailsQuery, {
    variables: { id },
  });

  return {
    loading,
    error,
    account: loading || error ? null : data.account,
  };
}
