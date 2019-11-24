import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import express from 'express';
import fs from 'fs';
import { applyMiddleware } from 'graphql-middleware';
import https from 'https';
import http from 'http';
import path from 'path';
import typeDefs from './schema';
import DataLoaders from './DataLoaders';
import Account from './db/Account';
import Reconciliation from './db/Reconciliation';
import Transaction from './db/Transaction';
import User from './db/User';
import conn from './db/conn';
import ProtectedDirective from './directives/ProtectedDirective';
import ValidationMiddleware from './middleware/ValidationMiddleware';
import * as resolvers from './resolvers';
import config from './config';

class Context {
  constructor(request) {
    const dbal = {
      accounts: new Account(conn),
      reconciliation: new Reconciliation(conn),
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

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    protected: ProtectedDirective,
  },
});
const schemaWithMiddleware = applyMiddleware(schema, ValidationMiddleware);

const apollo = new ApolloServer({
  schema: schemaWithMiddleware,
  context: ({ req }) => new Context(req),
});

const app = express();
apollo.applyMiddleware({ app });

if (config.environment === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

let server;
if (config.ssl) {
  server = https.createServer(
    {
      key: fs.readFileSync(config.ssl.key),
      cert: fs.readFileSync(config.ssl.cert),
    },
    app
  );
} else {
  server = http.createServer(app);
}

server.listen({ port: config.port }, () =>
  console.log(
    '🚀 Server ready at',
    `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${
      apollo.graphqlPath
    }`
  )
);
