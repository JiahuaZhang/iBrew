import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { effect, signal } from '@preact/signals-react';
import { MyLinkPlugin } from '~/components/editor/plugin/MyLinkPlugin';
import { MyMarkdownShortcutPlugin } from '~/components/editor/plugin/MyMarkdownShortcutPlugin';
import { theme } from './PlaygroundEditorTheme';

// todo? image node? twitter nodes?
const initialConfig: InitialConfigType = {
  namespace: 'Track Content',
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    HashtagNode,
    HorizontalRuleNode
  ],
  onError: console.error,
  theme,
  // editable: false
};

export const content = signal<Record<string, any>>({});
// todo, debounce fn later on
effect(() => {
  // console.log(content.value);
});

export const ContentEditor = () => {
  return <LexicalComposer initialConfig={initialConfig} >
    <div className="relative m-4 rounded border-2 border-gray-200 text-xl">
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="min-h-[200px] p-2 focus-visible:outline-blue-200" />
        }
        placeholder={
          <div className="pointer-events-none absolute top-0 left-[10px] top-[6px] select-none text-gray-200">
            Enter some text...
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <AutoFocusPlugin />
      <OnChangePlugin onChange={editorState => content.value = editorState.toJSON()} />
      <ListPlugin />
      <CheckListPlugin />
      <TabIndentationPlugin />
      <HistoryPlugin />
      <MyLinkPlugin />
      <MyMarkdownShortcutPlugin />
    </div>
  </LexicalComposer>;
};