import moment from 'moment';
import React, { useState } from 'react';
import MonthSwitcher from 'component/MonthSwitcher';
import { TabPanel } from 'component/TabPanel';
import AddTransactionForm from './components/AddTransactionForm';
import SpendBreakdown from './components/SpendBreakdown';
import Statistics from './components/Statistics';
import AddImportTransactionButton from 'component/AddImportTransactionButton';
import TransactionsList from 'component/TransactionList';
import { useMonthsQuery, useTransactionsQuery } from 'query';

function TransactionsTab({ onAddTransaction, month }) {
  const { error, loading, transactions } = useTransactionsQuery({
    filters: { month },
  });

  if (error || loading) {
    return null; // TODO FIXME
  }

  return (
    <div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          padding: '10px 0',
        }}
      >
        <h3 style={{ flex: 1, margin: 0 }}>Transactions</h3>

        <AddImportTransactionButton onAddTransaction={onAddTransaction} />
      </div>

      <TransactionsList transactions={transactions.items} />
    </div>
  );
}

function TransactionsPage({ match }) {
  const [addOpen, setAddOpen] = useState(false);
  const { error, loading, months } = useMonthsQuery();

  if (loading) {
    return null;
  }

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

        <MonthSwitcher months={months} selectedMonth={selectedMonth} />
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
          <TransactionsTab
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

export default TransactionsPage;
