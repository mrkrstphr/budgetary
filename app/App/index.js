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

const AppContainer = styled.div`
  background-color: ${({ theme }) => theme.appBgColor};
`;

const BodyStyles = styled.div`
  background-color: ${({ theme }) => theme.appBgColor};
  padding: 0 20px;
`;

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
        <AppContainer
          theme={theme}
          className={theme.name === 'dark' ? 'bp3-dark' : ''}
        >
          <Sidebar
            shadow={false}
            open
            docked
            onSetOpen={() => null}
            sidebar={<AppSidebar onToggle={() => null} />}
          >
            <BodyStyles>
              <Header sidebarOpen onSetOpen={() => null} />
              <Layout>
                <Router />
              </Layout>
            </BodyStyles>
          </Sidebar>
        </AppContainer>
      )}
    </AppContext.Consumer>
  );
}

function isAuthError(error) {
  return (
    error && error.message.toLowerCase() === 'graphql error: unauthenticated'
  );
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
      <BrowserRouter>
        <AppStyles />
        {renderApp(error, loading, me)}
      </BrowserRouter>
    </Context>
  );
}
