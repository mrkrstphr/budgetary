import { Checkbox, HTMLTable } from '@blueprintjs/core';
import React from 'react';
import { BrowserTitle } from 'component';
import { formatDate, mapParamIdToId } from 'lib';
import { useMarkReconciled } from 'mutation';
import { useReconciliation } from 'query';
import ActionBar from './ActionBar';
import Summary from './Summary';
import Title from './Title';
import TransactionActions from 'component/TransactionActions';

function findAccount(reconciliation, transaction) {
  return transaction.accounts.find(
    a => a.account.id === reconciliation.account.id,
  );
}

function calculateReconciledBalance(reconciliation) {
  return (
    reconciliation.startingBalance +
    reconciliation.transactions.reduce((balance, transaction) => {
      const account = findAccount(reconciliation, transaction);

      if (
        account.reconciliation !== null &&
        account.reconciliation.id === reconciliation.id
      ) {
        return balance + account.amount;
      }

      return balance;
    }, 0)
  ).toFixed(2);
}

function ReconciliationDetailsPage({ id }) {
  const { error, loading, reconciliation } = useReconciliation(id);
  const [markReconciled] = useMarkReconciled();

  if (loading || error) return null;

  return (
    <div>
      <BrowserTitle title={`Account Reconciliation`} />

      <Title reconciliation={reconciliation} />
      <Summary
        balance={calculateReconciledBalance(reconciliation)}
        reconciliation={reconciliation}
      />

      <HTMLTable interactive striped style={{ width: '100%' }}>
        <thead>
          <tr>
            {reconciliation.status.toLowerCase() === 'open' ? (
              <th style={{ width: 20 }}> </th>
            ) : null}
            <th>Date</th>
            <th>Description</th>
            <th className="right">Amount</th>
            <th style={{ width: 50 }}> </th>
          </tr>
        </thead>
        <tbody>
          {reconciliation.transactions.map(trans => {
            const account = findAccount(reconciliation, trans);
            return (
              <tr key={`transaction-${trans.id}`}>
                {reconciliation.status.toLowerCase() === 'open' ? (
                  <td>
                    <Checkbox
                      checked={
                        account.reconciliation !== null &&
                        account.reconciliation.id === reconciliation.id
                      }
                      onChange={e =>
                        markReconciled(
                          account.id,
                          e.target.checked ? reconciliation.id : null,
                        )
                      }
                    />
                  </td>
                ) : null}
                <td>{formatDate(trans.date)}</td>
                <td>{trans.description}</td>
                <td className="right">{account.amount.toFixed(2)}</td>
                <td>
                  {reconciliation.status.toLowerCase() === 'open' && (
                    <TransactionActions transaction={trans} />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </HTMLTable>

      {reconciliation.status.toLowerCase() === 'open' && (
        <ActionBar
          reconciliation={reconciliation}
          balance={calculateReconciledBalance(reconciliation)}
        />
      )}
    </div>
  );
}

export default mapParamIdToId(ReconciliationDetailsPage);
