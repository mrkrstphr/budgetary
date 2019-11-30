import { Button } from '@blueprintjs/core';
import { Formik, Form } from 'formik';
import { isNil } from 'lodash';
import moment from 'moment';
import React, { useReducer } from 'react';
import * as yup from 'yup';
import { AccountSelect, Dialog, TransactionTable } from 'component';
import { DatePicker, Input } from 'component/Form';
import { useCreateTransaction } from 'mutation';
import AddAccountForm from './AddAccountForm';
import { ToastContext } from './ToastContext';
import { addDays } from 'date-fns';

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
        ...state,
        isAddCategoryOpen: true,
        categoryName: action.name,
        onSaveEvent: action.onSaveEvent,
      };
    case 'close':
      return {
        ...state,
        isAddCategoryOpen: false,
        categoryName: '',
        onSaveEvent: null,
      };
    default:
      return state;
  }
}

export default function AddTransactionForm({ onClose }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [createTransaction] = useCreateTransaction();

  const initialValues = {
    date: new Date(),
    description: '',
    splits: [...Array(state.transactionCount)].map(() => ({
      accountId: null,
      increase: '',
      decrease: '',
    })),
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
            {({ handleSubmit, isSubmitting, setFieldValue }) => (
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
                <Form>
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
                </Form>
              </Dialog>
            )}
          </Formik>
        </>
      )}
    </ToastContext.Consumer>
  );
}
