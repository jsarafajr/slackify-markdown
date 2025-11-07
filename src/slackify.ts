import { defaultHandlers } from 'mdast-util-to-markdown';
import type { Options, Handlers, State, Info } from 'mdast-util-to-markdown';
import type {
  Heading,
  Strong,
  Delete,
  Emphasis,
  Link,
  LinkReference,
  Image,
  ImageReference,
  Text,
  Code,
  Parents,
  ListItem,
  Blockquote,
} from 'mdast';

import { wrap, isURL, isPotentiallyEncoded } from './utils.js';
import type { DefinitionsMap } from './plugins.js';

// fixes slack in-word formatting (e.g. hel*l*o)
const zeroWidthSpace = String.fromCharCode(0x200b);

const escapeSpecials = (text: string): string => {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/<([^@#]|$)/g, (_, m: string) => `&lt;${m}`)
    .replace(/^(.*)>/g, (_, m: string) => {
      const isEndOfMention = Boolean(m.match(/<[@#][A-Z0-9]+$/));
      if (isEndOfMention) {
        return `${m}>`;
      }
      return `${m}&gt;`;
    });
  return escaped;
};

/**
 * Creates custom `mdast-util-to-markdown` handlers that tailor the output for
 * Slack Markdown.
 *
 * @param definitions - Record of `Definition`s in the Markdown document, keyed by identifier.
 */
const createHandlers = (
  definitions: Readonly<DefinitionsMap>,
): Partial<Handlers> => ({
  heading: (
    node: Heading,
    _parent: Parents | undefined,
    state: State,
    info: Info,
  ): string => {
    // make headers to be just *strong*
    const marker = '*';

    const exit = state.enter('headingAtx');
    const value = state.containerPhrasing(node, info);
    exit();

    return wrap(value, marker);
  },

  blockquote: (
    node: Blockquote,
    _parent: Parents | undefined,
    state: State,
    info: Info,
  ): string => {
    const exit = state.enter('blockquote');
    const value = state.containerFlow(node, info);
    exit();

    const parts = value.split('\n\n').filter((part) => part.trim().length > 0);

    const formatted = parts
      .map((part) => {
        const lines = part.split('\n');
        return lines.map((line) => `> ${line}`).join('\n');
      })
      .join('\n\n');

    return formatted;
  },

  strong: (
    node: Strong,
    _parent: Parents | undefined,
    state: State,
    info: Info,
  ): string => {
    const marker = '*';

    const exit = state.enter('strong');
    const value = state.containerPhrasing(node, info);
    exit();

    return wrap(value, zeroWidthSpace, marker);
  },

  delete(
    node: Delete,
    _parent: Parents | undefined,
    state: State,
    info: Info,
  ): string {
    const marker = '~';

    const exit = state.enter('delete' as any);
    const value = state.containerPhrasing(node, info);
    exit();

    return wrap(value, zeroWidthSpace, marker);
  },

  emphasis: (
    node: Emphasis,
    _parent: Parents | undefined,
    state: State,
    info: Info,
  ): string => {
    const marker = '_';

    const exit = state.enter('emphasis');
    const value = state.containerPhrasing(node, info);
    exit();

    return wrap(value, zeroWidthSpace, marker);
  },

  listItem: (
    node: ListItem,
    parent: Parents | undefined,
    state: State,
    info: Info,
  ): string =>
    defaultHandlers.listItem(node, parent, state, info).replace(/^\*/, '•'),

  code(node: Code, _parent: Parents | undefined, state: State): string {
    const exit = state.enter('codeFenced');
    // delete language prefix for deprecated markdown formatters (old Bitbucket Editor)
    const content = node.value.replace(/^#![a-z]+\n/, ''); // ```\n#!javascript\ncode block\n```
    exit();

    return wrap(content, '```', '\n');
  },

  link: (
    node: Link,
    _parent: Parents | undefined,
    state: State,
    info: Info,
  ): string => {
    const exit = state.enter('link');
    const text = state.containerPhrasing(node, info) || node.title;
    const url = isPotentiallyEncoded(node.url) ? node.url : encodeURI(node.url);
    exit();

    if (!isURL(url)) return text || url;

    return text ? `<${url}|${text}>` : `<${url}>`;
  },

  linkReference: (
    node: LinkReference,
    _parent: Parents | undefined,
    state: State,
    info: Info,
  ): string => {
    const exit = state.enter('linkReference');
    const definition = definitions[node.identifier];
    const text =
      state.containerPhrasing(node, info) ||
      (definition ? definition.title : null);
    exit();

    if (!definition || !isURL(definition.url)) return text ?? '';

    return text ? `<${definition.url}|${text}>` : `<${definition.url}>`;
  },

  image: (node: Image, _parent: Parents | undefined, state: State): string => {
    const exit = state.enter('image');
    const text = node.alt || node.title;
    const url = encodeURI(node.url);
    exit();

    if (!isURL(url)) return text || url;

    return text ? `<${url}|${text}>` : `<${url}>`;
  },

  imageReference: (
    node: ImageReference,
    _parent: Parents | undefined,
    state: State,
  ): string => {
    const exit = state.enter('imageReference');
    const definition = definitions[node.identifier];
    const text = node.alt || (definition ? definition.title : null);
    exit();

    if (!definition || !isURL(definition.url)) return text ?? '';

    return text ? `<${definition.url}|${text}>` : `<${definition.url}>`;
  },

  text: (node: Text, _parent: Parents | undefined, state: State): string => {
    const exit = state.enter('text' as any);
    // https://api.slack.com/reference/surfaces/formatting#escaping
    const text = escapeSpecials(node.value);
    exit();

    // Do we need more escaping like the default handler uses?
    // https://github.com/syntax-tree/mdast-util-to-markdown/blob/main/lib/handle/text.js
    // https://github.com/syntax-tree/mdast-util-to-markdown/blob/main/lib/unsafe.js
    return text;
  },
});

/**
 * Creates options to be passed into a `remark-stringify` processor that tailor
 * the output for Slack Markdown.
 *
 * @param definitions - Record of `Definition`s in the Markdown document, keyed by identifier.
 */
const createOptions = (definitions: Readonly<DefinitionsMap>): Options => ({
  bullet: '*',
  listItemIndent: 'tab',
  handlers: createHandlers(definitions),
});

export default createOptions;
