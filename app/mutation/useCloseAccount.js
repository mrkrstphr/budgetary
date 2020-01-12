import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {
  accountDetailsFragment,
  payloadErrorFragment,
} from '../query/fragment';

const closeAccountMutation = gql`
  mutation closeAccount($id: ID!) {
    closeAccount(id: $id) {
      ${payloadErrorFragment}
      account {
        ${accountDetailsFragment}
      }
    }
  }
`;

export function useCloseAccount() {
  const [closeAccountFunc, ...etc] = useMutation(closeAccountMutation);

  return [
    function closeAccount(id) {
      return closeAccountFunc({ variables: { id } }).then(
        ({
          data: {
            closeAccount: { account, errors },
          },
        }) => ({ account, errors }),
      );
    },
    ...etc,
  ];
}
