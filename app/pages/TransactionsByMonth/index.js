import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';
import { PageTitle } from 'component';
import MonthSwitcher from 'component/MonthSwitcher';
import { TabPanel } from 'component/TabPanel';
import AddImportTransactionButton from 'component/AddImportTransactionButton';
import TransactionsList from 'component/TransactionList';
import { formatMonthAndYear } from 'lib';
import { useMonths, useTransactions } from 'query';
import SpendBreakdown from './components/SpendBreakdown';
import Statistics from './components/Statistics';

function TransactionsTab({ month, onRefetch = () => null }) {
  const {
    error,
    loading,
    refetch: refetchTransactions,
    transactions,
  } = useTransactions({
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

        <AddImportTransactionButton
          onTransactionAdded={() => {
            refetchTransactions();
            onRefetch();
          }}
        />
      </div>

      <TransactionsList
        transactions={transactions.items}
        filters={{ month }}
        onRemoveTransaction={() => {
          refetchTransactions();
          onRefetch();
        }}
      />
    </div>
  );
}

TransactionsTab.propTypes = {
  month: PropTypes.string.isRequired,
  onRefetch: PropTypes.func,
};

function TransactionsPage() {
  const { month } = useParams();
  const { loading, months, refetch: refetchMonths } = useMonths();

  if (loading) {
    return null;
  }

  let selectedMonth = months[0];
  if (month) {
    const matchedMonths = months.filter(m => m.name === month);
    if (matchedMonths.length) {
      selectedMonth = {
        ...matchedMonths[0],
        label: matchedMonths[0].name,
        value: matchedMonths[0].name,
      };
    }
  }

  return (
    <div>
      <PageTitle
        title={`${formatMonthAndYear(
          `${`${selectedMonth.name}-01`}`,
        )} Transactions`}
        action={<MonthSwitcher months={months} selectedMonth={selectedMonth} />}
      />

      <Statistics month={selectedMonth} />

      <TabPanel
        tabs={[{ label: 'Transactions' }, { label: 'Spending Breakdown' }]}
        contents={[
          <TransactionsTab
            month={selectedMonth.name}
            onRefetch={() => refetchMonths()}
          />,
          <SpendBreakdown month={selectedMonth.name} />,
        ]}
        style={{ marginTop: 20 }}
      />
    </div>
  );
}

export default TransactionsPage;
