import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const fetchSpendingBreakdownQuery = gql`
  query fetchSpendingBreakdown($month: String!) {
    spendingBreakdown(month: $month) {
      id
      category
      amount
    }
  }
`;

export function useSpendingBreakdown({ month }) {
  const { loading, error, data, ...etc } = useQuery(
    fetchSpendingBreakdownQuery,
    {
      variables: { month },
    },
  );

  return {
    loading,
    error,
    spendingBreakdown: loading || error ? [] : data.spendingBreakdown,
    ...etc,
  };
}
