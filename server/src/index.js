import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import https from 'https';
import http from 'http';
import path from 'path';
import typeDefs from './schema';
import DataLoaders from './DataLoaders';
import Account from './db/Account';
import Transaction from './db/Transaction';
import User from './db/User';
import conn from './db/conn';
import ProtectedDirective from './directives/ProtectedDirective';
import resolvers from './resolvers';

const environment = process.env.NODE_ENV || 'production';

let configurations;
if (environment === 'development') {
  configurations = require('../../config.json');
} else {
  configurations = require('./config.json');
}

const config = configurations[environment];

class Context {
  constructor(request) {
    const dbal = {
      accounts: new Account(conn),
      transactions: new Transaction(conn),
      users: new User(conn),
    };
    this.request = request;
    this.dataloaders = new DataLoaders(dbal);
    this.dbal = dbal;
  }

  getUser = async () => {
    if ('authorization' in this.request.headers) {
      const token = await this.dbal.users.findTokenBy({
        token: this.request.headers.authorization.split(' ', 2)[1],
      });

      if (token) {
        // TODO: FIXME: Check token expiration
        return this.dbal.users.findUserByIds([token.user_id]);
      }
    }
  };
}

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    protected: ProtectedDirective,
  },
  context: ({ req }) => new Context(req),
});

const app = express();
apollo.applyMiddleware({ app });

if (environment === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

var server;
if (config.ssl) {
  server = https.createServer(
    {
      key: fs.readFileSync(`./ssl/${environment}/server.key`),
      cert: fs.readFileSync(`./ssl/${environment}/server.crt`),
    },
    app,
  );
} else {
  server = http.createServer(app);
}

server.listen({ port: config.port }, () =>
  console.log(
    '🚀 Server ready at',
    `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${
      apollo.graphqlPath
    }`,
  ),
);
