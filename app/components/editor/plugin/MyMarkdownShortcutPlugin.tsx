import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  ElementTransformer,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  TextMatchTransformer,
  Transformer
} from '@lexical/markdown';
import {
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
  HorizontalRuleNode,
} from '@lexical/react/LexicalHorizontalRuleNode';
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { $createTextNode, LexicalNode } from 'lexical';
import { emojiList } from '~/components/emoji/emojiList';

export const HR: ElementTransformer = {
  dependencies: [HorizontalRuleNode],
  export: (node: LexicalNode) => {
    return $isHorizontalRuleNode(node) ? '***' : null;
  },
  regExp: /^(---|\*\*\*|___)\s?$/,
  replace: (parentNode, _1, _2, isImport) => {
    const line = $createHorizontalRuleNode();

    // TODO: Get rid of isImport flag
    if (isImport || parentNode.getNextSibling() != null) {
      parentNode.replace(line);
    } else {
      parentNode.insertBefore(line);
    }

    line.selectNext();
  },
  type: 'element',
};

export const EMOJI: TextMatchTransformer = {
  dependencies: [],
  export: () => null,
  importRegExp: /:([a-z0-9_]+):/,
  regExp: /:([a-z0-9_]+):/,
  replace: (textNode, [, name]) => {
    const emoji = emojiList.find((e) => e.aliases.includes(name))?.emoji ||
      emojiList.find((e) => e.tags.includes(name))?.emoji;
    if (emoji) {
      textNode.replace($createTextNode(emoji));
    }
  },
  trigger: ':',
  type: 'text-match',
};

export const MARKDOWN_TRANSFORMERS: Transformer[] = [
  // TABLE ??
  HR,
  // todo [src](description) style link supports later
  // IMAGE,
  EMOJI,
  CHECK_LIST,
  ...ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
];


export const MyMarkdownShortcutPlugin = () => {
  return <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />;
};