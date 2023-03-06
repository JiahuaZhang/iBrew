import { FieldTimeOutlined, PauseCircleFilled, PlayCircleFilled, UndoOutlined } from '@ant-design/icons';
import { signal, Signal } from '@preact/signals-react';
import { Alert, Tooltip } from 'antd';

const isPlaying = signal(false);
const isExpanded = signal(true);
const isMuted = signal(false);
const error = signal<{ message?: string, id?: NodeJS.Timeout; }>({});
const hint = signal<{ message?: string, ids?: NodeJS.Timeout[]; }>({});
const minute = signal(25);
const second = signal(0);
const cachedTime = signal({ minute: minute.value, second: second.value });
const timer = signal<NodeJS.Timeout | undefined>(undefined);

const updateCacheTime = () => {
  cachedTime.value = {
    minute: minute.value,
    second: second.value
  };
};

const timerOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, state: Signal<number>) => {
  if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return;

  const input = event.target as HTMLInputElement;
  if (input.value === '') {
    state.value = 'ArrowUp' === event.key ? 1 : 60;
    updateCacheTime();
    return;
  };

  let number = Number(input.value);
  if (event.key === 'ArrowUp') {
    number += 1;
  }
  if (event.key === 'ArrowDown') {
    number -= 1;
  }

  if (number >= 0 && number <= 60) {
    event.preventDefault();
    state.value = number;
    updateCacheTime();
  }
};

const updateError = (message: string) => {
  if (error.value.id) clearTimeout(error.value.id);
  const id = setTimeout(() => error.value = ({ message: '', id: undefined }), 3000);

  error.value = ({ message, id });
};

const countDown = () => {
  const id = setInterval(() => {
    if (minute.value === 0 && second.value === 0) {
      // todo, ring --
      isPlaying.value = false;
      return pause();
    }

    if (second.value > 0) {
      second.value = second.value - 1;
    } else {
      minute.value = minute.value - 1;
      second.value = 59;
    }
  }, 1000);

  timer.value = id;
};

const pause = () => {
  clearInterval(timer.value);
  timer.value = undefined;
};

export const Timer = () => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>, state: Signal<number>, errorMessage: string) => {
    const input = event.target;

    if (/^\d+$/.test(input.value)) {
      const number = Number(input.value);

      if (number <= 60) return state.value = number;

      updateError(errorMessage);

      if (number <= 99) return state.value = 60;
      state.value = Number(number.toString().slice(0, 2));
    } else {
      if (input.value === '') return state.value = 0;

      updateError('Please type number');

      const newNumber = input.value.replace(/[^0-9]/g, '').slice(0, 2);

      if (Number(newNumber) > 60) return state.value = Number(newNumber.slice(0, 1));
      state.value = Number(newNumber);
    }
  };

  return <section className='p-2 pl-4'>
    <FieldTimeOutlined
      onClick={() => isExpanded.value = !isExpanded.value}
      className='text-2xl cursor-pointer hover:text-blue-800' />
    {/* smart count down -- in time -- when minimize */}
    {/* could pause timer? one click to pause, one click to resume */}
    {/* when paused -- gray out color / border */}
    {/* could hide completely on background */}
    {/* music / sound set up? */}
    {/* double click to expand to setting? */}
    {/* when minimize, if in count down, there's progress bar style circle border */}

    <div className={`overflow-hidden transition-all ease-in-out duration-300 ${isExpanded.value ? 'w-[10rem]' : 'w-0 h-0 opacity-0'} `}
    >
      {/* when disable, gray border */}
      <span>Timer</span>

      <div className='w-[6.5rem] grid grid-flow-col m-auto'>
        <span
          className='border-[1px] border-blue-100 inline-grid h-[3rem] grid-flow-col items-center focus-within:border-blue-300 text-2xl pr-1 focus-within:z-2 focus-within:relative rounded-l'>
          <input
            disabled={isPlaying.value}
            value={minute.value}
            className='border-blue-200 max-w-[2.25rem] focus-visible:outline-none text-right'
            onChange={event => {
              onChange(event, minute, 'Maximum s is 60');
              updateCacheTime();
            }}
            onKeyDown={e => timerOnKeyDown(e, minute)}
          />
          <span>
            <span className='text-sm text-gray-500' >m</span>
          </span>
        </span>

        <span
          className='border-[1px] border-blue-100 inline-grid h-[3rem] grid-flow-col items-center focus-within:border-blue-300 text-2xl pr-1 ml-[-1px] rounded-r'
        >
          <input
            value={second.value}
            disabled={isPlaying.value}
            className='border-blue-200 max-w-[2.25rem] focus-visible:outline-none text-right'
            onChange={event => {
              onChange(event, minute, 'Maximum m is 60');
              updateCacheTime();
            }}
            onKeyDown={e => timerOnKeyDown(e, second)}
          />
          <span>
            <span className='text-sm text-gray-500' >s</span>
          </span>
        </span>
      </div>

      {error.value.message && <Alert
        message={error.value.message}
        type="warning"
        showIcon
        closable
        className='mt-[1px] p-0 text-xs'
      />}

      <div className='grid grid-flow-col items-center justify-between w-[6.5rem] m-auto'>
        {isPlaying.value && <PauseCircleFilled
          onClick={() => {
            pause();
            isPlaying.value = false;
          }}
          className='text-blue-400 cursor-pointer' />}
        {!isPlaying.value && <PlayCircleFilled
          onClick={() => {
            countDown();
            isPlaying.value = true;
          }}
          className='text-blue-400 cursor-pointer' />}

        <Tooltip title='reset' placement='bottom' >
          <UndoOutlined
            onClick={(event) => {
              if (event.detail === 1) {
                if (hint.value.message) return;

                const id1 = setTimeout(() => hint.value = ({ message: 'Double click to reset' }), 500);
                const id2 = setTimeout(() => hint.value = ({}), 3000);
                hint.value = ({ ids: [id1, id2] });
              }
            }}
            onDoubleClick={() => {
              hint.value.ids?.forEach(clearTimeout);
              hint.value = ({});
              minute.value = cachedTime.value.minute;
              second.value = cachedTime.value.second;
            }}
            className='text-blue-400 cursor-pointer select-none' />
        </Tooltip>
        {isMuted.value && <span
          onClick={() => isMuted.value = false}
          className='cursor-pointer' >🔇</span>}
        {!isMuted.value && <span
          onClick={() => isMuted.value = true}
          className='cursor-pointer'>🔊</span>}
      </div>
      <div>
        {hint.value.message && <Alert
          message={hint.value.message}
          type="warning"
          showIcon
          closable
          className='p-0 text-xs'
        />}
      </div>
    </div>
  </section>;
};