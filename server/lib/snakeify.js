const { snakeCase, isObjectLike } = require('lodash');

module.exports = function snakeify(input) {
  if (!isObjectLike(input)) {
    return snakeCase(input);
  }

  if (Array.isArray(input)) {
    return input.map((row) => snakeify(row));
  }

  const data = {};

  Object.entries(input).forEach(([key, value]) => {
    data[snakeCase(key)] = value;
  });

  return data;
};
