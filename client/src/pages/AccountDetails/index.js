import React from 'react';
import { BrowserTitle } from 'component';
import Statistics from './components/Statistics';
import { TabPanel } from 'component/TabPanel';
import TransactionList from 'component/TransactionList';
import { useAccountDetailsQuery, useTransactionsQuery } from 'query';
import Reconciliations from './components/Reconciliations';

function AccountDetails({ id }) {
  const { account, loading } = useAccountDetailsQuery(id);
  const { transactions, loading: transactionsLoading } = useTransactionsQuery({
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
          <TransactionList
            filters={{ accountId: id }}
            transactions={transactionsLoading ? [] : transactions.items}
            /*formatSplits={splits => {
            const newSplits = splits.filter(a => a.account.id !== id);
            newSplits[0].amount = newSplits[0].amount * -1;

            return newSplits;
          }}*/
          />,
          <Reconciliations accountId={id} />,
        ]}
        style={{ marginTop: 20 }}
      />
    </div>
  );
}

const MapParamIdToId = Component => props => {
  return <Component id={props.match.params.id} {...props} />;
};

export default MapParamIdToId(AccountDetails);
