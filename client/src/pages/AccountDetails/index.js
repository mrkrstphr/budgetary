import React from 'react';
import Statistics from './components/Statistics';
import TransactionList from 'component/TransactionList';
import { useAccountDetailsQuery, useTransactionsQuery } from 'query';

function AccountDetails({ id }) {
  const { account, loading } = useAccountDetailsQuery(id);
  const { transactions, loading: transactionsLoading } = useTransactionsQuery({
    filters: { accountId: id },
  });

  if (loading) {
    return null;
  }

  return (
    <div>
      <h2>{account.name}</h2>
      <Statistics account={account} />
      <p>Balance: ${account.currentBalance}</p>
      <h3>Recent Transactions</h3>
      {!transactionsLoading && (
        <TransactionList
          filters={{ accountId: id }}
          transactions={transactions.items}
          /*formatSplits={splits => {
            const newSplits = splits.filter(a => a.account.id !== id);
            newSplits[0].amount = newSplits[0].amount * -1;

            return newSplits;
          }}*/
        />
      )}
    </div>
  );
}

const MapParamIdToId = Component => props => {
  return <Component id={props.match.params.id} {...props} />;
};

export default MapParamIdToId(AccountDetails);
