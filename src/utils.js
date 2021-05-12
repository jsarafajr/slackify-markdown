module.exports = {
  wrap(string, ...wrappers) {
    return [
      ...wrappers,
      string,
      ...wrappers.reverse(),
    ].join('');
  },

  isURL(string) {
    try {
      return Boolean(new URL(string));
    } catch (error) {
      return false;
    }
  },
};
