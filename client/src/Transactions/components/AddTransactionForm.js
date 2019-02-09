import { Formik, Form, Field, ErrorMessage } from 'formik';
import moment from 'moment';
import React, { useReducer } from 'react';
import { Button } from 'component/Button';
import { Dialog } from 'component/Dialog';
import { CreateableSelect, DatePicker, Input, Label } from 'component/Form';
import AddCategoryForm from './AddCategoryForm';
import CreateTransaction from '../containers/CreateTransaction';
import WithCategories from '../containers/WithCategories';

const initialState = {
  isAddCategoryOpen: false,
  categoryName: '',
  onSaveEvent: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'open':
      return {
        isAddCategoryOpen: true,
        categoryName: action.name,
        onSaveEvent: action.onSaveEvent,
      };
    case 'close':
      return { isAddCategoryOpen: false, categoryName: '', onSaveEvent: null };
    default:
      throw new Error();
  }
}

const AddTransactionForm = ({ categories, createTransaction, onClose }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialValues = {
    date: new Date(),
    description: '',
    splits: [{ accountId: null, amount: '' }],
  };

  return (
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
          { setSubmitting, resetForm },
        ) => {
          const preparedSplits = splits.map(split => ({
            ...split,
            accountId: split.accountId ? split.accountId.value : null,
            amount: parseFloat(split.amount),
          }));

          return createTransaction(
            moment(date).format('YYYY-MM-DD'),
            description,
            preparedSplits,
          ).then(() => {
            setSubmitting(false);
            resetForm({ ...initialValues, date });
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
            onClose={onClose}
            footer={
              <div>
                <Button danger type="button" onClick={onClose}>
                  Close
                </Button>
                <Button
                  primary
                  type="button"
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
              <ErrorMessage name="date" component="div" />

              <Field
                name="description"
                render={({ field }) => (
                  <>
                    <Label htmlFor={field.name}>Description</Label>
                    <Input id={field.name} {...field} type="text" autoFocus />
                  </>
                )}
              />
              <ErrorMessage name="description" component="div" />

              <Field
                name="splits[0].accountId"
                render={({ field }) => (
                  <>
                    <Label htmlFor={field.name}>Category</Label>
                    <CreateableSelect
                      {...field}
                      onChange={setFieldValue}
                      onBlur={setFieldTouched}
                      options={categories.map(category => ({
                        value: category.id,
                        label: category.name,
                      }))}
                      onCreateOption={newValue => {
                        dispatch({
                          type: 'open',
                          name: newValue,
                          onSaveEvent: account => {
                            setFieldValue('splits[0].accountId', {
                              value: account.id,
                              label: account.name,
                            });
                          },
                        });
                      }}
                    />
                  </>
                )}
              />
              <ErrorMessage name="splits[0].accountId" component="div" />

              <Field
                name="splits[0].amount"
                render={({ field }) => (
                  <>
                    <Label htmlFor={field.name}>Amount</Label>
                    <Input id={field.name} {...field} type="text" />
                  </>
                )}
              />
              <ErrorMessage name="splits[0].amount" component="div" />
            </Form>
          </Dialog>
        )}
      </Formik>
    </>
  );
};

export default CreateTransaction(WithCategories(AddTransactionForm));
