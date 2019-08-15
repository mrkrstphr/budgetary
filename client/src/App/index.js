import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppStyles from 'component/AppStyles';
import Layout from 'component/Layout';
import Header from './component/Header';
import Login from './component/Login';
import Router from './Router';
import Context from './Context';
import ToastContext from './../component/ToastContext';

export default () => (
  <Context
    login={() => <Login />}
    router={() => (
      <BrowserRouter>
        <ToastContext>
          <AppStyles />
          <Header />
          <Layout>
            <Router />
          </Layout>
        </ToastContext>
      </BrowserRouter>
    )}
  />
);
