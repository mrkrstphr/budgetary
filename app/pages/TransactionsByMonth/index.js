import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';
import { BrowserTitle } from 'component';
import MonthSwitcher from 'component/MonthSwitcher';
import { TabPanel } from 'component/TabPanel';
import AddImportTransactionButton from 'component/AddImportTransactionButton';
import TransactionsList from 'component/TransactionList';
import { useMonthsQuery, useTransactionsQuery } from 'query';
import SpendBreakdown from './components/SpendBreakdown';
import Statistics from './components/Statistics';

function TransactionsTab({ month }) {
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

        <AddImportTransactionButton />
      </div>

      <TransactionsList transactions={transactions.items} filters={{ month }} />
    </div>
  );
}

TransactionsTab.propTypes = {
  month: PropTypes.string.isRequired,
};

function TransactionsPage() {
  const { month } = useParams();
  const { loading, months } = useMonthsQuery();

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
      <BrowserTitle
        title={`${moment(`${`${selectedMonth.name}-01`}`).format(
          'MMMM YYYY',
        )} Transactions`}
      />
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
          {moment(`${`${selectedMonth.name}-01`}`).format('MMMM YYYY')}
        </h2>

        <MonthSwitcher months={months} selectedMonth={selectedMonth} />
      </div>

      <Statistics month={selectedMonth} />

      <TabPanel
        tabs={[{ label: 'Transactions' }, { label: 'Spending Breakdown' }]}
        contents={[
          <TransactionsTab month={selectedMonth.name} />,
          <SpendBreakdown month={selectedMonth.name} />,
        ]}
        style={{ marginTop: 20 }}
      />
    </div>
  );
}

export default TransactionsPage;
