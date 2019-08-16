import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const createAccountMutation = gql`
  mutation createAccount($account: CreateAccountInput!) {
    createAccount(account: $account) {
      errors {
        field
        details
      }
      account {
        id
        parent {
          id
          name
        }
        type
        name
      }
    }
  }
`;

export function useCreateAccount() {
  const [createAccountFunc, { data }] = useMutation(createAccountMutation);

  const createAccount = account =>
    createAccountFunc({
      variables: { account },
    }).then(result => {
      if (result.data && result.data.createAccount) {
        return result.data.createAccount;
      }

      return result;
    });

  return [createAccount, { data }];
}
