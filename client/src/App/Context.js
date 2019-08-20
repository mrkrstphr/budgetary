import React from 'react';
import { ThemeProvider } from 'styled-components';

export const AppContext = React.createContext();

const themes = {
  light: { name: 'light', appBgColor: '#fff' },
  dark: { name: 'dark', appBgColor: '#2f404d' },
};

class Context extends React.Component {
  state = { theme: themes.light, token: null, user: null };

  componentDidMount() {
    const storedState = localStorage.getItem('appContext');
    if (storedState) {
      this.setState(JSON.parse(storedState));
    }
  }

  componentWillUnmount() {
    this.persist();
  }

  isAuthenticated = () => {
    return this.state.user !== null; // TODO: Check token expiration
  };

  logout = () => {
    localStorage.removeItem('appContext');
    this.setState({ user: null, token: null });
  };

  setToken = ({ user, ...token }) => {
    this.setState({ user, token });
    this.persist();
  };

  toggleTheme = () =>
    this.setState({
      theme: this.state.theme.name === 'dark' ? themes.light : themes.dark,
    });

  persist = () => {
    localStorage.setItem('appContext', JSON.stringify(this.state));
  };

  render() {
    const { login, router } = this.props;

    return (
      <AppContext.Provider
        value={{
          isAuthenticated: this.isAuthenticated,
          logout: this.logout,
          setToken: this.setToken,
          theme: this.state.theme,
          toggleTheme: this.toggleTheme,
          user: this.state.user,
        }}
      >
        <ThemeProvider theme={this.state.theme}>
          {this.isAuthenticated() ? router() : login()}
        </ThemeProvider>
      </AppContext.Provider>
    );
  }
}

export default Context;
