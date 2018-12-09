import moment from 'moment';
import React from 'react';
import { Cell, Header, Row, Table } from 'component/SimpleTable';
import WithTransactions from '../containers/WithTransactions';

function formatDate(date) {
  return moment(date).format('M/D/YYYY');
}

const Transactions = ({ transactions }) => {
  return (
    <Table style={{ width: 760 }}>
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
              <Cell>{accountIndex === 0 && formatDate(transaction.date)}</Cell>
              <Cell>{accountIndex === 0 && transaction.description}</Cell>
              <Cell>{account.account.name}</Cell>
              <Cell right>{account.amount.toFixed(2)}</Cell>
            </Row>
          )),
        )}
      </tbody>
    </Table>
  );
};

export default WithTransactions(Transactions);
