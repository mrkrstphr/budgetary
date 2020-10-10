/**
 * Accepts an array or a promise that resolves to an array and
 * returns the first element of that array. Returns null if
 * passed anything but an array or an empty array.
 *
 * @param {Array|Promise} data
 * @return {Array|Object}
 */
module.exports = function pickFirst(data) {
  return Promise.resolve(data).then((results) => {
    if (Array.isArray(results) && results.length > 0) {
      return results[0];
    }

    return null;
  });
};
