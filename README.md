# Slackify-Markdown

![Build Status](https://github.com/jsarafajr/slackify-markdown/workflows/Build%20CI/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/jsarafajr/slackify-markdown/branch/master/graph/badge.svg)](https://codecov.io/gh/jsarafajr/slackify-markdown) [![Known Vulnerabilities](https://snyk.io/test/github/jsarafajr/slackify-markdown/badge.svg)](https://snyk.io/test/github/jsarafajr/slackify-markdown)


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

### NodeJS version < 10

Use slackify-markdown v2 if you use nodejs version 9 and lower.

```bash
npm install slackify-markdown@2
```


[MIT Licence](LICENSE)
