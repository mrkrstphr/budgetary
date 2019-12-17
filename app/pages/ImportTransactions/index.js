import React from 'react';
import { withRouter } from 'react-router-dom';
import ImportTransactions from './components/ImportTransactions';

function TransactionsPage() {
  return (
    <div>
      <div
        style={{
          borderBottom: '1px solid #eee',
          alignItems: 'center',
          display: 'flex',
          marginBottom: 10,
          paddingBottom: 10,
        }}
      >
        <h2 style={{ flex: 1, margin: 0 }}>Import Transactions</h2>
      </div>

      <ImportTransactions />
    </div>
  );
}

export default withRouter(TransactionsPage);
