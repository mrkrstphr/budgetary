import { addDays } from 'date-fns';
import { ErrorMessage, Form } from 'formik';
import React from 'react';
import { AccountSelect } from 'component';
import { DatePicker, FieldError, Input } from 'component/Form';

export default function GoalForm() {
  return (
    <Form>
      <AccountSelect
        label="Account"
        name="account"
        allowedTypes={['bank', 'liabilities', 'credit']}
      />
      <ErrorMessage name="account.id" component={FieldError} />

      <Input label="Description" name="description" />

      <DatePicker
        label="Due Date"
        name="dueDate"
        maxDate={addDays(new Date(), 365 * 5)}
      />

      <Input label="Goal Amount" name="goalBalance" type="number" />
    </Form>
  );
}
