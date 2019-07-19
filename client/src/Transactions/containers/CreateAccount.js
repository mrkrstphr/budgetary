import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import { filterCategoriesQuery } from './WithCategories';

const createAccountMutation = gql`
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

export default ({ children }) => {
  return (
    <Mutation
      mutation={createAccountMutation}
      refetchQueries={[
        {
          query: filterCategoriesQuery,
        },
      ]}
    >
      {createAccount => {
        return children(account =>
          createAccount({
            variables: { account },
          }).then(result => {
            if (result.data && result.data.createAccount) {
              return result.data.createAccount;
            }

            return result;
          }),
        );
      }}
    </Mutation>
  );
};
