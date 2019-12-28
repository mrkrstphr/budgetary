import { Button, Dialog } from '@blueprintjs/core';
import { Formik, Form, ErrorMessage } from 'formik';
import { isNil } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { DatePicker, FieldError, Input } from 'component/Form';
import { formatIsoDate } from 'lib';
import { useCreateReconciliation } from 'mutation';
import { AppContext } from '../../../App/Context';

export default function AddReconciliationForm({ initialValues, onClose }) {
  const [createReconciliation] = useCreateReconciliation();

  return (
    <AppContext.Consumer>
      {({ notify }) => (
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
              startDate: startDate ? formatIsoDate(startDate) : null,
              endDate: endDate ? formatIsoDate(endDate) : null,
              startingBalance,
              endingBalance,
            })
              .then(({ errors }) => {
                setSubmitting(false);
                if (isNil(errors)) {
                  notify('Account Reconciliation Created');
                  onClose();
                } else {
                  const errorList = {};
                  errors.forEach(({ details: [error], field }) => {
                    errorList[field] = error;
                  });
                  setErrors(errorList);
                  notify('Failed to create reconciliation', 'danger');
                }
              })
              .catch(() => {
                notify('Failed to create reconciliation', 'danger');
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
    </AppContext.Consumer>
  );
}

AddReconciliationForm.propTypes = {
  initialValues: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
