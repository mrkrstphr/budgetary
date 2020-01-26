import PropTypes from 'prop-types';
import React from 'react';
import { PageTitle } from 'component';
import AddImportTransactionButton from 'component/AddImportTransactionButton';
import { TabPanel } from 'component/TabPanel';
import TransactionList from 'component/TransactionList';
import { mapParamIdToId } from 'lib';
import { useAccountDetails, useTransactions } from 'query';
import { Tag } from '@blueprintjs/core';
import Statistics from './components/Statistics';
import Reconciliations from './components/Reconciliations';

function AccountDetails({ id }) {
  const { account, refetch: refetchAccount } = useAccountDetails(id);
  const {
    transactions,
    loading: transactionsLoading,
    refetch: refetchTransactions,
  } = useTransactions({
    filters: { accountId: id },
    paging: { perPage: 150 },
  });

  if (transactionsLoading) {
    return null;
  }

  return (
    <div>
      <PageTitle
        title={account.name}
        tag={
          !account.isOpen && (
            <Tag intent="danger" style={{ marginLeft: 10 }}>
              Closed
            </Tag>
          )
        }
      >
        <>
          <h2 className="title">
            {account.name}
            {!account.isOpen && (
              <Tag intent="danger" style={{ marginLeft: 10 }}>
                Closed
              </Tag>
            )}
          </h2>
        </>
      </PageTitle>
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

              {account.isOpen && (
                <AddImportTransactionButton
                  account={account}
                  refetchQueries={[]}
                  onAddTransaction={() => {
                    refetchAccount();
                    refetchTransactions();
                  }}
                />
              )}
            </div>
            <TransactionList
              filters={{ accountId: id }}
              transactions={transactionsLoading ? [] : transactions.items}
              onRemoveTransaction={() => {
                refetchAccount();
                refetchTransactions();
              }}
            />
          </div>,
          <Reconciliations account={account} />,
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
