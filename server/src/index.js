import { ApolloServer } from 'apollo-server';
import schema from './schema';
import DataLoaders from './DataLoaders';
import Account from './db/Account';
import Transaction from './db/Transaction';
import conn from './db/conn';
import resolvers from './resolvers';

class Context {
  constructor(request) {
    const dbal = {
      accounts: new Account(conn),
      transactions: new Transaction(conn),
    };

    this.request = request;
    this.dataloaders = new DataLoaders(dbal);
    this.dbal = dbal;
  }
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: req => new Context(req),
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
