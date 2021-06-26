import { Button } from '@blueprintjs/core';
import Decimal from 'decimal.js';
import { Formik } from 'formik';
import { isNil } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Dialog } from 'component';
import { useCreateTransaction } from 'mutation';
import * as Yup from 'yup';
import { formatIsoDate } from 'lib';
import TransactionForm from './TransactionForm';
import { AppContext } from '../App/Context';

Yup.addMethod(
  Yup.object,
  'onlyOneOf',
  function validateOnlyOneOf(
    list,
    // eslint-disable-next-line no-template-curly-in-string
    message = '${path} must have at least one of these keys: ${keys}',
  ) {
    return this.test({
      name: 'onlyOneOf',
      message,
      exclusive: true,
      params: { keys: list.join(', ') },
      test: (value) =>
        value == null || list.filter((f) => !isNil(value[f])).length === 1,
    });
  },
);

const AddTransactionSchema = Yup.object().shape({
  description: Yup.string().required(),
  splits: Yup.array()
    .of(
      Yup.object().shape({
        accountId: Yup.string('Account selection is required')
          .nullable()
          .required('Account selection is required'),
        increase: Yup.number().moreThan(0, 'Must be greater than 0'),
        decrease: Yup.number()
          .moreThan(0, 'Must be greater than 0')
          .test(
            'validate-only-one',
            'Only one of increase or decrease is allowed per account line item',
            async function validateOnlyOneIncreaseOrDecrease() {
              if (
                !isNil(this.parent.increase) &&
                !isNil(this.parent.decrease)
              ) {
                return false;
              }

              if (isNil(this.parent.increase) && isNil(this.parent.decrease)) {
                return false;
              }

              return true;
            },
          ),
      }),
    )
    .test(
      'validate-transaction-balances',
      'Transaction must balance; all amounts must add up to zero.',
      async function validateNotExists(data) {
        const difference = data.reduce((sum, row) => {
          if (!row.increase && !row.decrease) {
            return sum;
          }

          if (row.increase) {
            return sum.plus(row.increase);
          }

          return sum.minus(row.decrease);
        }, new Decimal(0));

        return difference.equals(0);
      },
    ),
});

export default function AddTransactionForm({
  account,
  onClose,
  onAddTransaction = () => null,
}) {
  const [createTransaction] = useCreateTransaction();

  const initialValues = {
    date: new Date(),
    description: '',
    splits: [
      {
        accountId: account,
        increase: '',
        decrease: '',
      },
      {
        accountId: null,
        increase: '',
        decrease: '',
      },
    ],
  };

  return (
    <AppContext.Consumer>
      {({ notify }) => (
        <>
          <Formik
            initialValues={initialValues}
            validateOnBlur={false}
            validationSchema={AddTransactionSchema}
            onSubmit={(
              { date, description, splits },
              { setSubmitting, resetForm },
            ) => {
              const preparedSplits = splits.map((split) => ({
                accountId: split.accountId ? split.accountId.id : null,
                amount: split.increase
                  ? Math.abs(parseFloat(split.increase))
                  : Math.abs(parseFloat(split.decrease)) * -1,
              }));
              return createTransaction(
                formatIsoDate(date),
                description,
                preparedSplits,
              )
                .then(({ errors, transaction }) => {
                  setSubmitting(false);
                  if (errors) {
                    // TODO FIXME properly parse the errors
                    notify('Failed to Save Transaction', 'danger');
                    return;
                  }
                  onAddTransaction(transaction);
                  resetForm({ values: { ...initialValues, date } });
                  notify('Transaction Created');
                })
                .catch(() => {
                  setSubmitting(false);
                  notify('Failed to Save Transaction', 'danger');
                });
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Dialog
                icon="plus"
                title="Create Transaction"
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
                  icon="plus"
                  title="CreateTransaction"
                  onClose={onClose}
                />
              </Dialog>
            )}
          </Formik>
        </>
      )}
    </AppContext.Consumer>
  );
}

AddTransactionForm.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onAddTransaction: PropTypes.func,
};
