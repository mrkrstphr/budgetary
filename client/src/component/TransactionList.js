import { HTMLTable } from '@blueprintjs/core';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';

function formatDate(date) {
  return moment(date).format('M/D/YYYY');
}

export default function TransactionsList({ transactions }) {
  return (
    <HTMLTable striped interactive style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th className="right">Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, index) => {
          const rows = transaction.accounts.map((account, accountIndex) => (
            <tr key={account.id}>
              <td>{accountIndex === 0 && formatDate(transaction.date)}</td>
              <td>{accountIndex === 0 && transaction.description}</td>
              <td>
                <Link to={`/account/${account.account.id}`}>
                  {account.account.name}
                </Link>
              </td>
              <td className="right">{account.amount.toFixed(2)}</td>
            </tr>
          ));

          if (rows.length > 1) {
            rows.push(
              <tr key={`${transaction.id}--totals`} odd={index % 2 === 1}>
                <td colSpan="3" className="right">
                  <strong>Total:</strong>
                </td>
                <td className="right">
                  <strong>{transaction.amount.toFixed(2)}</strong>
                </td>
              </tr>,
            );
          }

          return rows;
        })}
      </tbody>
    </HTMLTable>
  );
}
