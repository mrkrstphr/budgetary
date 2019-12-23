// import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter } from 'react-router-dom';
// import App from 'containers/App';

// // Create redux store with history
// const root = document.getElementById('app');

// const render = () => {
//   ReactDOM.render(
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>,
//     root,
//   );
// };

// if (module.hot) {
//   // Hot reloadable React components and translation json files
//   // modules.hot.accept does not accept dynamic dependencies,
//   // have to be constants at compile-time
//   module.hot.accept(['containers/App'], () => {
//     ReactDOM.unmountComponentAtNode(root);
//     render();
//   });
// }

// render();

import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import 'regenerator-runtime/runtime';
import { render } from 'react-dom';
import App from './App';

// const appContext = localStorage.getItem('appContext');

// if (appContext) {
//   const context = JSON.parse(appContext);

//   if (context && context.token && context.token.token) {
//     return { headers: { Authorization: `Bearer ${context.token.token}` } };
//   }
// }
const authorization = setContext(() => ({}));

const baseUrl = createHttpLink({
  uri: '/graphql',
  credentials: 'same-origin',
});

const authLink = ApolloLink.from([authorization, baseUrl]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  credentials: 'include',
  link: authLink,
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('app'),
);
