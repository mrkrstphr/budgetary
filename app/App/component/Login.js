import { Button } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import React from 'react';
import { Input } from 'component/Form';
import { useLogin } from 'mutation';
import { AppContext } from '../Context';

export default function Login() {
  const [login] = useLogin();
  return (
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
            <div style={{ maxWidth: 320 }}>
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
            </div>
          )}
        </Formik>
      )}
    </AppContext.Consumer>
  );
}
