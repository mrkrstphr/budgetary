const environment = process.env.NODE_ENV || 'production';

const configurations = require('../config.json');
export default configurations[environment];
