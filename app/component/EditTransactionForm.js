import { Button } from '@blueprintjs/core';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Dialog } from 'component';
import { formatIsoDate } from 'lib';
import { useUpdateTransaction } from 'mutation';
import { useAccounts } from 'query';
import TransactionForm from './TransactionForm';
import { AppContext } from '../App/Context';

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
  const { notify } = useContext(AppContext);

  const initialValues = {
    date: new Date(transaction.date),
    description: transaction.description,
    splits: transaction.accounts.map((account) => {
      const accountDetails = accounts
        ? accounts.find((a) => a.id === account.account.id)
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
        const preparedSplits = splits.map((split) => ({
          accountId: split.accountId ? split.accountId.id : null,
          amount: split.increase
            ? Math.abs(parseFloat(split.increase))
            : Math.abs(parseFloat(split.decrease)) * -1,
          id: split.id,
        }));

        return updateTransaction(
          transaction.id,
          formatIsoDate(date),
          description,
          preparedSplits,
        ).then(() => {
          setSubmitting(false);
          notify('Transaction Updated');
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
