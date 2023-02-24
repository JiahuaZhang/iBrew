import { FieldTimeOutlined, HomeFilled, ToolOutlined } from '@ant-design/icons';
import { Link, useLoaderData } from '@remix-run/react';
import { Avatar, Button, Popover } from 'antd';
import { useState } from 'react';
import { LoginPanel } from '~/routes/(auth)/login';

const colors = ['bg-slate-400', 'bg-gray-400', 'bg-zinc-400', 'bg-neutral-400', 'bg-stone-400', 'bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-400', 'bg-emerald-400', 'bg-teal-400', 'bg-cyan-400', 'bg-sky-400', 'bg-blue-400', 'bg-indigo-400', 'bg-violet-400', 'bg-purple-400', 'bg-fuchsia-400', 'bg-pink-400', 'bg-rose-400'];

enum AvatarDisplay {
  img,
  initial
}

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

const UserSidebar = () => {
  const user = useLoaderData();
  const [avatarDisplay, setAvatarDisplay] = useState<AvatarDisplay>(AvatarDisplay.initial);
  // todo error message
  // @ts-ignore @temp
  const nameInitials = user?.displayName.split(' ').map(s => s[0].toUpperCase()).join('') ?? '';

  return <aside className='border-2 border-purple-200' >
    {
      user && <section className='cursor-pointer m-1 grid grid-flow-col justify-center align-center'
        onDoubleClick={() => {
          setAvatarDisplay(prev => ({
            [AvatarDisplay.img]: AvatarDisplay.initial,
            [AvatarDisplay.initial]: AvatarDisplay.img
          }[prev])
          );
        }}>
        <Popover content={<Button type='primary' className='bg-blue-500'  >
          <Link to='/logout'>Log out</Link>
        </Button>} >
          {avatarDisplay === AvatarDisplay.img &&
            <Avatar src={user.photos[0].value} size='large' />}
          {avatarDisplay === AvatarDisplay.initial &&
            <Avatar
              className={`${colors[nameInitials.charCodeAt(0) % colors.length]}`}
              size='large'
              shape='circle'
            >
              {nameInitials}
            </Avatar>
          }
        </Popover>
      </section>
    }
    {
      !user && <section className='grid m-2 gap-2' >
        <LoginPanel className='grid gap-2' />
      </section>
    }

    <Link to='/' className='grid m-4' >
      {/* todo, color filled should be changed base on whether at home page or not */}
      <HomeFilled className='text-sky-400 text-2xl' />
    </Link>

    <div>
      <header className='pl-2 bg-lime-100'>
        <ToolOutlined className='text-2xl' />
      </header>
      <section className='p-2 pl-4'>
        <FieldTimeOutlined className='text-2xl cursor-pointer' />
        {/* smart count down -- in time -- when minimize */}
        {/* could pause timer? one click to pause, one click to resume */}
        {/* when paused -- gray out color / border */}
        {/* could hide completely on background */}
        {/* music / sound set up? */}
        {/* double click to expand to setting? */}
        {/* when minimize, if in count down, there's progress bar style circle border */}

        <div>
          {/* add a little bit of animation */}
          {/* expaned timer */}

          {/* when disable, gray border */}
          timer

          <div>
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

                    // todo, if number > 60, add quick reminder

                    input.value = number.toString().slice(0, 2);
                  } else {
                    // todo, add reminder, only number are allowed
                    const newNumber = input.value.replace(/[^0-9]/g, '');
                    if (newNumber === '') return;

                    input.value = newNumber.toString().slice(0, 2);
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

                    // todo, if number > 60, add quick reminder

                    input.value = number.toString().slice(0, 2);
                  } else {
                    // todo, add reminder, only number are allowed
                    const newNumber = input.value.replace(/[^0-9]/g, '');
                    if (newNumber === '') return;

                    input.value = newNumber.toString().slice(0, 2);
                  }
                }}
                onKeyDown={timerOnKeyDown}
              />
              <span>
                <span className='text-sm text-gray-500' >s</span>
              </span>
            </span>

            {/* <Alert
              message="only number are allowed"
              type="warning"
              showIcon
              closable
              className='mt-1 p-0 text-xs'
            />

            <div className='border-2 border-purple-200'>
              error panel here
            </div> */}

          </div>

          {/* config, start/pause, reset, volume on/off panel */}
        </div>

      </section>
    </div>

  </aside >;
};

export default UserSidebar;