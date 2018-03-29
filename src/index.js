const unified = require('unified');
const parse = require('remark-parse');
const replaceEmoji = require('./replaceEmoji');
const slackify = require('./slackify');
const atlassianEmojis = require('./atlassianEmojis');

const defaultOptions = {
  pedantic: true,
  emojis: atlassianEmojis,
};

module.exports = (markdown, options) => {
  options = Object.assign({}, defaultOptions, options);

  return unified()
    .use(parse, options)
    .use(replaceEmoji, options)
    .use(slackify)
    .processSync(markdown)
    .toString();
};
