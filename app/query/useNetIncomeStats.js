import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const netIncomeStatsQuery = gql`
  query netIncomeStats {
    netIncomeStats {
      thisMonth
      lastMonth
      threeMonths
      twelveMonths
    }
  }
`;

export function useNetIncomeStats() {
  const { loading, error, data, ...etc } = useQuery(netIncomeStatsQuery);

  return {
    loading,
    error,
    netIncomeStats: loading || error ? [] : data.netIncomeStats,
    ...etc,
  };
}
