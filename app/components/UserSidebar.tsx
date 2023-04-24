import { HomeFilled, ToolOutlined } from '@ant-design/icons';
import { Link, useLocation, useRouteLoaderData } from '@remix-run/react';
import { Avatar, Button, Popover } from 'antd';
import { useState } from 'react';
import { RiStickyNoteFill } from 'react-icons/ri';
import { LoginPanel } from '~/routes/(auth)/login';
import { NaturalSound } from './NaturalSound';
import { Timer } from './Timer';

const colors = ['bg-slate-400', 'bg-gray-400', 'bg-zinc-400', 'bg-neutral-400', 'bg-stone-400', 'bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-400', 'bg-emerald-400', 'bg-teal-400', 'bg-cyan-400', 'bg-sky-400', 'bg-blue-400', 'bg-indigo-400', 'bg-violet-400', 'bg-purple-400', 'bg-fuchsia-400', 'bg-pink-400', 'bg-rose-400'];

enum AvatarDisplay {
  img,
  initial
}

const UserSidebar = () => {
  const user = useRouteLoaderData('root') as any;
  const [avatarDisplay, setAvatarDisplay] = useState<AvatarDisplay>(AvatarDisplay.initial);
  // @ts-ignore @temp
  const nameInitials = user?.displayName.split(' ').map(s => s[0].toUpperCase()).join('') ?? '';
  const { pathname } = useLocation();

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

    <Link to='/home' className='grid m-4' >
      <HomeFilled className={`${pathname === '/home' && 'text-sky-400'} text-2xl`} />
    </Link>

    <div>
      <header className='pl-2 bg-lime-100'>
        <ToolOutlined className='text-2xl' />
      </header>
      <div className='p-2' >
        <Timer />
        <NaturalSound />
        <Link to='/home/note' className='inline-block' >
          <RiStickyNoteFill className={`${pathname === '/home/note' && 'text-sky-400'} text-5xl`} />
        </Link>
      </div>
    </div>

  </aside >;
};

export default UserSidebar;