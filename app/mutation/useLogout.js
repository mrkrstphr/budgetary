import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const logoutMutation = gql`
  mutation logout {
    logout
  }
`;

export function useLogout() {
  const [logoutFunc, { client, ...etc }] = useMutation(logoutMutation);

  const logout = (account) =>
    logoutFunc({
      variables: { account },
    }).then(() => {
      client.clearStore();
    });

  return [logout, { client, ...etc }];
}
