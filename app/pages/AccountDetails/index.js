import PropTypes from 'prop-types';
import React from 'react';
import { BrowserTitle } from 'component';
import AddImportTransactionButton from 'component/AddImportTransactionButton';
import { TabPanel } from 'component/TabPanel';
import TransactionList from 'component/TransactionList';
import { mapParamIdToId } from 'lib';
import { useAccountDetails, useTransactions } from 'query';
import Statistics from './components/Statistics';
import Reconciliations from './components/Reconciliations';

function AccountDetails({ id }) {
  const { account, loading } = useAccountDetails(id);
  const { transactions, loading: transactionsLoading } = useTransactions({
    filters: { accountId: id },
    paging: { perPage: 150 },
  });

  if (loading) {
    return null;
  }

  return (
    <div>
      <BrowserTitle title={account.name} />
      <h2>{account.name}</h2>
      <Statistics account={account} />
      <p>Balance: ${account.currentBalance}</p>

      <TabPanel
        tabs={[{ label: 'Transactions' }, { label: 'Reconcilations' }]}
        contents={[
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
                account={account}
                onAddTransaction={() => null}
              />
            </div>
            <TransactionList
              filters={{ accountId: id }}
              transactions={transactionsLoading ? [] : transactions.items}
            />
          </div>,
          <Reconciliations accountId={id} />,
        ]}
        style={{ marginTop: 20 }}
      />
    </div>
  );
}

AccountDetails.propTypes = {
  id: PropTypes.string.isRequired,
};

export default mapParamIdToId(AccountDetails);
