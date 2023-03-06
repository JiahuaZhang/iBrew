import { FieldTimeOutlined, PauseCircleFilled, PlayCircleFilled, UndoOutlined } from '@ant-design/icons';
import { signal } from '@preact/signals-react';
import { Alert, Tooltip } from 'antd';

const timerOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return;

  const input = event.target as HTMLInputElement;
  if (input.value === '') {
    input.value = 'ArrowUp' === event.key ? '1' : '60';
    return;
  };

  if (!/^\d+$/.test(input.value)) return;

  let number = Number(input.value);
  if (event.key === 'ArrowUp') {
    number += 1;
  }
  if (event.key === 'ArrowDown') {
    number -= 1;
  }

  if (number >= 0 && number <= 60) {
    event.preventDefault();
    input.value = `${number}`;
  }
};

const isPlaying = signal(false);
const isExpanded = signal(true);
const isMuted = signal(false);
const error = signal<{ message?: string, id?: NodeJS.Timeout; }>({});
const hint = signal<{ message?: string, ids?: NodeJS.Timeout[]; }>({});
const hour = signal(25);
const minute = signal(0);

const updateError = (message: string) => {
  if (error.value.id) clearTimeout(error.value.id);
  const id = setTimeout(() => error.value = ({ message: '', id: undefined }), 3000);

  error.value = ({ message, id });
};

export const Timer = () => {
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
            value={hour.value}
            className='border-blue-200 max-w-[2.25rem] focus-visible:outline-none text-right'
            onChange={event => {
              const input = event.target;

              if (/^\d+$/.test(input.value)) {
                const number = Number(input.value);

                if (number <= 60) return hour.value = number;

                updateError('Maximum m is 60');

                if (number <= 99) return hour.value = 60;

                hour.value = Number(number.toString().slice(0, 2));
              } else {
                if (input.value === '') return hour.value = 0;

                updateError('Please type number');
                const newNumber = input.value.replace(/[^0-9]/g, '').slice(0, 2);

                if (Number(newNumber) > 60) return hour.value = Number(newNumber.slice(0, 1));

                hour.value = Number(newNumber);
              }
            }}
            onKeyDown={timerOnKeyDown}
          />
          <span>
            <span className='text-sm text-gray-500' >m</span>
          </span>
        </span>

        <span
          className='border-[1px] border-blue-100 inline-grid h-[3rem] grid-flow-col items-center focus-within:border-blue-300 text-2xl pr-1 ml-[-1px] rounded-r'
        >
          <input
            value={minute.value}
            className='border-blue-200 max-w-[2.25rem] focus-visible:outline-none text-right'
            onChange={event => {
              const input = event.target;

              if (/^\d+$/.test(input.value)) {
                const number = Number(input.value);

                if (number <= 60) return minute.value = number;

                updateError('Maximum s is 60');

                if (number <= 99) return minute.value = 60;

                minute.value = Number(number.toString().slice(0, 2));
              } else {
                if (input.value === '') return minute.value = 0;

                updateError('Please type number');
                const newNumber = input.value.replace(/[^0-9]/g, '').slice(0, 2);

                if (Number(newNumber) > 60) return minute.value = Number(newNumber.slice(0, 1));

                minute.value = Number(newNumber);
              }
            }}
            onKeyDown={timerOnKeyDown}
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
          onClick={() => isPlaying.value = false}
          className='text-blue-400 cursor-pointer' />}
        {!isPlaying.value && <PlayCircleFilled
          onClick={() => isPlaying.value = true}
          className='text-blue-400 cursor-pointer' />}

        <Tooltip title='reset' >
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
              // todo, reset
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