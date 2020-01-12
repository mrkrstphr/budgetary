import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { accountDetailsFragment } from '../query/fragment';

export const updateAccountMutation = gql`
  mutation updateAccount($id: ID!, $account: UpdateAccountInput!) {
    updateAccount(id: $id, account: $account) {
      errors {
        field
        details
      }
      account {
        ${accountDetailsFragment}
      }
    }
  }
`;

export function useUpdateAccount() {
  const [updateAccountFunc, ...etc] = useMutation(updateAccountMutation);

  const myUpdateAccount = (id, accountDetails) =>
    updateAccountFunc({
      variables: { id, account: accountDetails },
    }).then(({ data: { updateAccount: { account, errors } } }) => ({
      account,
      errors,
    }));

  return [myUpdateAccount, ...etc];
}
