import { PlusOutlined } from '@ant-design/icons';
import { effect, signal } from '@preact/signals-react';
import { Input, InputRef, Tag, Tooltip, notification } from 'antd';
import { AiOutlineClose } from 'react-icons/ai';
import { ContentEditor } from './ContentEditor';

const tags = signal<string[]>([]);
const inputVisible = signal(false);
const inputValue = signal('');
const editInputIndex = signal(-1);
const editInputValue = signal('');
const inputRef = signal<InputRef | null>(null);
const editInputRef = signal<InputRef | null>(null);

const handleClose = (removedTag: string) => tags.value = tags.value.filter((tag) => tag !== removedTag);

const handleEditInputConfirm = () => {
  const existedTags = tags.value.filter((_, index) => index !== editInputIndex.value);
  if (existedTags.includes(editInputValue.value)) {
    notification.warning({ message: 'Tag already existed' });
  } else {
    const newTags = [...tags.value];
    newTags[editInputIndex.value] = editInputValue.value;
    tags.value = newTags;
  }

  editInputIndex.value = -1;
  inputValue.value = '';
};

const handleInputConfirm = () => {
  if (!inputValue.value) {
    // notification.warning({ message: 'Tag cannot be empty' });
  } else if (tags.value.includes(inputValue.value)) {
    notification.warning({ message: 'Tag already existed' });
  } else {
    tags.value = [...tags.value, inputValue.value];
  }

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
    <div className='pl-2 flex-wrap gap-y-2 inline-flex' >
      {tags.value.map((tag, index) => {
        if (editInputIndex.value === index) {
          return (
            <Input
              className='max-w-[100px] align-top text-xl py-1 px-2 mr-2'
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
            className='inline-flex items-center text-xl py-1 px-2 gap-2 border-2 border-slate-200 hover:border-blue-500'
            key={tag}
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
            <AiOutlineClose
              onClick={() => handleClose(tag)}
              className='cursor-pointer text-xs hover:text-red-400 text-gray-400' />
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
          className='max-w-[150px] align-top text-xl py-1 px-2'
          ref={r => inputRef.value = r}
          type="text"
          size="small"
          value={inputValue.value}
          onChange={e => inputValue.value = e.target.value}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag
          className='inline-flex items-center text-xl py-1 px-2 gap-2 cursor-pointer hover:border-2 hover:border-blue-500'
          onClick={() => inputVisible.value = true}>
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </div>
  );
};

// todo, sync up all state, include child part as well
export const TrackContent = () => {

  return <div className='border-0 border-gray-200 w-full' >
    <ContentEditor />
    <ContentTags />
    {/* todo: add button to svae, control / command + s to auto save */}
  </div>;
};