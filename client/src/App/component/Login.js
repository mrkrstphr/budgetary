import { Formik, Form, Field, ErrorMessage } from 'formik';
import React from 'react';
import { Button } from 'component/Button';
import { Input, Label } from 'component/Form';
import createTokenMutation from '../container/createTokenMutation';
import { AppContext } from '../Context';

const Login = ({ createToken }) => (
  <AppContext.Consumer>
    {({ setToken }) => (
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={({ email, password }, { setSubmitting }) => {
          return createToken(email, password)
            .then(response => {
              setSubmitting(false);
              if (response.data.createToken.errors) {
                return;
              }
              setToken(response.data.createToken.token);
            })
            .catch(e => {
              console.log(e);
              // TODO: handle e
              setSubmitting(false);
            });
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <div style={{ maxWidth: 320 }}>
            <Form>
              <Field
                name="email"
                render={({ field }) => (
                  <>
                    <Label htmlFor={field.name}>Email</Label>
                    <Input id={field.name} {...field} type="text" autoFocus />
                  </>
                )}
              />
              <ErrorMessage name="email" component="div" />

              <Field
                name="password"
                render={({ field }) => (
                  <>
                    <Label htmlFor={field.name}>Password</Label>
                    <Input id={field.name} {...field} type="password" />
                  </>
                )}
              />
              <ErrorMessage name="password" component="div" />

              <div>
                <Button
                  primary
                  type="button"
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
