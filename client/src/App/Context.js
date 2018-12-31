import React from 'react';

export const AppContext = React.createContext();

class Context extends React.Component {
  state = { user: null, token: null };

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
          user: this.state.user,
        }}
      >
        {this.isAuthenticated() ? router() : login()}
      </AppContext.Provider>
    );
  }
}

export default Context;
