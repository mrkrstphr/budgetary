import {
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  Popover,
} from '@blueprintjs/core';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function AddImportTransactionButton({ onAddTransaction }) {
  const history = useHistory();

  return (
    <ButtonGroup>
      <Button icon="plus" intent="success" onClick={onAddTransaction}>
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
  );
}
