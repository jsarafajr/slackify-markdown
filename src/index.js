const gfm = require('remark-gfm');
const parse = require('remark-parse');
const stringify = require('remark-stringify');
const unified = require('unified');
const slackifyOptions = require('./slackify');

module.exports = (markdown, options) => unified()
  .use(parse, options)
  // Delete node is defined in GFM
  // https://github.com/syntax-tree/mdast/blob/main/readme.md#gfm
  .use(gfm)
  .use(stringify, slackifyOptions)
  .processSync(markdown)
  .toString();
