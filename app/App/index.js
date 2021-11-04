import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from 'react-sidebar';
import styled from 'styled-components';
import AppStyles from 'component/AppStyles';
import Layout from 'App/component/Layout';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Header from './component/Header';
import Login from './component/Login';
import Router from './Router';
import Context, { AppContext } from './Context';
import AppSidebar from './component/Sidebar';
import { AppLoading } from '../component/AppLoading';

const meQuery = gql`
  query fetchMe {
    me {
      id
      email
    }
  }
`;

function useMeQuery() {
  const { data, error, loading } = useQuery(meQuery);

  return {
    error,
    loading,
    me: error || loading ? null : data.me,
  };
}

function AuthenticatedApp() {
  return (
    <AppContext.Consumer>
      {({ theme }) => (
        <div>
          {/* <Sidebar
            shadow={false}
            open
            docked
            onSetOpen={() => null}
            sidebar={<AppSidebar onToggle={() => null} />}
          > */}
          {/* <BodyStyles> */}
          {/* <Header sidebarOpen onSetOpen={() => null} /> */}
          <Layout>
            <Router />
          </Layout>
          {/* </BodyStyles> */}
          {/* </Sidebar> */}
        </div>
      )}
    </AppContext.Consumer>
  );
}

function isAuthError(error) {
  return error && error.message.toLowerCase().includes('unauthenticated');
}

function renderApp(error, loading, user) {
  if (user) {
    return <AuthenticatedApp />;
  }

  if (isAuthError(error)) {
    return <Login />;
  }

  if (error) {
    return <div>ERROR TODO FIXME</div>;
  }

  return <AppLoading />;
}

export default function App() {
  const { error, loading, me } = useMeQuery();

  return (
    <Context user={me}>
      <BrowserRouter>{renderApp(error, loading, me)}</BrowserRouter>
    </Context>
  );
}
