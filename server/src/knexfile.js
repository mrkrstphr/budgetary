import './config';

const {
  DATABASE_DEBUG,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASS,
} = process.env;

module.exports = {
  client: 'pg',
  debug: DATABASE_DEBUG === 'true',
  connection: {
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    user: DATABASE_USER,
    password: DATABASE_PASS,
    database: DATABASE_NAME,
  },
  migrations: {
    directory: './src/db/migrations',
  },
  seeds: {
    directory: './src/db/seeds',
  },
};

