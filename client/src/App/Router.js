import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AccountDetails from 'pages/AccountDetails';
import DashboardPage from 'pages/Dashboard';
import TransactionsByMonth from 'pages/TransactionsByMonth';
import ImportTransactions from 'pages/ImportTransactions';

export default () => (
  <Switch>
    <Route path="/" exact component={DashboardPage} />
    <Route path="/accounts/:id" component={AccountDetails} />
    <Route path="/transactions" exact component={TransactionsByMonth} />
    <Route path="/transactions/:month" component={TransactionsByMonth} />
    <Route path="/import-transactions" exact component={ImportTransactions} />
  </Switch>
);
