const config = {};

if (process.env.NODE_ENV === 'development') {
  config.ApiUrl = 'http://localhost:4000/graphql';
} else {
  config.ApiUrl = '/graphql';
}

export default config;
