const visit = require('unist-util-visit');

module.exports = options => {
  const { emojis } = options;

  const visitor = node => {
    // eslint-disable-next-line no-param-reassign
    node.value = node.value.replace(/:[a-zA-Z0-9-_]*:/g, match => {
      if (emojis[match]) return emojis[match];
      return match;
    });
  };

  return tree => {
    visit(tree, 'text', visitor);
  };
};
