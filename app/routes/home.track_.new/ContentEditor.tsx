import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { effect, signal } from '@preact/signals-react';

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
    LinkNode
  ],
  onError: console.error,
};

export const content = signal<Record<string, any>>({});

effect(() => {
  console.log(content.value);
});

export const ContentEditor = () => {
  return <LexicalComposer initialConfig={initialConfig}>
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
      <OnChangePlugin onChange={editorState => content.value = editorState.toJSON()} />
      <ListPlugin />
      <TabIndentationPlugin />
      <HistoryPlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
    </div>
  </LexicalComposer>;
};