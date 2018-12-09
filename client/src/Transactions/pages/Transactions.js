import React, { useState } from 'react';
import AddTransactionForm from '../components/AddTransactionForm';
import TransactionList from '../components/TransactionList';
import WithMonths from '../containers/WithMonths';
import Select from 'react-select';

function TransactionsPage({ months }) {
  const [selectedMonth, selectMonth] = useState({
    label: months[0].name,
    value: months[0].name,
  });

  return (
    <div>
      <h2>Transactions</h2>

      <Select
        options={months.map(({ name }) => ({
          label: name,
          value: name,
        }))}
        onChange={selected => {
          selectMonth(selected);
        }}
        value={selectedMonth}
      />

      <AddTransactionForm />
      <TransactionList month={selectedMonth.value} />
    </div>
  );
}

export default WithMonths(TransactionsPage);
