const { Compiler } = require('remark-stringify');
const isURL = require('is-url');
const { wrap } = require('./utils');

// fixes slack in-word formatting (e.g. hel*l*o)
const zeroWidthSpace = String.fromCharCode(0x200B);

const visitors = {
  heading(node) {
    // make headers to be just *strong*
    return wrap(this.content(node), '*');
  },

  strong(node) {
    return wrap(this.content(node), zeroWidthSpace, '*');
  },

  delete(node) {
    return wrap(this.content(node), zeroWidthSpace, '~');
  },

  emphasis(node) {
    return wrap(this.content(node), zeroWidthSpace, '_');
  },

  list(node) {
    const listItem = this.visitors.listItem.bind(this);

    return node.children.map((child, index) => {
      const bullet = node.ordered
        ? `${node.start + index}.`
        : '•';
      return listItem(child, node, index, bullet);
    }).join('\n');
  },

  code(node) {
    // delete language prefix for deprecated markdown formatters (old Bitbucket Editor)
    const content = node.value.replace(/^#![a-z]+\n/, ''); // ```\n#!javascript\ncode block\n```
    return wrap(content, '```', '\n');
  },

  link(node) {
    const text = node.title || this.content(node);
    return this.visitors.url.call(this, node, text);
  },

  image(node) {
    const text = node.title || node.alt;
    return this.visitors.url.call(this, node, text);
  },

  url(node, text) {
    const url = this.encode(node.url || '', node);
    if (!isURL(url)) return url;
    return text ? `<${url}|${text}>` : `<${url}>`;
  },
};

class SlackCompiler extends Compiler {
  constructor(...args) {
    super(...args);
    this.visitors = Object.assign(this.visitors, visitors);
    this.escape = this.slackEscape.bind(this);
  }

  slackEscape(value, node, parent) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  content(node) {
    return this.all(node).join('');
  }
}

module.exports = function slackify() {
  this.Compiler = SlackCompiler;
};
