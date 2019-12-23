import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';

const createTokenMutation = gql`
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

export default WrappedComponent => ({ ...props }) => (
  <Mutation mutation={createTokenMutation}>
    {createToken => (
      <WrappedComponent
        {...props}
        createToken={(email, password) =>
          createToken({
            variables: { email, password },
          })
        }
      />
    )}
  </Mutation>
);
