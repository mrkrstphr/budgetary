import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';

const createToken = gql`
  mutation createToken($email: String!, $password: String!) {
    createToken(email: $email, password: $password) {
      errors
      token {
        id
        expires
        token
        user {
          id
          email
        }
      }
    }
  }
`;

export default WrappedComponent => ({ ...props }) => {
  return (
    <Mutation mutation={createToken}>
      {createToken => {
        return (
          <WrappedComponent
            {...props}
            createToken={(email, password) =>
              createToken({
                variables: { email, password },
              })
            }
          />
        );
      }}
    </Mutation>
  );
};
