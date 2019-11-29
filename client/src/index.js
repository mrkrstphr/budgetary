import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { render } from 'react-dom';
import App from './App';
import config from './config';

const authorization = setContext(() => {
  const appContext = localStorage.getItem('appContext');

  if (appContext) {
    const context = JSON.parse(appContext);

    if (context.token.token) {
      return { headers: { Authorization: `Bearer ${context.token.token}` } };
    }
  }

  return {};
});

const baseUrl = createHttpLink({
  uri: config.ApiUrl,
  credentials: 'same-origin',
});

const authLink = ApolloLink.from([authorization, baseUrl]);

const client = new ApolloClient({
  link: authLink,
  cache: new InMemoryCache(),
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
