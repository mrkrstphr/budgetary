import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { fetchGoalsQuery } from 'query';

const createGoalMutation = gql`
  mutation addGoal($goal: CreateGoalInput!) {
    createGoal(goal: $goal) {
      errors {
        field
        details
      }
      goal {
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
  }
`;

export function useCreateGoal() {
  const [createGoalFunc, { data }] = useMutation(createGoalMutation, {
    refetchQueries: [{ query: fetchGoalsQuery }],
  });

  const createGoal = goal =>
    createGoalFunc({
      variables: { goal },
    }).then(result => {
      if (result.data && result.data.createGoal) {
        return result.data.createGoal;
      }

      return result;
    });

  return [createGoal, { data }];
}
