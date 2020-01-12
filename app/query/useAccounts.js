import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { accountDetailsFragment } from './fragment';

export const filterAccountsQuery = gql`
  query fetchAllAccounts($filter: String) {
    accounts(filter: $filter) {
      ${accountDetailsFragment}
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
