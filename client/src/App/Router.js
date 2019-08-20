import { Button, NonIdealState } from '@blueprintjs/core';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import useRouter from 'use-react-router';
import AccountDetails from 'pages/AccountDetails';
import DashboardPage from 'pages/Dashboard';
import TransactionsByMonth from 'pages/TransactionsByMonth';
import ImportTransactions from 'pages/ImportTransactions';

function Lost() {
  const { history } = useRouter();
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
  <Switch>
    <Route path="/" exact component={DashboardPage} />
    <Route path="/accounts/:id" component={AccountDetails} />
    <Route path="/transactions" exact component={TransactionsByMonth} />
    <Route path="/transactions/:month" component={TransactionsByMonth} />
    <Route path="/import-transactions" exact component={ImportTransactions} />
    <Route component={Lost} />
  </Switch>
);
