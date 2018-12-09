import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import AppStyles from 'component/AppStyles';

export default () => (
  <div>
    <BrowserRouter>
      <div>
        <AppStyles />
        <h1>Tracking</h1>
        <Router />
      </div>
    </BrowserRouter>
  </div>
);
