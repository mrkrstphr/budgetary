import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const fetchMonthsQuery = gql`
  query fetchMonths {
    months {
      name
      totalIncome
      totalExpenses
    }
  }
`;

export function useMonthsQuery() {
  const { loading, error, data, ...etc } = useQuery(fetchMonthsQuery);

  return {
    loading,
    error,
    months: loading || error ? [] : data.months,
    ...etc,
  };
}
