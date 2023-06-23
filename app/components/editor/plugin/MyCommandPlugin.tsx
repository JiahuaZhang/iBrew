import { $createCodeNode } from '@lexical/code';
import { INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { LexicalTypeaheadMenuPlugin, MenuRenderFn, TypeaheadOption, useBasicTypeaheadTriggerMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createHeadingNode, $createQuoteNode, type HeadingTagType } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $createParagraphNode, $getSelection, $isRangeSelection, ElementFormatType, FORMAT_ELEMENT_COMMAND, TextNode } from 'lexical';
import { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { BsChatLeftQuote, BsCode, BsTextParagraph } from 'react-icons/bs';
import { CiTextAlignCenter, CiTextAlignJustify, CiTextAlignLeft, CiTextAlignRight } from 'react-icons/ci';
import { GoListOrdered, GoListUnordered, GoTasklist } from 'react-icons/go';
import { IconType } from 'react-icons/lib';
import { LuHeading1, LuHeading2, LuHeading3, LuHeading4, LuHeading5, LuHeading6 } from 'react-icons/lu';
import { RxDividerHorizontal } from 'react-icons/rx';
import { ClientOnly } from "remix-utils";

class CommandOption extends TypeaheadOption {
  title: string;
  icon?: JSX.Element;
  keywords: string[];
  keyboardShortcut?: string;
  onSelect: (queryString: string) => void;

  constructor(
    title: string,
    options: {
      icon?: JSX.Element;
      keywords?: string[];
      keyboardShortcut?: string;
      onSelect: (queryString: string) => void;
    }
  ) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect;
  }
}

const CommandOptionItem = ({ index, isSelected, onClick, onMouseEnter, option }: { index: number, isSelected: boolean; onClick: () => void; onMouseEnter: () => void; option: CommandOption; }) => {
  return <li
    className={`${isSelected && 'bg-zinc-200'} p-1 inline-grid gap-1 items-center cursor-pointer w-[200px] grid-cols-[max-content_1fr]`}
    key={option.key}
    tabIndex={-1}
    ref={option.setRefElement}
    role='option'
    aria-selected={isSelected}
    id={`command-option-${index}`}
    onMouseEnter={onMouseEnter}
    onClick={onClick}
  >
    {option.icon}
    <span className='' >{option.title}</span>
  </li>;
};


export const MyCommandPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>('');

  const triggerMatch = useBasicTypeaheadTriggerMatch('/', {});

  const options = useMemo(() => {
    const baseOptions = [
      new CommandOption('Paragraph', {
        icon: <BsTextParagraph className='inline-block' />,
        keywords: ['normal', 'paragraph', 'p', 'text'],
        onSelect: () => editor.update(() => {
          console.log('on select paragraph');
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createParagraphNode());
          }
        })
      }),
      ...[LuHeading1, LuHeading2, LuHeading3, LuHeading4, LuHeading5, LuHeading6].map((Icon, heading) => new CommandOption(`Heading ${heading + 1}`, {
        icon: <Icon className='inline-block' />,
        keywords: ['heading', `heading${heading + 1}`, `h${heading + 1}`],
        onSelect: () => editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(`h${heading + 1}` as HeadingTagType));
          }
        })
      })),
      new CommandOption('Numbered List', {
        icon: <GoListOrdered className='inline-block' />,
        keywords: ['numbered list', 'ordered list', 'ol'],
        onSelect: () =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
      }),
      new CommandOption('Unordered List', {
        icon: <GoListUnordered className='inline-block' />,
        keywords: ['bulleted list', 'unordered list', 'ul'],
        onSelect: () =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
      }),
      new CommandOption('Check List', {
        icon: <GoTasklist className='inline-block' />,
        keywords: ['check list', 'todo list'],
        onSelect: () =>
          editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
      }),
      new CommandOption('Quote', {
        icon: <BsChatLeftQuote className='inline-block' />,
        keywords: ['block quote'],
        onSelect: () => editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode());
          }
        }),
      }),
      new CommandOption('Code', {
        icon: <BsCode className='inline-block' />,
        keywords: ['javascript', 'python', 'js', 'codeblock'],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
              if (selection.isCollapsed()) {
                $setBlocksType(selection, () => $createCodeNode());
              } else {
                const textContent = selection.getTextContent();
                const codeNode = $createCodeNode();
                selection.insertNodes([codeNode]);
                selection.insertRawText(textContent);
              }
            }
          }),
      }),
      new CommandOption('Divider', {
        icon: <RxDividerHorizontal className='inline-block' />,
        keywords: ['horizontal rule', 'divider', 'hr'],
        onSelect: () =>
          editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
      }),
      ...([['left', CiTextAlignLeft], ['center', CiTextAlignCenter], ['right', CiTextAlignRight], ['justify', CiTextAlignJustify]] as [ElementFormatType, IconType][]).map(([align, Icon]) => new CommandOption(align, {
        icon: <Icon className='inline-block' />,
        keywords: ['align', 'justify', align],
        onSelect: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align)
      }))
    ];


    return queryString ? baseOptions.filter(option => {
      const regexp = new RegExp(queryString, 'gi');
      return regexp.exec(option.title) || option.keywords.some(keyword => regexp.exec(keyword));
    }) : baseOptions;
  }, [editor, queryString]);

  const onSelectOption = useCallback((selectedOption: CommandOption,
    nodeToRemove: TextNode | null,
    closeMenu: () => void,
    matchingString: string,) => {
    editor.update(() => {
      nodeToRemove?.remove();
      selectedOption.onSelect(matchingString);
      closeMenu();
    });
  }, [editor]);

  const renderFn: MenuRenderFn<CommandOption> = (anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => {
    return anchorElementRef?.current && options.length ? createPortal(<div>
      <ul className='border-2 border-slate-200 rounded mt-[1.5rem] inline-block max-h-[200px] overflow-y-auto bg-white' >
        {options.map((option, index) => <CommandOptionItem
          key={option.key}
          index={index}
          isSelected={index === selectedIndex}
          onClick={() => {
            console.log('click !', option);
            setHighlightedIndex(index);
            selectOptionAndCleanUp(option);
          }}
          onMouseEnter={() => {
            console.log('mouse enter');
            setHighlightedIndex(index);
          }
          }
          option={option}
        />)}
      </ul>
    </div>, anchorElementRef.current) : null;
  };

  return <div>
    <ClientOnly>
      {
        () => <LexicalTypeaheadMenuPlugin<CommandOption>
          onQueryChange={setQueryString}
          onSelectOption={onSelectOption}
          triggerFn={triggerMatch}
          options={options}
          menuRenderFn={renderFn}
        />
      }
    </ClientOnly>
  </div>;
};