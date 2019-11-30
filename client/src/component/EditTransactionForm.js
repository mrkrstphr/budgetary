import { Button, Dialog } from '@blueprintjs/core';
import { addDays } from 'date-fns';
import { Formik, Form } from 'formik';
import moment from 'moment';
import React, { useReducer } from 'react';
import { AccountSelect, TransactionTable } from 'component';
import { DatePicker, Input } from 'component/Form';
import { useUpdateTransactionMutation } from 'mutation';
import { useAccountsQuery } from 'query';
import AddAccountForm from './AddAccountForm';
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

const initialState = {
  isAddCategoryOpen: false,
  categoryName: '',
  onSaveEvent: null,
  transactionCount: 2,
};

function reducer(state, action) {
  switch (action.type) {
    case 'addTransaction':
      return {
        ...state,
        transactionCount: state.transactionCount + 1,
      };
    case 'removeTransaction':
      return {
        ...state,
        transactionCount: Math.max(2, state.transactionCount - 1),
      };
    case 'open':
      return {
        isAddCategoryOpen: true,
        categoryName: action.name,
        onSaveEvent: action.onSaveEvent,
      };
    case 'close':
      return { isAddCategoryOpen: false, categoryName: '', onSaveEvent: null };
    default:
      return state;
  }
}

export default function EditTransactionForm({ onClose, transaction }) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    transactionCount: transaction.accounts.length,
  });
  const { accounts } = useAccountsQuery();
  const [updateTransaction] = useUpdateTransactionMutation();

  const initialValues = {
    date: new Date(transaction.date),
    description: transaction.description,
    splits: transaction.accounts.map(account => {
      const accountDetails = accounts
        ? accounts.find(a => a.id === account.account.id)
        : null;

      return {
        id: account.id,
        accountId: accountDetails ? accountDetails : null,
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
          {state.isAddCategoryOpen && (
            <AddAccountForm
              initialValues={{ name: state.categoryName }}
              onClose={() => dispatch({ type: 'close' })}
              onSave={state.onSaveEvent}
            />
          )}
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
                preparedSplits
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
            {({ handleSubmit, isSubmitting, setFieldValue }) => (
              <Dialog
                icon="edit"
                title="Edit Transaction"
                isOpen={true}
                onClose={onClose}
              >
                <Form>
                  <div className="bp3-dialog-body">
                    <DatePicker
                      label="Transaction Date"
                      name="date"
                      maxDate={addDays(new Date(), 365)}
                    />

                    <Input label="Description" name="description" autoFocus />

                    <TransactionTable striped>
                      <thead>
                        <tr>
                          <th>Account</th>
                          <th>Increase</th>
                          <th>Decrease</th>
                          <th> </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(state.transactionCount)].map((e, index) => (
                          <tr key={`transaction-row-${index}`}>
                            <td>
                              <AccountSelect
                                name={`splits[${index}].accountId`}
                                onAddAccount={query =>
                                  dispatch({
                                    type: 'open',
                                    name: query,
                                    onSaveEvent: account => {
                                      setFieldValue(
                                        `splits[${index}].accountId`,
                                        {
                                          value: account.id,
                                          label: account.name,
                                        }
                                      );
                                    },
                                  })
                                }
                              />
                            </td>
                            <td>
                              <Input
                                name={`splits[${index}].increase`}
                                type="number"
                              />
                            </td>
                            <td>
                              <Input
                                name={`splits[${index}].decrease`}
                                type="number"
                              />
                            </td>
                            <td>
                              {index === state.transactionCount - 1 && (
                                <Button
                                  icon="plus"
                                  minimal
                                  intent="primary"
                                  onClick={() =>
                                    dispatch({ type: 'addTransaction' })
                                  }
                                />
                              )}
                              {index === state.transactionCount - 1 &&
                                state.transactionCount > 2 && (
                                  <Button
                                    icon="cross"
                                    minimal
                                    intent="danger"
                                    onClick={() =>
                                      dispatch({ type: 'removeTransaction' })
                                    }
                                  />
                                )}
                            </td>
                            {/* <ErrorMessage name={`splits[${index}]`}>
                          {msg => (
                            <Callout intent="danger" minimal>
                              {msg}
                            </Callout>
                          )}
                        </ErrorMessage> */}
                          </tr>
                        ))}
                      </tbody>
                    </TransactionTable>
                  </div>

                  <div className="bp3-dialog-footer">
                    <div className="bp3-dialog-footer-actions">
                      <Button onClick={onClose}>Close</Button>
                      <Button
                        intent="primary"
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
        </>
      )}
    </ToastContext.Consumer>
  );
}
