import { remove } from 'unist-util-remove';
import { visit } from 'unist-util-visit';
import type { Root, Definition as MdastDefinition, Html } from 'mdast';

export interface Definition {
  title: string | null | undefined;
  url: string;
}

export type DefinitionsMap = Record<string, Definition>;

/**
 * Fills the provided record with `Definition`s contained in the mdast.
 * They are keyed by identifier for subsequent `Reference` lookups.
 */
export const collectDefinitions =
  (definitions: DefinitionsMap) =>
  (tree: Root): void => {
    visit(tree, 'definition', (node: MdastDefinition) => {
      definitions[node.identifier] = {
        title: node.title,
        url: node.url,
      };
    });
  };

/**
 * Removes `Definition`s and their parent `Paragraph`s from the mdast.
 * This avoids unwanted negative space in stringified output.
 */
export const removeDefinitions =
  () =>
  (tree: Root): Root | undefined => {
    return remove(tree, { cascade: true }, 'definition');
  };

/**
 * Removes HTML comments from the mdast tree.
 * This prevents HTML comments from appearing in Slack output where they
 * are not properly processed and cause rendering issues.
 */
export const removeHtmlComments =
  () =>
  (tree: Root): Root | undefined => {
    return remove(tree, (node): node is Html => {
      if (node.type !== 'html') {
        return false;
      }

      const htmlNode = node as Html;
      const trimmed = htmlNode.value.trim();
      return trimmed.startsWith('<!--') && trimmed.endsWith('-->');
    });
  };
