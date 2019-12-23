import { Button } from '@blueprintjs/core';
import { Formik } from 'formik';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { Dialog } from 'component';
import { useUpdateTransaction } from 'mutation';
import { useAccounts } from 'query';
import TransactionForm from './TransactionForm';
import { ToastContext } from './ToastContext';

// yup.addMethod(yup.object, 'onlyOneOf', function(
//   list,
//   // eslint-disable-next-line no-template-curly-in-string
//   message = '${path} must have at least one of these keys: ${keys}',
// ) {
//   return this.test({
//     name: 'onlyOneOf',
//     message: message,
//     exclusive: true,
//     params: { keys: list.join(', ') },
//     test: value => {
//       return value == null || list.filter(f => !isNil(value[f])).length === 1;
//     },
//   });
// });

export default function EditTransactionForm({ onClose, transaction }) {
  const { accounts } = useAccounts();
  const [updateTransaction] = useUpdateTransaction();

  const initialValues = {
    date: new Date(transaction.date),
    description: transaction.description,
    splits: transaction.accounts.map(account => {
      const accountDetails = accounts
        ? accounts.find(a => a.id === account.account.id)
        : null;

      return {
        id: account.id,
        accountId: accountDetails || null,
        increase:
          Math.abs(account.amount) === account.amount ? account.amount : '',
        decrease:
          Math.abs(account.amount) !== account.amount
            ? Math.abs(account.amount)
            : '',
      };
    }),
  };

  return (
    <ToastContext.Consumer>
      {toaster => (
        <>
          <Formik
            initialValues={initialValues}
            // validationSchema={AddTransactionSchema}
            // validate={values => {
            //   console.log({ values });
            //   AddTransactionSchema.validate(values, { abortEarly: false })
            //     .then(v => {
            //       console.log(v);
            //     })
            //     .catch(ex => {
            //       console.error(ex);
            //     });
            // }}
            onSubmit={({ date, description, splits }, { setSubmitting }) => {
              const preparedSplits = splits.map(split => ({
                accountId: split.accountId ? split.accountId.id : null,
                amount: split.increase
                  ? Math.abs(parseFloat(split.increase))
                  : Math.abs(parseFloat(split.decrease)) * -1,
              }));

              return updateTransaction(
                transaction.id,
                moment(date).format('YYYY-MM-DD'),
                description,
                preparedSplits,
              ).then(() => {
                setSubmitting(false);
                toaster.show({
                  icon: 'tick-circle',
                  intent: 'success',
                  message: `Transaction Updated`,
                });
                onClose();
              });
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Dialog
                icon="edit"
                title="Edit Transaction"
                isOpen
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
                  initialTransactionCount={transaction.accounts.length}
                />
              </Dialog>
            )}
          </Formik>
        </>
      )}
    </ToastContext.Consumer>
  );
}

EditTransactionForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  transaction: PropTypes.shape({
    accounts: PropTypes.arrayOf(PropTypes.object).isRequired,
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};
