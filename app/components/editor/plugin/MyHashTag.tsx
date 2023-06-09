import { $createHashtagNode, HashtagNode } from '@lexical/hashtag';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalTextEntity } from '@lexical/react/useLexicalTextEntity';
import { useCallback, useEffect } from 'react';

export const REGEX = /#[-\p{L}\p{N}_]+(?=[^\p{L}\p{N}_-]|$)/iu;

export const MyHashTagPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([HashtagNode])) {
      throw new Error('HashtagPlugin: HashtagNode not registered on editor');
    }
  }, [editor]);

  const createHashtagNode = useCallback((textNode: any) => $createHashtagNode(textNode.getTextContent()), []);

  const getHashtagMatch = useCallback((text: string) => {
    const matchArr = REGEX.exec(text);

    if (matchArr === null) {
      return null;
    }

    return {
      start: matchArr.index,
      end: matchArr.index + matchArr[0].length
    };
  }, []);

  useLexicalTextEntity(getHashtagMatch, HashtagNode, createHashtagNode);

  return null;
};