import {
  Alert,
  Button,
  HTMLTable,
  Popover,
  Menu,
  MenuItem,
} from '@blueprintjs/core';
import PropTypes from 'prop-types';
import React from 'react';
import { useDeleteTransaction } from 'mutation';
import EditTransactionForm from './EditTransactionForm';
import { AppContext } from '../App/Context';

export default function TransactionActions({
  onRemoveTransaction = () => null,
  transaction,
}) {
  const [editTransaction, setEditTransaction] = React.useState(null);
  const [confirmDeleteItem, setConfirmDeleteItem] = React.useState(false);
  const [deleteTransaction] = useDeleteTransaction();

  return (
    <AppContext.Consumer>
      {({ notify }) => (
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
                notify('Transaction Deleted');
                onRemoveTransaction();
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

          <Popover
            content={
              <Menu>
                <MenuItem
                  icon="edit"
                  text="Edit"
                  onClick={() => setEditTransaction(transaction)}
                />
                <MenuItem
                  icon="trash"
                  intent="danger"
                  text="Delete"
                  onClick={() => setConfirmDeleteItem(transaction)}
                />
              </Menu>
            }
          >
            <Button minimal intent="primary" icon="more" />
          </Popover>
        </>
      )}
    </AppContext.Consumer>
  );
}

TransactionActions.propTypes = {
  onRemoveTransaction: PropTypes.func,
  transaction: PropTypes.object.isRequired,
};
