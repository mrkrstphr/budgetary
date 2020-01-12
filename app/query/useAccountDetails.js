import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { accountDetailsFragment } from './fragment';

export const fetchAccountDetailsQuery = gql`
  query fetchAccountDetails($id: ID!) {
    account(id: $id) {
      ${accountDetailsFragment}
    }
  }
`;

export function useAccountDetails(id) {
  const { data, error, loading, ...etc } = useQuery(fetchAccountDetailsQuery, {
    variables: { id },
  });

  return {
    loading,
    error,
    account: loading || error ? null : data.account,
    ...etc,
  };
}
