const unified = require('unified');
const parse = require('remark-parse');
const slackify = require('./slackify');

const defaultOptions = {
  pedantic: true,
};

module.exports = (markdown, options) => {
  options = {
    ...defaultOptions,
    ...options,
  };

  return unified()
    .use(parse, options)
    .use(slackify)
    .processSync(markdown)
    .toString();
};
