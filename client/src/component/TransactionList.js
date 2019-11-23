import { HTMLTable } from '@blueprintjs/core';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import TransactionActions from './TransactionActions';

function formatDate(date) {
  return moment(date).format('M/D/YYYY');
}

export default function TransactionsList({
  filters,
  formatSplits = s => s,
  transactions,
}) {
  return (
    <HTMLTable style={{ width: '100%' }} className="valignMiddle">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th className="right">Amount</th>
          <th style={{ width: 16 }}> </th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, index) =>
          formatSplits(transaction.accounts).map((account, accountIndex) => (
            <tr key={account.id} className={index % 2 === 1 ? 'odd' : 'even'}>
              <td>{accountIndex === 0 && formatDate(transaction.date)}</td>
              <td>{accountIndex === 0 && transaction.description}</td>
              <td>
                <Link to={`/accounts/${account.account.id}`}>
                  {account.account.name}
                </Link>
              </td>
              <td className="right">{account.amount.toFixed(2)}</td>
              <td className="center">
                {accountIndex === 0 && (
                  <TransactionActions transaction={transaction} />
                )}
              </td>
            </tr>
          )),
        )}
      </tbody>
    </HTMLTable>
  );
}
