import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const fetchTransactionsQuery = gql`
  query filterTransactions($filters: TransactionFilterInput) {
    transactions(filters: $filters) {
      paging {
        page
        totalPages
        perPage
        totalRecords
      }
      items {
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
        }
      }
    }
  }
`;

export function useTransactionsQuery({ filters = {}, options = {} }) {
  const { loading, error, data } = useQuery(fetchTransactionsQuery, {
    variables: { filters },
    ...options,
  });

  return {
    loading,
    error,
    transactions:
      loading || error ? { items: [], paging: {} } : data.transactions,
  };
}
