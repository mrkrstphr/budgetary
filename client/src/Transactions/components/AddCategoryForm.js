import { Formik, Form, Field, ErrorMessage } from 'formik';
import React from 'react';
import { Button } from 'component/Button';
import { Dialog } from 'component/Dialog';
import { Input, Label, Select } from 'component/Form';
import CreateAccount from '../containers/CreateAccount';

const AddCategoryForm = ({ initialValues, onClose, onSave }) => {
  return (
    <CreateAccount>
      {createAccount => (
        <Formik
          initialValues={initialValues}
          onSubmit={({ name, type: typeInput }, { setSubmitting }) => {
            return createAccount({
              name,
              type: typeInput ? typeInput.value : null,
            })
              .then(({ account }) => {
                setSubmitting(false);

                if (onSave) {
                  onSave(account);
                }

                onClose();
                return { account };
              })
              .catch(() => {
                setSubmitting(false);
              });
          }}
        >
          {({ handleSubmit, isSubmitting, setFieldTouched, setFieldValue }) => (
            <Dialog
              header="Add Category"
              onClose={onClose}
              footer={
                <div>
                  <Button danger type="button" onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    primary
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>
                </div>
              }
              style={{ zIndex: 9000 }}
            >
              <Form>
                <Field
                  name="name"
                  render={({ field }) => (
                    <>
                      <Label htmlFor={field.name}>Name</Label>
                      <Input id={field.name} {...field} type="text" autoFocus />
                    </>
                  )}
                />
                <ErrorMessage name="name" component="div" />

                <Field
                  name="type"
                  render={({ field }) => (
                    <>
                      <Label htmlFor={field.name}>Type</Label>
                      <Select
                        {...field}
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        options={[
                          { value: 'expense', label: 'Expense' },
                          { value: 'income', label: 'Income' },
                        ]}
                      />
                    </>
                  )}
                />
                <ErrorMessage name="type" component="div" />
              </Form>
            </Dialog>
          )}
        </Formik>
      )}
    </CreateAccount>
  );
};

export default AddCategoryForm;
