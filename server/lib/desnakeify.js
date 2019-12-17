const { camelCase, isObjectLike } = require('lodash');

function convertObject(object) {
  if (!isObjectLike(object) || Array.isArray(object)) {
    return object;
  }

  // do not mess with things like Date objects
  if (
    isObjectLike(object) &&
    object.constructor &&
    object.constructor.name !== 'Object'
  ) {
    return object;
  }

  const data = {};

  Object.entries(object).forEach(([key, value]) => {
    data[camelCase(key)] = isObjectLike(value) ? convertObject(value) : value;
  });

  return data;
}

/**
 * Accepts an object or array of objects, or a promise that resolves
 * to an object or array of objects, and returns a promise that
 * resolves to that data with each key of the object or objects in
 * snakeCase format.
 *
 * @param {Array|Object} input
 * @return {Array|Object}
 */
module.exports = function desnakeify(input) {
  return Promise.resolve(input).then(resolved => {
    if (Array.isArray(resolved)) {
      return resolved.map(convertObject);
    }

    return convertObject(resolved);
  });
};
