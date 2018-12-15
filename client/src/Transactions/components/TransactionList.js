import moment from 'moment';
import React from 'react';
import { Button } from 'component/Button';
import { Cell, Header, Row, Table } from 'component/SimpleTable';
import WithTransactions from '../containers/WithTransactions';

function formatDate(date) {
  return moment(date).format('M/D/YYYY');
}

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
        <Button onClick={onAddTransaction}>Add Transaction</Button>
      </div>
      <Table>
        <thead>
          <tr>
            <Header>Date</Header>
            <Header>Description</Header>
            <Header>Category</Header>
            <Header right>Amount</Header>
          </tr>
        </thead>
        <tbody>
          {transactions.items.map((transaction, index) =>
            transaction.accounts.map((account, accountIndex) => (
              <Row key={account.id} odd={index % 2 === 1}>
                <Cell>
                  {accountIndex === 0 && formatDate(transaction.date)}
                </Cell>
                <Cell>{accountIndex === 0 && transaction.description}</Cell>
                <Cell>{account.account.name}</Cell>
                <Cell right>{account.amount.toFixed(2)}</Cell>
              </Row>
            )),
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default WithTransactions(Transactions);
