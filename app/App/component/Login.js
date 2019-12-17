import { Button } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import React from 'react';
import { Input } from 'component/Form';
import createTokenMutation from '../container/createTokenMutation';
// import { ToastContext } from '../../component/ToastContext';
import { AppContext } from '../Context';

const Login = ({ createToken }) => (
  <AppContext.Consumer>
    {({ notify, setUser }) => (
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={({ email, password }, { setSubmitting }) =>
          createToken(email, password)
            .then(response => {
              setSubmitting(false);
              if (response.data.createToken.errors) {
                notify('Authentication Failed', 'danger');
                return;
              }
              setUser(response.data.createToken.user);
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

export default createTokenMutation(Login);
