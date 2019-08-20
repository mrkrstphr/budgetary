import { Icon } from '@blueprintjs/core';
import { darken } from 'polished';
import React from 'react';
import { Link } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from 'react-sidebar';
import styled from 'styled-components';
import AppStyles from 'component/AppStyles';
import Layout from 'component/Layout';
import Header from './component/Header';
import Login from './component/Login';
import Router from './Router';
import Context, { AppContext } from './Context';
import ToastContext from './../component/ToastContext';
import { useAccountsQuery } from 'query';
import Logo from './component/Logo';

const mql = window.matchMedia(`(min-width: 800px)`);

const AppContainer = styled.div`
  background-color: ${({ theme }) => theme.appBgColor};
`;

const SidebarStyles = styled.div`
  background-color: #2d323d;
  color: #fff;
  height: 100vh;
  padding: 10px;
  width: 240px;

  .header {
    display: flex;

    .bp3-icon-menu {
      cursor: pointer;
    }
  }

  a,
  a:visited {
    color: #fff;
  }

  a:hover {
    text-decoration: none;
  }

  .menuItem {
    margin: 0 -10px 0 -10px;
    padding: 10px 10px 10px 20px;

    .bp3-icon {
      margin-right: 10px;
    }

    &:hover {
      background-color: ${darken(0.05, '#2d323d')};
    }
  }

  .heading {
    background-color: #1e2129;
    font-weight: 500;
    font-size: 1.1em;
    margin: 0 -10px 0 -10px;
    padding: 10px;

    .bp3-icon {
      margin-right: 10px;
    }
  }
`;

function accountType(accounts, type) {
  return accounts.filter(
    account => account.type.toLowerCase() === type.toLowerCase(),
  );
}

function AccountList({ accounts }) {
  return (
    <>
      {accounts.map(account => (
        <div className="menuItem" key={`account-sidebar-${account.id}`}>
          <Link to={`/accounts/${account.id}`}>
            <Icon icon="bank-account" /> {account.name}
          </Link>
        </div>
      ))}
    </>
  );
}

function AppSidebar({ onToggle }) {
  const { accounts, loading } = useAccountsQuery();

  return (
    <SidebarStyles>
      <div className="header">
        <Logo />
        <Icon icon="menu" onClick={onToggle} />
      </div>

      <div className="menuItem">
        <Link to="/">
          <Icon icon="home" /> Home
        </Link>
      </div>

      <div className="menuItem">
        <Link to="/budgets">
          <Icon icon="pie-chart" /> Budgets
        </Link>
      </div>

      <div className="menuItem">
        <Link to="/transactions">
          <Icon icon="th" /> Transactions
        </Link>
      </div>

      <div className="menuItem">
        <Link to="/goals">
          <Icon icon="locate" /> Goals
        </Link>
      </div>

      {!loading && (
        <>
          <div className="heading">
            <Icon icon="bank-account" /> Bank Accounts
          </div>

          <AccountList accounts={accountType(accounts, 'bank')} />

          <div className="heading">
            <Icon icon="credit-card" />
            Liabilities
          </div>

          <AccountList accounts={accountType(accounts, 'liabilities')} />
        </>
      )}
    </SidebarStyles>
  );
}

const BodyStyles = styled.div`
  background-color: ${({ theme }) => theme.appBgColor};
  padding: 0 20px;
`;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarDocked: mql.matches,
      sidebarOpen: false,
    };

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged);
  }

  onSetSidebarOpen(sidebarOpen) {
    console.log({ sidebarOpen });
    this.setState({ sidebarOpen });
  }

  mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
  }

  render() {
    return (
      <Context
        login={() => <Login />}
        router={() => (
          <BrowserRouter>
            <ToastContext>
              <AppStyles />
              <AppContext.Consumer>
                {({ theme }) => (
                  <AppContainer
                    theme={theme}
                    className={theme.name === 'dark' ? 'bp3-dark' : ''}
                  >
                    <Sidebar
                      open={this.state.sidebarOpen}
                      docked={this.state.sidebarDocked}
                      onSetOpen={this.onSetSidebarOpen}
                      sidebar={
                        <AppSidebar
                          onToggle={() => this.onSetSidebarOpen(false)}
                        />
                      }
                    >
                      <BodyStyles>
                        <Header
                          sidebarOpen={this.state.sidebarOpen}
                          onSetOpen={this.onSetSidebarOpen}
                        />
                        <Layout>
                          <Router />
                        </Layout>
                      </BodyStyles>
                    </Sidebar>
                  </AppContainer>
                )}
              </AppContext.Consumer>
            </ToastContext>
          </BrowserRouter>
        )}
      />
    );
  }
}
