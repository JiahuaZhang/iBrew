import { LinksFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { links as timerLinks } from '~/components/Timer';
import UserSidebar from '~/components/UserSidebar';

export const links: LinksFunction = () => [
  ...timerLinks(),
];

const home = () => {
  return <div className='border-2 border-blue-200 w-full h-screen grid grid-cols-[max-content_1fr]'>
    <UserSidebar />
    <Outlet />
  </div>;
};

export default home;