/* eslint-disable react/no-array-index-key */
import { Button } from '@blueprintjs/core';
import { addDays } from 'date-fns';
import { ErrorMessage, Form } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { AccountSelect, TransactionTable } from 'component';
import { DatePicker, FieldError, Input } from 'component/Form';
import { useCounter } from 'lib';

export default function TransactionForm({ initialTransactionCount = 2 }) {
  const [transactionCount, addTransaction, removeTransaction] = useCounter(
    initialTransactionCount,
    2,
  );

  return (
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
          {[...Array(transactionCount)].map((e, index) => (
            <tr key={`transaction-row-${index}`}>
              <td>
                <AccountSelect name={`splits[${index}].accountId`} />
              </td>
              <td>
                <Input name={`splits[${index}].increase`} type="number" />
              </td>
              <td>
                <Input name={`splits[${index}].decrease`} type="number" />
              </td>
              <td>
                {index === transactionCount - 1 && (
                  <Button
                    icon="plus"
                    minimal
                    intent="primary"
                    onClick={addTransaction}
                  />
                )}
                {index === transactionCount - 1 && transactionCount > 2 && (
                  <Button
                    icon="cross"
                    minimal
                    intent="danger"
                    onClick={removeTransaction}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </TransactionTable>

      <ErrorMessage
        name="splits"
        render={(...messages) =>
          messages
            .filter(message => typeof message === 'string')
            .map(error => <FieldError key={error}>{error}</FieldError>)
        }
      />
    </Form>
  );
}

TransactionForm.propTypes = {
  initialTransactionCount: PropTypes.number,
};
