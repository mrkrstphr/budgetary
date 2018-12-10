import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import AppStyles from 'component/AppStyles';
import Layout from 'component/Layout';

export default () => (
  <div>
    <BrowserRouter>
      <div>
        <AppStyles />
        <h1>Tracking</h1>
        <Layout>
          <Router />
        </Layout>
      </div>
    </BrowserRouter>
  </div>
);
