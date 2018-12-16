import React from 'react';
import { Route } from 'react-router-dom';
// import { makeAsyncLoader } from 'lib';
import AccountDetails from './pages/AccountDetails';

const routes = [
  <Route
    path="/categories/:id"
    key="route--category-details"
    exact
    component={AccountDetails}
  />,
];

export { routes };
