import moment from 'moment';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { TabPanel } from 'component/TabPanel';
import AddTransactionForm from '../components/AddTransactionForm';
import TransactionList from '../components/TransactionList';
import WithMonths from '../containers/WithMonths';
import Select from 'react-select';
import SpendBreakdown from '../components/SpendBreakdown';
import Statistics from '../components/Statistics';

function TransactionsPage({ history, match, months }) {
  const [addOpen, setAddOpen] = useState(false);

  let selectedMonth = months[0];
  if (match.params.month) {
    const matchedMonths = months.filter(m => m.name === match.params.month);
    if (matchedMonths.length) {
      selectedMonth = {
        ...matchedMonths[0],
        label: matchedMonths[0].name,
        value: matchedMonths[0].name,
      };
    }
  }

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
              history.push(`/transactions/${selected.name}`);
            }}
            value={{
              ...selectedMonth,
              label: selectedMonth.name,
              value: selectedMonth.name,
            }}
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
            month={selectedMonth.name}
            onAddTransaction={toggleAddOpen}
          />,
          <SpendBreakdown month={selectedMonth.name} />,
        ]}
        style={{ marginTop: 20 }}
      />
    </div>
  );
}

export default withRouter(WithMonths(TransactionsPage));
