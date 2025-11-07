import { remove } from 'unist-util-remove';
import { visit } from 'unist-util-visit';
import type { Root, Definition as MdastDefinition } from 'mdast';

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
