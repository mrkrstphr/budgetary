import {
  Alert,
  Button,
  HTMLTable,
  Popover,
  Menu,
  MenuItem,
} from '@blueprintjs/core';
import moment from 'moment';
import React from 'react';
import { useDeleteTransactionMutation } from 'mutation';
import { Link } from 'react-router-dom';
import EditTransactionForm from './EditTransactionForm';
import { ToastContext } from './ToastContext';

function formatDate(date) {
  return moment(date).format('M/D/YYYY');
}

export default function TransactionsList({
  filters,
  formatSplits = s => s,
  transactions,
}) {
  const [editTransaction, setEditTransaction] = React.useState(null);
  const [confirmDeleteItem, setConfirmDeleteItem] = React.useState(false);
  const [deleteTransaction] = useDeleteTransactionMutation({
    refetchVariables: { filters },
  });

  return (
    <ToastContext.Consumer>
      {toaster => (
        <>
          <Alert
            cancelButtonText="Cancel"
            confirmButtonText="Delete"
            icon="trash"
            intent="danger"
            isOpen={confirmDeleteItem}
            onCancel={() => setConfirmDeleteItem(false)}
            onConfirm={() =>
              deleteTransaction(confirmDeleteItem.id).then(() => {
                setConfirmDeleteItem(false);
                toaster.show({
                  icon: 'trash',
                  intent: 'success',
                  message: `Transaction Deleted`,
                });
              })
            }
          >
            {confirmDeleteItem && (
              <div>
                <p>Are you sure you want to delete this transaction?</p>
                <HTMLTable striped style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td>Date:</td>
                      <td>{confirmDeleteItem.date}</td>
                    </tr>
                    <tr>
                      <td>Description:</td>
                      <td>{confirmDeleteItem.description}</td>
                    </tr>
                  </tbody>
                </HTMLTable>
              </div>
            )}
          </Alert>

          {editTransaction && (
            <EditTransactionForm
              onClose={() => setEditTransaction(null)}
              transaction={editTransaction}
            />
          )}

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
                formatSplits(transaction.accounts).map(
                  (account, accountIndex) => (
                    <tr
                      key={account.id}
                      className={index % 2 === 1 ? 'odd' : 'even'}
                    >
                      <td>
                        {accountIndex === 0 && formatDate(transaction.date)}
                      </td>
                      <td>{accountIndex === 0 && transaction.description}</td>
                      <td>
                        <Link to={`/accounts/${account.account.id}`}>
                          {account.account.name}
                        </Link>
                      </td>
                      <td className="right">{account.amount.toFixed(2)}</td>
                      <td className="center">
                        {accountIndex === 0 && (
                          <Popover
                            content={
                              <Menu>
                                <MenuItem
                                  icon="edit"
                                  text="Edit"
                                  onClick={() =>
                                    setEditTransaction(transaction)
                                  }
                                />
                                <MenuItem
                                  icon="trash"
                                  intent="danger"
                                  text="Delete"
                                  onClick={() =>
                                    setConfirmDeleteItem(transaction)
                                  }
                                />
                              </Menu>
                            }
                          >
                            <Button minimal intent="primary" icon="more" />
                          </Popover>
                        )}
                      </td>
                    </tr>
                  ),
                ),
              )}
            </tbody>
          </HTMLTable>
        </>
      )}
    </ToastContext.Consumer>
  );
}
