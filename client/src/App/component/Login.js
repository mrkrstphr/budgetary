import { Button } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import React from 'react';
import { Input } from 'component/Form';
import createTokenMutation from '../container/createTokenMutation';
import { AppContext } from '../Context';
import { ToastContext } from '../../component/ToastContext';

const Login = ({ createToken }) => (
  <ToastContext.Consumer>
    {toaster => (
      <AppContext.Consumer>
        {({ setToken }) => (
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={({ email, password }, { setSubmitting }) => {
              return createToken(email, password)
                .then(response => {
                  setSubmitting(false);
                  if (response.data.createToken.errors) {
                    toaster.show({
                      icon: 'warning-sign',
                      intent: 'danger',
                      message: 'Authentication Failed',
                    });
                    return;
                  }
                  setToken(response.data.createToken.token);
                })
                .catch(e => {
                  toaster.show({
                    icon: 'warning-sign',
                    intent: 'danger',
                    message: 'An Unknown Error Occurred',
                  });
                  setSubmitting(false);
                });
            }}
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
    )}
  </ToastContext.Consumer>
);

export default createTokenMutation(Login);
