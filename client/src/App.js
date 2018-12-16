import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import AppStyles from 'component/AppStyles';
import Header from 'component/Header';
import Layout from 'component/Layout';

export default () => (
  <div>
    <BrowserRouter>
      <div>
        <AppStyles />
        <Header />
        <Layout>
          <Router />
        </Layout>
      </div>
    </BrowserRouter>
  </div>
);
