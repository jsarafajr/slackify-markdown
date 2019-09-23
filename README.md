# Slackify-Markdown

[![Build Status](https://travis-ci.org/jsarafajr/slackify-markdown.svg?branch=master)](https://travis-ci.org/jsarafajr/slackify-markdown)
[![codecov](https://codecov.io/gh/jsarafajr/slackify-markdown/branch/master/graph/badge.svg)](https://codecov.io/gh/jsarafajr/slackify-markdown) [![Greenkeeper badge](https://badges.greenkeeper.io/jsarafajr/slackify-markdown.svg)](https://greenkeeper.io/)

Slackify-Markdown is a Markdown to [Slack-specific-markdown](https://api.slack.com/docs/message-formatting#message_formatting) converter, based on [Unified](https://github.com/unifiedjs/unified) and [Remark](https://github.com/remarkjs/remark/).

## Install

```bash
npm install slackify-markdown
```

## Usage

```js
const slackifyMarkdown = require('slackify-markdown');
const markdown = `
# List of items

* item 1
* item 2
* item 3

[here is an example](https://example.com)
`;

slackifyMarkdown(markdown);
/*
 *List of items*

 • item 1
 • item 2
 • item 3

 <https://example.com|here is an example>
/*
```

### Copyright and License

Copyright Yevhenii Baraniuk, 2019

[MIT Licence](LICENSE)
