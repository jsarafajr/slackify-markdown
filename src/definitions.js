const remove = require('unist-util-remove');
const visit = require('unist-util-visit');

/**
 * Fills the provided record with `Definition`s contained in the mdast.
 * They are keyed by identifier for subsequent `Reference` lookups.
 *
 * @param {Record<string, { title: null | string, url: string }>} definitions
 */
const collectDefinitions = definitions => tree => {
  visit(tree, 'definition', node => {
    definitions[node.identifier] = {
      title: node.title,
      url: node.url,
    };
  });
};

/**
 * Removes `Definition`s and their parent `Paragraph`s from the mdast.
 * This avoids unwanted negative space in stringified output.
 */
const removeDefinitions = () => tree => {
  remove(tree, { cascade: true }, 'definition');
};

module.exports = {
  collectDefinitions,
  removeDefinitions,
};
