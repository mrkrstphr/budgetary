import { Button, Callout } from '@blueprintjs/core';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { isNil } from 'lodash';
import moment from 'moment';
import React, { useReducer } from 'react';
import * as yup from 'yup';
import { Dialog } from 'component/Dialog';
import { FieldColumn, FieldError, FieldRow } from 'component/Form';
import { CreateableSelect, DatePicker, Input, Label } from 'component/Form';
import { useCreateTransaction } from 'mutation';
import { useAccountsQuery } from 'query';
import AddCategoryForm from './AddCategoryForm';
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

export default function AddTransactionForm({ onClose }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, error, accounts } = useAccountsQuery();
  const [createTransaction] = useCreateTransaction();

  const initialValues = {
    date: new Date(),
    description: '',
    splits: [...Array(state.transactionCount)].map((e, index) => ({
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
            <AddCategoryForm
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
                accountId: split.accountId ? split.accountId.value : null,
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
            {({
              handleSubmit,
              isSubmitting,
              setFieldTouched,
              setFieldValue,
              values,
            }) => (
              <Dialog
                header="Add Transaction"
                footer={
                  <div>
                    <Button intent="danger" minimal onClick={onClose}>
                      Close
                    </Button>{' '}
                    <Button
                      intent="primary"
                      minimal
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      Save
                    </Button>
                  </div>
                }
              >
                <Form>
                  <Field
                    name="date"
                    render={({ field }) => (
                      <>
                        <Label htmlFor={field.name}>Transaction Date</Label>
                        <DatePicker
                          name="date"
                          onChange={setFieldValue}
                          value={values.date}
                        />
                      </>
                    )}
                  />
                  <ErrorMessage name="date" component={FieldError} />
                  <Field
                    name="description"
                    render={({ field }) => (
                      <>
                        <Label htmlFor={field.name}>Description</Label>
                        <Input
                          id={field.name}
                          {...field}
                          type="text"
                          autoFocus
                        />
                      </>
                    )}
                  />
                  <ErrorMessage name="description">
                    {msg => (
                      <Callout intent="danger" minimal>
                        {msg}
                      </Callout>
                    )}
                  </ErrorMessage>
                  <FieldRow>
                    <FieldColumn flex={2}>Category</FieldColumn>
                    <FieldColumn>Increase</FieldColumn>
                    <FieldColumn>Decrease</FieldColumn>
                    <FieldColumn />
                  </FieldRow>
                  {[...Array(state.transactionCount)].map((e, index) => (
                    <>
                      <FieldRow key={`transaction-row-${index}`}>
                        <FieldColumn flex={3}>
                          <Field
                            name={`splits[${index}].accountId`}
                            render={({ field }) => (
                              <>
                                <CreateableSelect
                                  {...field}
                                  onChange={setFieldValue}
                                  onBlur={setFieldTouched}
                                  options={
                                    loading || error
                                      ? []
                                      : accounts.map(account => ({
                                          value: account.id,
                                          label: account.name,
                                        }))
                                  }
                                  onCreateOption={newValue => {
                                    dispatch({
                                      type: 'open',
                                      name: newValue,
                                      onSaveEvent: account => {
                                        setFieldValue(
                                          `splits[${index}].accountId`,
                                          {
                                            value: account.id,
                                            label: account.name,
                                          }
                                        );
                                      },
                                    });
                                  }}
                                />
                              </>
                            )}
                          />
                          <ErrorMessage
                            name={`splits[${index}].accountId`}
                            component={FieldError}
                          />
                        </FieldColumn>
                        <FieldColumn flex={2}>
                          <Field
                            name={`splits[${index}].increase`}
                            render={({ field }) => (
                              <>
                                <Input
                                  id={field.name}
                                  {...field}
                                  type="text"
                                  size="5"
                                />
                              </>
                            )}
                          />
                          <ErrorMessage
                            name={`splits[${index}].increase`}
                            component={FieldError}
                          />
                        </FieldColumn>
                        <FieldColumn flex={2}>
                          <Field
                            name={`splits[${index}].decrease`}
                            render={({ field }) => (
                              <>
                                <Input
                                  id={field.name}
                                  {...field}
                                  type="text"
                                  size="5"
                                />
                              </>
                            )}
                          />
                          <ErrorMessage
                            name={`splits[${index}].decrease`}
                            component={FieldError}
                          />
                        </FieldColumn>
                        <FieldColumn>
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
                        </FieldColumn>
                      </FieldRow>
                      <ErrorMessage name={`splits[${index}]`}>
                        {msg => (
                          <Callout intent="danger" minimal>
                            {msg}
                          </Callout>
                        )}
                      </ErrorMessage>
                    </>
                  ))}
                </Form>
              </Dialog>
            )}
          </Formik>
        </>
      )}
    </ToastContext.Consumer>
  );
}
