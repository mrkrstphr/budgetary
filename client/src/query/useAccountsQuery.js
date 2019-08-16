import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const filterAccountsQuery = gql`
  query fetchAllAccounts($filter: String) {
    accounts(filter: $filter) {
      id
      parent {
        id
        name
      }
      type
      name
    }
  }
`;

export function useAccountsQuery(filter = '') {
  const { loading, error, data } = useQuery(filterAccountsQuery, {
    variables: { filter },
  });

  return {
    loading,
    error,
    accounts: loading || error ? [] : data.accounts,
  };
}
