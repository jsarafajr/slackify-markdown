import { unified } from 'unified';
import remarkParse from 'remark-parse';
import type { Options as RemarkParseOptions } from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkGfm from 'remark-gfm';

import {
  collectDefinitions,
  removeDefinitions,
  type DefinitionsMap,
} from './definitions.js';
import createSlackifyOptions from './slackify.js';

export interface SlackifyMarkdownOptions {
  parseOptions?: RemarkParseOptions;
}

export const slackifyMarkdown = (
  markdown: string,
  options?: SlackifyMarkdownOptions,
): string => {
  const definitions: DefinitionsMap = {};

  const slackifyOptions = createSlackifyOptions(definitions);

  return (
    unified()
      .use(remarkParse, options?.parseOptions)
      // Delete node is defined in GFM
      // https://github.com/syntax-tree/mdast/blob/main/readme.md#gfm
      .use(remarkGfm)
      .use(collectDefinitions, definitions)
      .use(removeDefinitions)
      .use(remarkStringify, slackifyOptions)
      .processSync(markdown)
      .toString()
  );
};
