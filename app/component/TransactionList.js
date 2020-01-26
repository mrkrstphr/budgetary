import { HTMLTable } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from 'lib';
import TransactionActions from './TransactionActions';

export default function TransactionsList({
  onRemoveTransaction,
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
          transaction.accounts.map((account, accountIndex) => (
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
                  <TransactionActions
                    onRemoveTransaction={onRemoveTransaction}
                    transaction={transaction}
                  />
                )}
              </td>
            </tr>
          )),
        )}
      </tbody>
    </HTMLTable>
  );
}

TransactionsList.propTypes = {
  onRemoveTransaction: PropTypes.func,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      accounts: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          account: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
          }).isRequired,
          amount: PropTypes.number.isRequired,
        }),
      ).isRequired,
      date: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
