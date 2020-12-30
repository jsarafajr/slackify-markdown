const defaultHandlers = require('mdast-util-to-markdown/lib/handle');
const phrasing = require('mdast-util-to-markdown/lib/util/container-phrasing');

const { wrap, isURL } = require('./utils');

// fixes slack in-word formatting (e.g. hel*l*o)
const zeroWidthSpace = String.fromCharCode(0x200B);

/**
 * @type import('mdast-util-to-markdown').Handlers
 */
const handlers = {
  heading: (node, _parent, context) => {
    // make headers to be just *strong*
    const marker = '*';

    const exit = context.enter('heading');
    const value = phrasing(node, context, { before: marker, after: marker });
    exit();

    return wrap(value, marker);
  },

  strong: (node, _parent, context) => {
    const marker = '*';

    const exit = context.enter('strong');
    const value = phrasing(node, context, { before: marker, after: marker });
    exit();

    return wrap(value, zeroWidthSpace, marker);
  },

  delete(node, _parent, context) {
    const marker = '~';

    const exit = context.enter('delete');
    const value = phrasing(node, context, { before: marker, after: marker });
    exit();

    return wrap(value, zeroWidthSpace, marker);
  },

  emphasis: (node, _parent, context) => {
    const marker = '_';

    const exit = context.enter('emphasis');
    const value = phrasing(node, context, { before: marker, after: marker });
    exit();

    return wrap(value, zeroWidthSpace, marker);
  },

  listItem: (...args) => defaultHandlers
    .listItem(...args)
    .replace(/^\*/, '•'),

  code(node, _parent, context) {
    const exit = context.enter('code');
    // delete language prefix for deprecated markdown formatters (old Bitbucket Editor)
    const content = node.value.replace(/^#![a-z]+\n/, ''); // ```\n#!javascript\ncode block\n```
    exit();

    return wrap(content, '```', '\n');
  },

  link: (node, _parent, context) => {
    const exit = context.enter('link');
    const text = node.title
      || phrasing(node, context, { before: '|', after: '>' });
    const url = encodeURI(node.url);
    exit();

    if (!isURL(url)) return url;

    return text ? `<${url}|${text}>` : `<${url}>`;
  },

  image: (node, _parent, context) => {
    const exit = context.enter('image');
    const text = node.title || node.alt;
    const url = encodeURI(node.url);
    exit();

    if (!isURL(url)) return url;

    return text ? `<${url}|${text}>` : `<${url}>`;
  },

  text: (...args) => defaultHandlers
    .text(...args)
    // https://api.slack.com/reference/surfaces/formatting#escaping
    .replace(/\\&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;'),
};

/**
 * @type import('remark-stringify').RemarkStringifyOptions
 */
const options = {
  bullet: '*',
  handlers,
};

module.exports = options;
