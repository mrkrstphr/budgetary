import { Button } from '@blueprintjs/core';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { Dialog } from 'component/Dialog';
import { DatePicker, FieldError, Input, Label } from 'component/Form';
import { ToastContext } from 'component/ToastContext';
import { useCreateReconciliation } from 'mutation';

export default function AddReconciliationForm({ initialValues, onClose }) {
  const [createReconciliation] = useCreateReconciliation();

  return (
    <ToastContext.Consumer>
      {toaster => (
        <Formik
          initialValues={initialValues}
          onSubmit={(
            {
              accountId,
              startDate = null,
              endDate = null,
              startingBalance = null,
              endingBalance = null,
            },
            { setSubmitting }
          ) => {
            return createReconciliation(accountId, {
              startDate: startDate
                ? moment(startDate).format('YYYY-MM-DD')
                : null,
              endDate: endDate ? moment(endDate).format('YYYY-MM-DD') : null,
              startingBalance,
              endingBalance,
            })
              .then(({ errors }) => {
                setSubmitting(false);
                if (isNil(errors)) {
                  toaster.show({
                    icon: 'tick-circle',
                    intent: 'success',
                    message: `Account Reconciliation Created`,
                  });
                  onClose();
                } else {
                  toaster.show({
                    icon: 'warning-triangle',
                    intent: 'danger',
                    message: `Failed to create Reconciliation`,
                  });
                }
              })
              .catch(e => {
                toaster.show({
                  icon: 'warning-triangle',
                  intent: 'danger',
                  message: `Failed to create Reconciliation`,
                });
                setSubmitting(false);
              });
          }}
        >
          {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
            <Dialog
              header="Add Reconciliation"
              onClose={onClose}
              footer={
                <div>
                  <Button
                    intent="danger"
                    minimal
                    type="button"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    intent="primary"
                    minimal
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
                  name="startDate"
                  render={({ field }) => (
                    <>
                      <Label htmlFor={field.name}>Start Date</Label>
                      <DatePicker
                        name={field.name}
                        onChange={setFieldValue}
                        value={values.startDate}
                      />
                      <ErrorMessage name={field.name} component={FieldError} />
                    </>
                  )}
                />

                <Field
                  name="endDate"
                  render={({ field }) => (
                    <>
                      <Label htmlFor={field.name}>End Date</Label>
                      <DatePicker
                        name={field.name}
                        onChange={setFieldValue}
                        value={values.endDate}
                      />
                      <ErrorMessage name={field.name} component={FieldError} />
                    </>
                  )}
                />

                <Field
                  name="startingBalance"
                  render={({ field }) => (
                    <>
                      <Label htmlFor={field.name}>Starting Balance</Label>
                      <Input id={field.name} {...field} type="number" />
                      <ErrorMessage name={field.name} component="div" />
                    </>
                  )}
                />

                <Field
                  name="endingBalance"
                  render={({ field }) => (
                    <>
                      <Label htmlFor={field.name}>Ending Balance</Label>
                      <Input id={field.name} {...field} type="number" />
                      <ErrorMessage name={field.name} component="div" />
                    </>
                  )}
                />
              </Form>
            </Dialog>
          )}
        </Formik>
      )}
    </ToastContext.Consumer>
  );
}
