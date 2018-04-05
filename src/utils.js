const { URL } = require('url');

module.exports = {
  isURL(string) {
    try {
      return Boolean(new URL(string));
    } catch (error) {
      return false;
    }
  },

  wrap(string, ...wrappers) {
    return [
      ...wrappers,
      string,
      ...wrappers.reverse(),
    ].join('');
  },
};
