import React /*, { useState }*/ from 'react';
import { Button } from 'component/Button';
import { Form, InputText, Select } from 'component/Form';
import CreateTransaction from '../containers/CreateTransaction';
import WithCategories from '../containers/WithCategories';

// function useCounter(defaultValue = 0) {
//   const [currentValue, setCurrentValue] = useState((defaultValue = 0));

//   return [
//     currentValue,
//     () => setCurrentValue(currentValue - 1),
//     () => setCurrentValue(currentValue + 1),
//   ];
// }

const AddTransactionForm = ({ categories, createTransaction }) => {
  return (
    <Form
      debug
      prepareValuesForSubmit={values => {
        // TODO: FIXME: Find a better way to format numeric, etc values...
        values.splits = values.splits.map(split => ({
          ...split,
          amount: parseFloat(split.amount),
        }));
        return values;
      }}
      onSubmit={({ date, description, splits }) => {
        return createTransaction(date, description, splits);
      }}
      render={({ container, submit }) => (
        <div>
          <InputText
            name="date"
            label="Date: "
            autoFocus
            container={container}
          />
          <InputText
            name="description"
            label="Description: "
            container={container}
          />
          <Select
            name="splits[0].accountId"
            label="Category:"
            autoFocus
            options={categories.map(category => ({
              value: category.id,
              label: category.name,
            }))}
            container={container}
          />

          <InputText
            name="splits[0].amount"
            label="Amount: "
            container={container}
          />

          <div>
            <Button type="button" onClick={() => null}>
              Cancel
            </Button>
            <Button type="button" onClick={submit}>
              Save
            </Button>
          </div>
        </div>
      )}
    />
  );
};

export default CreateTransaction(WithCategories(AddTransactionForm));
