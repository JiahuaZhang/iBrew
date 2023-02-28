import { FieldTimeOutlined, PauseCircleFilled, PlayCircleFilled, UndoOutlined } from '@ant-design/icons';
import { Alert, Tooltip } from 'antd';
import { useState } from 'react';

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

export const Timer = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [error, setError] = useState<{ message?: string, id?: NodeJS.Timeout; }>({});
  const [hint, setHint] = useState<{ message?: string, ids?: NodeJS.Timeout[]; }>({});

  const updateError = (message: string) => {
    if (error.id) clearTimeout(error.id);
    const id = setTimeout(() => setError({ message: '', id: undefined }), 3000);

    setError({ message, id });
  };

  return <section className='p-2 pl-4'>
    <FieldTimeOutlined className='text-2xl cursor-pointer' />
    {/* smart count down -- in time -- when minimize */}
    {/* could pause timer? one click to pause, one click to resume */}
    {/* when paused -- gray out color / border */}
    {/* could hide completely on background */}
    {/* music / sound set up? */}
    {/* double click to expand to setting? */}
    {/* when minimize, if in count down, there's progress bar style circle border */}

    <div className='w-[10rem]'>
      {/* add a little bit of animation */}
      {/* expaned timer */}

      {/* when disable, gray border */}
      <span>Timer</span>

      <div className='w-[6.5rem] grid grid-flow-col m-auto'>
        <span
          className='border-[1px] border-blue-100 inline-grid h-[3rem] grid-flow-col items-center focus-within:border-blue-300 text-2xl pr-1 focus-within:z-2 focus-within:relative rounded-l'>
          <input
            defaultValue={25}
            className='border-blue-200 max-w-[2.25rem] focus-visible:outline-none text-right'
            onChange={event => {
              const input = event.target;

              if (/^\d+$/.test(input.value)) {
                const number = Number(input.value);

                if (number <= 60) return;

                updateError('Maximum m is 60');

                if (number <= 99) return input.value = '60';

                input.value = number.toString().slice(0, 2);
              } else {
                if (input.value === '') return;

                updateError('Please type number');
                const newNumber = input.value.replace(/[^0-9]/g, '').slice(0, 2);

                if (Number(newNumber) > 60) return input.value = newNumber.slice(0, 1);

                input.value = newNumber;
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
            defaultValue={0}
            className='border-blue-200 max-w-[2.25rem] focus-visible:outline-none text-right'
            onChange={event => {
              const input = event.target;

              if (/^\d+$/.test(input.value)) {
                const number = Number(input.value);

                if (number <= 60) return;

                updateError('Maximum s is 60');

                if (number <= 99) return input.value = '60';

                input.value = number.toString().slice(0, 2);
              } else {
                if (input.value === '') return;

                updateError('Please type number');
                const newNumber = input.value.replace(/[^0-9]/g, '').slice(0, 2);

                if (Number(newNumber) > 60) return input.value = newNumber.slice(0, 1);

                input.value = newNumber;
              }
            }}
            onKeyDown={timerOnKeyDown}
          />
          <span>
            <span className='text-sm text-gray-500' >s</span>
          </span>
        </span>
      </div>

      {error.message && <Alert
        message={error.message}
        type="warning"
        showIcon
        closable
        className='mt-[1px] p-0 text-xs'
      />}

      <div className='grid grid-flow-col items-center justify-between w-[6.5rem] m-auto'>
        {isPlaying && <PauseCircleFilled
          onClick={() => setIsPlaying(false)}
          className='text-blue-400 cursor-pointer' />}
        {!isPlaying && <PlayCircleFilled
          onClick={() => setIsPlaying(true)}
          className='text-blue-400 cursor-pointer' />}

        <Tooltip title='reset' >
          <UndoOutlined
            onClick={(event) => {
              if (event.detail === 1) {
                if (hint.message) return;

                const id1 = setTimeout(() => setHint({ message: 'Double click to reset' }), 500);
                const id2 = setTimeout(() => setHint({}), 3000);
                setHint({ ids: [id1, id2] });
              }
            }}
            onDoubleClick={() => {
              hint.ids?.forEach(clearTimeout);
              setHint({});
              // todo, reset
            }}
            className='text-blue-400 cursor-pointer select-none' />
        </Tooltip>
        {isMuted && <span
          onClick={() => setIsMuted(false)}
          className='cursor-pointer' >🔇</span>}
        {!isMuted && <span
          onClick={() => setIsMuted(true)}
          className='cursor-pointer'>🔊</span>}
      </div>
      <div>
        {hint.message && <Alert
          message={hint.message}
          type="warning"
          showIcon
          closable
          className='p-0 text-xs'
        />}
      </div>

    </div>
  </section>;
};