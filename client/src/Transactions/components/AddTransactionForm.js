import React /*, { useState }*/ from 'react';
import styled from 'styled-components';
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

const Window = styled.div`
  background-color: #fff;
  padding: 14px;
`;

const Title = styled.div`
  background-color: blue;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  color: #fff;
  margin: 10px 0;
  padding: 8px 14px;
`;

const AddTransactionForm = ({ categories, createTransaction }) => {
  return (
    <Window style={{ width: 400 }}>
      <Title>Add Transaction</Title>

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
    </Window>
  );
};

export default CreateTransaction(WithCategories(AddTransactionForm));
