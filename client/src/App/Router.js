import React from 'react';
import { Switch } from 'react-router-dom';
import { routes as categories } from 'Categories';
import { routes as transactions } from 'Transactions';

export default () => (
  <Switch>
    {categories}
    {transactions}
  </Switch>
);
