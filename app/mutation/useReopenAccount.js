import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {
  accountDetailsFragment,
  payloadErrorFragment,
} from '../query/fragment';

const reopenAccountMutation = gql`
  mutation reopenAccount($id: ID!) {
    reopenAccount(id: $id) {
      ${payloadErrorFragment}
      account {
        ${accountDetailsFragment}
      }
    }
  }
`;

export function useReopenAccount() {
  const [reopenAccountFunc, ...etc] = useMutation(reopenAccountMutation);

  return [
    function reopenAccount(id) {
      return reopenAccountFunc({ variables: { id } }).then(
        ({
          data: {
            reopenAccount: { account, errors },
          },
        }) => ({ account, errors }),
      );
    },
    ...etc,
  ];
}
