import { Button, Card } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import React from 'react';
import { Input } from 'component/Form';
import { useLogin } from 'mutation';
import styled, { createGlobalStyle } from 'styled-components';
import { AppContext } from '../Context';
import Logo from './Logo';

const LoginGlobalStyle = createGlobalStyle`
  body {
    background-color: #f9fafa;
  }
`;

const LoginLayout = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;

  .logo {
    margin-bottom: 10px;
    margin-top: 20px;
  }

  .bp3-card {
    width: 460px;
    margin: 0 auto;
  }
`;

export default function Login() {
  const [login] = useLogin();
  return (
    <LoginLayout>
      <LoginGlobalStyle />
      <AppContext.Consumer>
        {({ notify, setUser }) => (
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={({ email, password }, { setSubmitting }) =>
              login(email, password)
                .then(({ errors, user }) => {
                  setSubmitting(false);
                  if (errors) {
                    notify('Authentication Failed', 'danger');
                    return;
                  }
                  setUser(user);
                  // TODO FIXME
                  window.location.reload();
                })
                .catch(() => {
                  notify('An Unknown Error Occurred', 'danger');
                  setSubmitting(false);
                })
            }
          >
            {({ handleSubmit, isSubmitting }) => (
              <>
                <Logo className="logo" />
                <Card elevation={0}>
                  <Form>
                    <Input label="Email" name="email" type="text" autoFocus />
                    <Input label="Password" name="password" type="password" />

                    <div>
                      <Button
                        intent="primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        Log In
                      </Button>
                    </div>
                  </Form>
                </Card>
              </>
            )}
          </Formik>
        )}
      </AppContext.Consumer>
    </LoginLayout>
  );
}
