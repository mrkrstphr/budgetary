import moment from 'moment';
import React, { useState } from 'react';
import { TabPanel } from 'component/TabPanel';
import AddTransactionForm from '../components/AddTransactionForm';
import TransactionList from '../components/TransactionList';
import WithMonths from '../containers/WithMonths';
import Select from 'react-select';
import SpendBreakdown from '../components/SpendBreakdown';
import Statistics from '../components/Statistics';

function TransactionsPage({ months }) {
  const [selectedMonth, selectMonth] = useState({
    ...months[0],
    label: months[0].name,
    value: months[0].name,
  });
  const [addOpen, setAddOpen] = useState(false);

  const toggleAddOpen = () => setAddOpen(!addOpen);

  return (
    <div>
      <div
        style={{
          borderBottom: '1px solid #eee',
          alignItems: 'center',
          display: 'flex',
          marginBottom: 10,
          paddingBottom: 10,
        }}
      >
        <h2 style={{ flex: 1, margin: 0 }}>
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

      {addOpen && (
        <AddTransactionForm
          onClose={toggleAddOpen}
          currentMonth={selectedMonth.name}
        />
      )}

      <TabPanel
        tabs={[{ label: 'Transactions' }, { label: 'Spending Breakdown' }]}
        contents={[
          <TransactionList
            month={selectedMonth.value}
            onAddTransaction={toggleAddOpen}
          />,
          <SpendBreakdown month={selectedMonth.value} />,
        ]}
        style={{ marginTop: 20 }}
      />
    </div>
  );
}

export default WithMonths(TransactionsPage);
