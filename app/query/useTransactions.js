import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const fetchTransactionsQuery = gql`
  query filterTransactions(
    $filters: TransactionFilterInput
    $paging: PagingInput
  ) {
    transactions(filters: $filters, paging: $paging) {
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

export function useTransactions({
  filters = {},
  paging = {},
  options = { fetchPolicy: 'no-cache' },
}) {
  const { loading, error, data, ...etc } = useQuery(fetchTransactionsQuery, {
    variables: { filters, paging },
    ...options,
  });

  return {
    loading,
    error,
    transactions:
      loading || error ? { items: [], paging: {} } : data.transactions,
    ...etc,
    refetchQuery: {
      query: fetchTransactionsQuery,
      variables: { filters, paging },
    },
  };
}
