import { PlusOutlined } from '@ant-design/icons';
import { effect, signal } from '@preact/signals-react';
import { Input, InputRef, Tag, Tooltip } from 'antd';
import { useEffect, useRef } from 'react';

const title = signal('');
const AutoResizingTextarea = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [title.value]);

  return (
    <textarea
      placeholder='Title'
      rows={1}
      ref={textareaRef}
      className="w-full text-4xl p-2 text-center overflow-hidden resize-none focus:border-2  focus:outline-none focus:border-blue-500 transition-all duration-200 ease-in-out placeholder:italic"
      value={title.value}
      onChange={(e) => title.value = e.target.value} />
  );
};

const tags = signal<string[]>(Array.from({ length: 30 }, (_, i) => `tag${i}`));
const inputVisible = signal(false);
const inputValue = signal('');
const editInputIndex = signal(-1);
const editInputValue = signal('');
const inputRef = signal<InputRef | null>(null);
const editInputRef = signal<InputRef | null>(null);

const handleClose = (removedTag: string) => tags.value = tags.value.filter((tag) => tag !== removedTag);

const handleEditInputConfirm = () => {
  const newTags = [...tags.value];
  newTags[editInputIndex.value] = editInputValue.value;
  tags.value = (newTags);
  editInputIndex.value = -1;
  inputValue.value = '';
};

const handleInputConfirm = () => {
  if (inputValue && tags.value.indexOf(inputValue.value) === -1) {
    tags.value = [...tags.value, inputValue.value];
  }
  // todo, if already existed, notionfication add
  inputVisible.value = false;
  inputValue.value = '';
};

effect(() => {
  if (inputVisible.value) {
    inputRef.value?.focus();
  }
});

effect(() => editInputRef.value?.focus());

const ContentTags = () => {
  return (
    <div className='flex-wrap gap-y-2 inline-flex' >
      {tags.value.map((tag, index) => {
        if (editInputIndex.value === index) {
          return (
            <Input
              className='w-[78px] align-top'
              ref={r => editInputRef.value = r}
              key={tag}
              size="small"
              value={editInputValue.value}
              onChange={e => editInputValue.value = e.target.value}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }
        const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag
            key={tag}
            closable={true}
            style={{ userSelect: 'none' }}
            onClose={() => handleClose(tag)}
          >
            <span
              onDoubleClick={(e) => {
                editInputIndex.value = index;
                editInputValue.value = tag;
                e.preventDefault();
              }}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}

      {inputVisible.value ? (
        <Input
          className='w-[78px] align-top'
          ref={r => inputRef.value = r}
          type="text"
          size="small"
          value={inputValue.value}
          onChange={e => inputValue.value = e.target.value}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag onClick={() => inputVisible.value = true}>
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </div>
  );
};


const content = signal({});
export const TrackContent = () => {

  return <div className='border-0 border-gray-200 w-full' >
    <AutoResizingTextarea />

    <section>
      Editor part
    </section>

    <ContentTags />

  </div>;
};