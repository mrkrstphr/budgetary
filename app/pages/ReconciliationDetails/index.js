import { Checkbox, HTMLTable } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { BrowserTitle } from 'component';
import { formatDate, mapParamIdToId } from 'lib';
import { useMarkReconciled, useMassReconciliation } from 'mutation';
import { useReconciliation } from 'query';
import TransactionActions from 'component/TransactionActions';
import AddImportTransactionButton from 'component/AddImportTransactionButton';
import { isNil } from 'lodash';
import ActionBar from './ActionBar';
import Summary from './Summary';
import Title from './Title';

function findAccount(reconciliation, transaction) {
  return transaction.accounts.find(
    (a) => a.account.id === reconciliation.account.id,
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

function mapAndFilterTransactionsForReconciliation(
  transactions,
  reconciliation,
  filter = () => true,
) {
  return transactions
    .map((trans) =>
      trans.accounts.find((a) => a.account.id === reconciliation.account.id),
    )
    .filter(filter);
}

function ReconciliationDetailsPage({ id }) {
  const { error, loading, reconciliation, refetch } = useReconciliation(id);
  const [markReconciled] = useMarkReconciled();
  const [massReconciliation] = useMassReconciliation();
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    if (reconciliation) {
      const unreconciled = mapAndFilterTransactionsForReconciliation(
        reconciliation.transactions,
        reconciliation,
        (trans) => isNil(trans.reconciliation),
      );

      if (unreconciled.length === 0) {
        setCheckAll(true);
      }
    }
  }, [reconciliation, setCheckAll]);

  if (loading || error) return null;

  return (
    <div>
      <BrowserTitle title="Account Reconciliation" />

      <Title reconciliation={reconciliation} />
      <Summary
        balance={calculateReconciledBalance(reconciliation)}
        reconciliation={reconciliation}
      />

      <div style={{ textAlign: 'right' }}>
        <AddImportTransactionButton
          account={reconciliation.account}
          onAddTransaction={() => refetch()}
        />
      </div>

      <HTMLTable interactive striped style={{ width: '100%' }}>
        <thead>
          <tr>
            {reconciliation.status.toLowerCase() === 'open' ? (
              <th style={{ width: 20 }}>
                <Checkbox
                  checked={checkAll}
                  onChange={(e) => {
                    setCheckAll(e.target.checked);
                    if (e.target.checked) {
                      massReconciliation(
                        mapAndFilterTransactionsForReconciliation(
                          reconciliation.transactions,
                          reconciliation,
                          (trans) => isNil(trans.reconciliation),
                        ).map((trans) => ({
                          transactionAccountId: trans.id,
                          reconciliationId: reconciliation.id,
                        })),
                      );
                    } else {
                      massReconciliation(
                        mapAndFilterTransactionsForReconciliation(
                          reconciliation.transactions,
                          reconciliation,
                          (trans) =>
                            trans.reconciliation?.id === reconciliation.id,
                        ).map((trans) => ({
                          transactionAccountId: trans.id,
                          reconciliationId: null,
                        })),
                      );
                    }
                  }}
                />
              </th>
            ) : null}
            <th>Date</th>
            <th>Description</th>
            <th className="right">Amount</th>
            <th style={{ width: 50 }}> </th>
          </tr>
        </thead>
        <tbody>
          {reconciliation.transactions.map((trans) => {
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
                      onChange={(e) =>
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
                    <TransactionActions
                      transaction={trans}
                      onRemoveTransaction={() => refetch()}
                    />
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

ReconciliationDetailsPage.propTypes = {
  id: PropTypes.string.isRequired,
};

export default mapParamIdToId(ReconciliationDetailsPage);
