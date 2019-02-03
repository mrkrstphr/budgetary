import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

const routes = [
  <Route path="/" key="route--dashboard" exact component={Dashboard} />,
];

export { routes };
