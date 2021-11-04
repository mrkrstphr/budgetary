// const config = require('./config';

const defaults = {
  debug: false,
  host: 'localhost',
  port: 11432,
  user: 'finances',
  password: 'finances',
  name: 'finances2',
};

const dbConfig = { ...defaults /* ...config.db */ };

module.exports = {
  client: 'pg',
  debug: dbConfig.debug === true,
  connection: {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.name,
  },
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};
