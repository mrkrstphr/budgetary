import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from 'react-sidebar';
import styled from 'styled-components';
import AppStyles from 'component/AppStyles';
import Layout from 'App/component/Layout';
import Header from './component/Header';
import Login from './component/Login';
import Router from './Router';
import Context, { AppContext } from './Context';
import ToastContext from './../component/ToastContext';
import AppSidebar from './component/Sidebar';

const mql = window.matchMedia(`(min-width: 800px)`);

const AppContainer = styled.div`
  background-color: ${({ theme }) => theme.appBgColor};
`;

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

  componentDidMount() {
    mql.addListener(this.mediaQueryChanged);
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged);
  }

  onSetSidebarOpen(sidebarOpen) {
    this.setState({ sidebarOpen });
  }

  mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
  }

  render() {
    return (
      <Context
        login={() => (
          <ToastContext>
            <Login />
          </ToastContext>
        )}
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
                      shadow={false}
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
