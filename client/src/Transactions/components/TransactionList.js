import {
  Button,
  ButtonGroup,
  HTMLTable,
  Menu,
  MenuItem,
  Popover,
  Position,
} from '@blueprintjs/core';
import moment from 'moment';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import WithTransactions from '../containers/WithTransactions';

function formatDate(date) {
  return moment(date).format('M/D/YYYY');
}

const AddMenu = withRouter(({ history }) => (
  <Menu>
    <MenuItem
      onClick={() => history.push('/import-transactions')}
      text="Import Transactions"
      icon="import"
    />
  </Menu>
));

const Transactions = ({ transactions, onAddTransaction }) => {
  return (
    <div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          padding: '10px 0',
        }}
      >
        <h3 style={{ flex: 1, margin: 0 }}>Transactions</h3>

        <ButtonGroup style={{ minWidth: 120 }}>
          <Button icon="add" intent="success" onClick={onAddTransaction}>
            Add Transaction
          </Button>
          <Popover content={<AddMenu />} position={Position.BOTTOM}>
            <Button icon={'caret-down'} intent="success" />
          </Popover>
        </ButtonGroup>
      </div>
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
          {transactions.items.map((transaction, index) => {
            const rows = transaction.accounts.map((account, accountIndex) => (
              <tr key={account.id}>
                <td>{accountIndex === 0 && formatDate(transaction.date)}</td>
                <td>{accountIndex === 0 && transaction.description}</td>
                <td>
                  <Link to={`/categories/${account.account.id}`}>
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
    </div>
  );
};

export default WithTransactions(Transactions);
