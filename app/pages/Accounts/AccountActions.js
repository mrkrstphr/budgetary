import {
  Alert,
  Button,
  Menu,
  MenuDivider,
  MenuItem,
  Popover,
} from '@blueprintjs/core';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useToggle } from 'lib';
import { useCloseAccount, useReopenAccount } from 'mutation';
import EditAccount from './EditAccount';
import { AppContext } from '../../App/Context';

export default function AccountActions({ account }) {
  const [isEditOpen, toggleEditOpen] = useToggle();
  const [isConfirmCloseOpen, toggleConfirmClose] = useToggle();
  const [isConfirmReopenOpen, toggleConfirmReopen] = useToggle();
  const [closeAccount] = useCloseAccount();
  const [reopenAccount] = useReopenAccount();
  const { notify } = useContext(AppContext);

  return (
    <>
      {isConfirmCloseOpen && (
        <Alert
          cancelButtonText="Cancel"
          confirmButtonText="Close Account"
          icon="lock"
          intent="danger"
          isOpen
          onCancel={toggleConfirmClose}
          onConfirm={() =>
            closeAccount(account.id).then(({ errors }) => {
              if (errors) {
                notify(`Failed to close account "${account.name}"`, 'danger');
              } else {
                notify(`"${account.name}" was closed.`);
                toggleConfirmClose();
              }
            })
          }
        >
          <p>
            Are you sure you want to close the account{' '}
            <strong>{account.name}</strong>? You will no longer to be able to
            create budgets, goals, transactions, or reconciliations against it
            (unless you re-open it).
          </p>
        </Alert>
      )}

      {isConfirmReopenOpen && (
        <Alert
          cancelButtonText="Cancel"
          confirmButtonText="Re-open Account"
          icon="lock"
          intent="danger"
          isOpen
          onCancel={toggleConfirmReopen}
          onConfirm={() =>
            reopenAccount(account.id).then(({ errors }) => {
              if (errors) {
                notify(`Failed to re-open account "${account.name}"`, 'danger');
              } else {
                notify(`"${account.name}" was re-opened.`);
                toggleConfirmReopen();
              }
            })
          }
        >
          <p>
            Are you sure you want to re-open the account{' '}
            <strong>{account.name}</strong>?
          </p>
        </Alert>
      )}

      {isEditOpen && (
        <EditAccount
          initialValues={{
            id: account.id,
            initialBalance: account.initialBalance,
            name: account.name,
            showInMenu: account.showInMenu,
            type: account.type,
          }}
          onClose={toggleEditOpen}
        />
      )}

      <Popover
        content={
          <Menu>
            <MenuItem icon="edit" text="Edit" onClick={toggleEditOpen} />
            <MenuDivider />
            {account.isOpen && (
              <MenuItem
                icon="lock"
                intent="danger"
                text="Close Account"
                onClick={toggleConfirmClose}
              />
            )}
            {!account.isOpen && (
              <MenuItem
                icon="unlock"
                intent="danger"
                text="Reopen Account"
                onClick={toggleConfirmReopen}
              />
            )}
          </Menu>
        }
      >
        <Button minimal intent="primary" icon="more" />
      </Popover>
    </>
  );
}

AccountActions.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string.isRequired,
    initialBalance: PropTypes.number.isRequired,
    isOpen: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    showInMenu: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
};
