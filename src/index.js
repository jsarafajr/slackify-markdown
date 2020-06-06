const unified = require('unified');
const parse = require('remark-parse');
const slackify = require('./slackify');

module.exports = (markdown, options) => unified()
  .use(parse, options)
  .use(slackify)
  .processSync(markdown)
  .toString();
