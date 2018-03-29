const { URL } = require('url');

module.exports = {
  isURL(string) {
    try {
      return Boolean(new URL(string));
    } catch (error) {
      return false;
    }
  },
};
