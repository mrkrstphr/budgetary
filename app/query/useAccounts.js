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
      currentBalance
      isOpen
      showInMenu
    }
  }
`;

export function useAccounts(filter = '') {
  const { loading, error, data, ...etc } = useQuery(filterAccountsQuery, {
    variables: { filter },
  });

  return {
    loading,
    error,
    accounts: loading || error ? [] : data.accounts,
    ...etc,
  };
}
