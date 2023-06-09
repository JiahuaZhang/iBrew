import { $createHashtagNode, HashtagNode } from '@lexical/hashtag';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalTextEntity } from '@lexical/react/useLexicalTextEntity';
import { useCallback, useEffect } from 'react';

// const text = "Let's go #帅气+逼人, #拉风!";
// const hashtags = text.match(/#[-\p{L}\p{N}_]+(?=[^\p{L}\p{N}_-]|$)/gu);
// console.log(hashtags);  // ["#帅气-逼人", "#拉风"]

export const REGEX = /#[-\p{L}\p{N}_]+(?=[^\p{L}\p{N}_-]|$)/iu;

// todo, write test on the hashtag
// #apple => #apple
// #apple,banana => #apple
// #foo-bar => #foo-bar
// #foo-bar,#bar_baz => #foo-bar, #bar_baz
// #foo---bar => #foo---bar
// #- => #-

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