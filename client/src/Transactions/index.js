import React from 'react';
import { Route } from 'react-router-dom';
// import { makeAsyncLoader } from 'lib';
import Transactions from './pages/Transactions';

const routes = [
  <Route path="/" key="route--transactions" exact component={Transactions} />,
  <Route
    path="/transactions/:month"
    key="route--transactions-by-month"
    exact
    component={Transactions}
  />,
];

export { routes };
