const { Compiler } = require('remark-stringify');
const { isURL } = require('./utils');

const visitors = {
  heading(node) {
    // make headers to be just *strong*
    return `*${this.content(node)}*`;
  },

  strong(node) {
    return `*${this.content(node)}*`;
  },

  delete(node) {
    return `~${this.content(node)}~`;
  },

  emphasis(node) {
    return `_${this.content(node)}_`;
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

  link(node) {
    const text = node.title || this.content(node);
    const url = this.encode(node.url || '', node);
    if (!isURL(url)) return url;
    return `<${url}|${text}>`;
  },

  image(node) {
    const text = node.title || node.alt;
    const url = this.encode(node.url || '', node);
    if (!isURL(url)) return url;
    return `<${url}|${text}>`;
  },

  code(node) {
    const fence = '```';
    return `${fence}\n${node.value}\n${fence}`;
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
