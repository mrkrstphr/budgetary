import config from './config';

const defaults = {
  debug: false,
  host: 'localhost',
  port: 5432,
  user: '',
  password: '',
  database: 'finances',
};

const dbConfig = { ...defaults, ...config.db };

module.exports = {
  client: 'pg',
  debug: dbConfig.debug === 'true',
  connection: {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.name,
  },
  migrations: {
    directory: './src/db/migrations',
  },
  seeds: {
    directory: './src/db/seeds',
  },
};
