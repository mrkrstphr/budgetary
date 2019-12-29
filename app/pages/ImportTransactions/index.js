import React from 'react';
import { withRouter } from 'react-router-dom';
import { PageTitle } from 'component';
import ImportTransactions from './components/ImportTransactions';

function TransactionsPage() {
  return (
    <div>
      <PageTitle title="Import Transactions" />

      <ImportTransactions />
    </div>
  );
}

export default withRouter(TransactionsPage);
