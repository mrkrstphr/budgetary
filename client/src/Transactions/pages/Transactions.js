import moment from 'moment';
import React, { useState } from 'react';
import AddTransactionForm from '../components/AddTransactionForm';
import TransactionList from '../components/TransactionList';
import WithMonths from '../containers/WithMonths';
import Select from 'react-select';
import Statistics from '../components/Statistics';

function TransactionsPage({ months }) {
  const [selectedMonth, selectMonth] = useState({
    ...months[0],
    label: months[0].name,
    value: months[0].name,
  });

  return (
    <div>
      <div style={{ alignItems: 'center', display: 'flex' }}>
        <h2 style={{ flex: 1 }}>
          {moment(`${selectedMonth.name + '-01'}`).format('MMMM YYYY')}
        </h2>

        <div style={{ fontSize: '0.75em', width: 220 }}>
          Switch Month:
          <Select
            options={months.map(month => ({
              ...month,
              label: month.name,
              value: month.name,
            }))}
            onChange={selected => {
              selectMonth(selected);
            }}
            value={selectedMonth}
          />
        </div>
      </div>
      <Statistics month={selectedMonth} />

      <AddTransactionForm />
      <TransactionList month={selectedMonth.value} />
    </div>
  );
}

export default WithMonths(TransactionsPage);
