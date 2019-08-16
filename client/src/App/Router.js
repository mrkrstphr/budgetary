import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { routes as categories } from 'Categories';
import DashboardPage from 'pages/Dashboard';
import TransactionsByMonth from 'pages/TransactionsByMonth';
import ImportTransactions from 'pages/ImportTransactions';

export default () => (
  <Switch>
    <Route path="/" exact component={DashboardPage} />
    {categories}
    <Route path="/transactions" exact component={TransactionsByMonth} />
    <Route path="/transactions/:month" exact component={TransactionsByMonth} />
    <Route path="/import-transactions" exact component={ImportTransactions} />
  </Switch>
);
