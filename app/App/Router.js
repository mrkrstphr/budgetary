import { Button, NonIdealState } from '@blueprintjs/core';
import React, { Suspense, lazy } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import AccountDetails from 'pages/AccountDetails';
import DashboardPage from 'pages/Dashboard';
import ReconciliationDetails from 'pages/ReconciliationDetails';
import TransactionsByMonth from 'pages/TransactionsByMonth';
import ImportTransactions from 'pages/ImportTransactions';

const Accounts = lazy(() => import('pages/Accounts'));

function Lost() {
  const history = useHistory();

  return (
    <NonIdealState
      icon="zoom-out"
      title="I think you're lost, Little One. There's nothing here for you."
      action={
        <Button intent="primary" minimal onClick={() => history.push('/')}>
          Go Home
        </Button>
      }
    />
  );
}

export default () => (
  <Suspense fallback={null}>
    <Switch>
      <Route path="/" exact component={DashboardPage} />
      <Route path="/accounts" exact component={Accounts} />
      <Route path="/accounts/:id" component={AccountDetails} />
      <Route path="/reconciliation/:id" component={ReconciliationDetails} />
      <Route path="/transactions" exact component={TransactionsByMonth} />
      <Route path="/transactions/:month" component={TransactionsByMonth} />
      <Route path="/import-transactions" exact component={ImportTransactions} />
      <Route component={Lost} />
    </Switch>
  </Suspense>
);
