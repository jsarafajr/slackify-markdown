# Slackify-Markdown

![Build Status](https://github.com/jsarafajr/slackify-markdown/workflows/Build%20CI/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/jsarafajr/slackify-markdown/branch/master/graph/badge.svg)](https://codecov.io/gh/jsarafajr/slackify-markdown) [![Known Vulnerabilities](https://snyk.io/test/github/jsarafajr/slackify-markdown/badge.svg)](https://snyk.io/test/github/jsarafajr/slackify-markdown)

Slackify-Markdown is a Markdown to [Slack-specific-markdown](https://api.slack.com/docs/message-formatting#message_formatting) converter, based on [Unified](https://github.com/unifiedjs/unified) and [Remark](https://github.com/remarkjs/remark/).

## Requirements

- Node.js 22 or higher
- ESM-only package (see [Usage](#usage) for details)

## Install

```bash
npm install slackify-markdown
```

## Usage

This package is [ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) only. For CommonJS, use v4.x version of the package.

```js
import slackifyMarkdown from 'slackify-markdown';

const markdown = `
# List of items

* item 1
* item 2
* item 3

[here is an example](https://example.com)
`;

const result = slackifyMarkdown(markdown);
console.log(result);
/*
 *List of items*

 • item 1
 • item 2
 • item 3

 <https://example.com|here is an example>
*/
```
