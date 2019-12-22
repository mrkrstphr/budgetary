import {
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  Popover,
} from '@blueprintjs/core';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import AddTransactionForm from 'component/AddTransactionForm';
import { useToggle } from 'lib';

export default function AddImportTransactionButton({ account }) {
  const history = useHistory();
  const [addOpen, toggleAddOpen] = useToggle(false);

  return (
    <>
      <ButtonGroup>
        <Button icon="plus" intent="success" onClick={toggleAddOpen}>
          Add Transaction
        </Button>
        <Popover
          content={
            <Menu>
              <MenuItem
                onClick={() => history.push('/import-transactions')}
                text="Import Transactions"
                icon="import"
              />
            </Menu>
          }
        >
          <Button icon="caret-down" intent="success" />
        </Popover>
      </ButtonGroup>
      {addOpen && (
        <AddTransactionForm account={account} onClose={toggleAddOpen} />
      )}
    </>
  );
}

AddImportTransactionButton.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
};
