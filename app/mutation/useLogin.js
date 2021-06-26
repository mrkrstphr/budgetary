import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const loginMutation = gql`
  mutation createToken($email: String!, $password: String!) {
    createToken(email: $email, password: $password) {
      errors
      user {
        id
        email
      }
    }
  }
`;

export function useLogin() {
  const [loginFunc, ...etc] = useMutation(loginMutation);

  const login = (email, password) =>
    loginFunc({
      variables: { email, password },
    }).then(
      ({
        data: {
          createToken: { errors, user },
        },
      }) => ({
        errors,
        user,
      }),
    );

  return [login, ...etc];
}
