import { Button } from '@blueprintjs/core';
import { Formik } from 'formik';
import { isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import * as yup from 'yup';
import { Dialog } from 'component';
import { useCreateTransaction } from 'mutation';
import TransactionForm from './TransactionForm';
import { ToastContext } from './ToastContext';

yup.addMethod(yup.object, 'onlyOneOf', function(
  list,
  // eslint-disable-next-line no-template-curly-in-string
  message = '${path} must have at least one of these keys: ${keys}'
) {
  return this.test({
    name: 'onlyOneOf',
    message: message,
    exclusive: true,
    params: { keys: list.join(', ') },
    test: value => {
      return value == null || list.filter(f => !isNil(value[f])).length === 1;
    },
  });
});

export default function AddTransactionForm({ onClose }) {
  const [createTransaction] = useCreateTransaction();

  const initialValues = {
    date: new Date(),
    description: '',
    splits: [...Array(2)].map(() => ({
      accountId: null,
      increase: '',
      decrease: '',
    })),
  };

  return (
    <ToastContext.Consumer>
      {toaster => (
        <>
          <Formik
            initialValues={initialValues}
            onSubmit={(
              { date, description, splits },
              { setSubmitting, resetForm }
            ) => {
              const preparedSplits = splits.map(split => ({
                accountId: split.accountId ? split.accountId.id : null,
                amount: split.increase
                  ? Math.abs(parseFloat(split.increase))
                  : Math.abs(parseFloat(split.decrease)) * -1,
              }));
              return createTransaction(
                moment(date).format('YYYY-MM-DD'),
                description,
                preparedSplits
              )
                .then(() => {
                  setSubmitting(false);
                  resetForm({ ...initialValues, date });
                  toaster.show({
                    icon: 'tick-circle',
                    intent: 'success',
                    message: `Transaction Created`,
                  });
                })
                .catch(() => {
                  setSubmitting(false);
                  toaster.show({
                    icon: 'warning-sign',
                    intent: 'danger',
                    message: `Failed to Save Transaction`,
                  });
                });
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Dialog
                icon="plus"
                title="Create Transaction"
                isOpen={true}
                onClose={onClose}
                footer={
                  <>
                    <Button onClick={onClose}>Close</Button>
                    <Button
                      intent="primary"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      Save
                    </Button>
                  </>
                }
              >
                <TransactionForm
                  icon="plus"
                  title="CreateTransaction"
                  onClose={onClose}
                />
              </Dialog>
            )}
          </Formik>
        </>
      )}
    </ToastContext.Consumer>
  );
}
