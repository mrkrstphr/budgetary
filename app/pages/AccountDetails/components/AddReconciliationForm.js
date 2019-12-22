import { Button, Dialog } from '@blueprintjs/core';
import { Formik, Form, ErrorMessage } from 'formik';
import { isNil } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { DatePicker, FieldError, Input } from 'component/Form';
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
              details: {
                startDate = null,
                endDate = null,
                startingBalance = null,
                endingBalance = null,
              },
            },
            { setErrors, setSubmitting },
          ) =>
            createReconciliation(accountId, {
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
                  const errorList = {};
                  for (const error of errors) {
                    errorList[error.field] = error.details[0];
                  }
                  setErrors(errorList);
                  toaster.show({
                    icon: 'warning-triangle',
                    intent: 'danger',
                    message: `Failed to create reconciliation`,
                  });
                }
              })
              .catch(e => {
                toaster.show({
                  icon: 'warning-triangle',
                  intent: 'danger',
                  message: `Failed to create reconciliation`,
                });
                setSubmitting(false);
              })
          }
        >
          {({ handleSubmit, isSubmitting }) => (
            <Dialog
              icon="plus"
              title="Add Reconciliation"
              isOpen
              onClose={onClose}
            >
              <Form>
                <div className="bp3-dialog-body">
                  <DatePicker label="Start Date" name="details.startDate" />
                  <DatePicker label="End Date" name="details.endDate" />

                  <Input
                    label="Starting Balance"
                    name="details.startingBalance"
                    type="number"
                  />
                  <Input
                    label="Ending Balance"
                    name="details.endingBalance"
                    type="number"
                  />

                  <ErrorMessage name="details" component={FieldError} />
                </div>
                <div className="bp3-dialog-footer">
                  <div className="bp3-dialog-footer-actions">
                    <Button type="button" onClick={onClose}>
                      Close
                    </Button>
                    <Button
                      intent="primary"
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </Form>
            </Dialog>
          )}
        </Formik>
      )}
    </ToastContext.Consumer>
  );
}

AddReconciliationForm.propTypes = {
  initialValues: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
