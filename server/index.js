/* eslint consistent-return:0 import/order:0 */

const express = require('express');
const session = require('express-session');
const sessionKnex = require('connect-session-knex');

const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');

const logger = require('./logger');

const { applyMiddleware } = require('graphql-middleware');

const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const ValidationMiddleware = require('./middlewares/ValidationMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
const { resolve } = require('path');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');

const Context = require('./Context');

const conn = require('./db/conn');

// console.log(conn);

// console.log(knexFile);

const KnexSessionStore = sessionKnex(session);
const store = new KnexSessionStore({ knex: conn });

const app = express();

app.use(
  session({
    name: 'sid',
    secret: 'a strong ale',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
    store,
  }),
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
const schemaWithMiddleware = applyMiddleware(schema, ValidationMiddleware);

const server = new ApolloServer({
  schema: schemaWithMiddleware,
  context: ({ req, res }) => new Context(req, res),
});

server.applyMiddleware({ app });

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz'; // eslint-disable-line
  res.set('Content-Encoding', 'gzip');
  next();
});

// Start your app.
app.listen(port, host, async (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    let url;
    try {
      url = await ngrok.connect(port);
    } catch (e) {
      return logger.error(e);
    }
    logger.appStarted(port, prettyHost, url);
  } else {
    logger.appStarted(port, prettyHost);
  }
});
