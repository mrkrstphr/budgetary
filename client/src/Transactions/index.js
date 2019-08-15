import React from 'react';
import { Route } from 'react-router-dom';
import ImportPage from './pages/ImportPage';
import Transactions from './pages/Transactions';

const routes = [
  <Route
    path="/transactions"
    key="route--transactions"
    exact
    component={Transactions}
  />,
  <Route
    path="/transactions/:month"
    key="route--transactions-by-month"
    exact
    component={Transactions}
  />,
  <Route
    path="/import-transactions"
    key="route--transactions-import"
    exact
    component={ImportPage}
  />,
];

export { routes };
