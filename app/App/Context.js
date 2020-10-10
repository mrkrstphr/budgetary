import { Toaster } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import React from 'react';
import { ThemeProvider } from 'styled-components';

export const AppContext = React.createContext();

const themes = {
  light: {
    name: 'light',
    appBgColor: '#f9fafa',
    appFgColor: '#111',
    bodyBgColor: '#fff',
    textMutedColor: '#9f9a9c',
  },
  dark: { name: 'dark', appBgColor: '#2f404d' },
};

class Context extends React.Component {
  toaster = null;

  toasterRef = (ref) => {
    this.toaster = ref;
  };

  constructor(props) {
    super(props);
    this.state = { theme: 'light', user: this.props.me };
  }

  componentDidMount() {
    // const storedState = localStorage.getItem('appContext');
    // if (storedState) {
    //   this.setState(JSON.parse(storedState));
    // }
  }

  componentWillUnmount() {
    this.persist();
  }

  setUser = (user) => {
    this.setState({ user });
    this.persist();
  };

  toggleTheme = () =>
    this.setState((prevState) => ({
      theme: prevState.theme.name === 'dark' ? 'light' : 'dark',
    }));

  persist = () => {
    // localStorage.setItem('appContext', JSON.stringify(this.state));
  };

  notify = (message, intent = 'success') =>
    this.toaster.show({ message, intent });

  render() {
    const { children } = this.props;

    return (
      <AppContext.Provider
        value={{
          logout: this.logout,
          notify: this.notify,
          setUser: this.setUser,
          theme: this.state.theme,
          toggleTheme: this.toggleTheme,
          user: this.state.user,
        }}
      >
        <ThemeProvider theme={themes[this.state.theme]}>
          <>
            <Toaster ref={this.toasterRef} />
            {children}
          </>
        </ThemeProvider>
      </AppContext.Provider>
    );
  }
}

Context.propTypes = {
  children: PropTypes.element.isRequired,
  me: PropTypes.object,
};

export default Context;
