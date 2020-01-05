import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const fetchGoalsQuery = gql`
  query fetchAllGoals {
    goals {
      id
      description
      account {
        id
        name
        type
        currentBalance
      }
      startingBalance
      goalBalance
      created
    }
  }
`;

export function useGoals() {
  const { loading, error, data, ...etc } = useQuery(fetchGoalsQuery);

  return {
    loading,
    error,
    goals: loading || error ? [] : data.goals,
    ...etc,
  };
}
