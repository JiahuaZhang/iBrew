import { FacebookFilled, GoogleOutlined } from '@ant-design/icons';
import { signal } from '@preact/signals-react';
import type { LinksFunction } from '@remix-run/node';
import { useRouteLoaderData, useSubmit } from '@remix-run/react';
import { useState } from 'react';
import CommandPalette, { JsonStructureItem, filterItems, renderJsonStructure, useHandleOpenCommandPalette } from 'react-cmdk';
import styles from 'react-cmdk/dist/cmdk.css';
import { AiFillHome } from 'react-icons/ai';
import { IoLogInOutline, IoLogOutOutline } from 'react-icons/io5';
import { RiStickyNoteFill } from 'react-icons/ri';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

enum CommandPalettePage {
  Page = 'page',
  Login = 'login'
}

const search = signal('');
const page = signal(CommandPalettePage.Page);

enum PageRequirement {
  authenticated = 'Authenticated',
  unauthenticated = 'Unauthenticated'
}

const pages: (JsonStructureItem & { required?: PageRequirement; })[] = [
  {
    children: 'Home',
    id: 'page.home',
    href: '/home',
    icon: AiFillHome,
  },
  {
    children: 'Login',
    id: 'page.login',
    icon: IoLogInOutline,
    closeOnSelect: false,
    onClick: () => {
      page.value = CommandPalettePage.Login;
      search.value = '';
    },
    required: PageRequirement.unauthenticated
  },
  {
    children: 'Logout',
    id: 'page.logout',
    href: '/logout',
    icon: IoLogOutOutline,
    required: PageRequirement.authenticated
  },
  {
    children: 'New',
    id: 'page.new',
    href: '/home/track/new',
    icon: () => <RiStickyNoteFill />,
    required: PageRequirement.authenticated
  }
];

const getPages = (requirement: PageRequirement) => pages.filter(p => (!p.required) || (p.required === requirement));

export const GlobalCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useRouteLoaderData('root');
  const allowedPages = getPages(user === null ? PageRequirement.unauthenticated : PageRequirement.authenticated);
  const submit = useSubmit();

  useHandleOpenCommandPalette(setIsOpen);

  const loginPages: JsonStructureItem[] = [
    {
      children: 'Login',
      id: 'page.login',
      href: '/login',
      icon: IoLogInOutline,
    },
    {
      children: 'google',
      id: 'page.login.google',
      href: '/auth/google',
      icon: () => <GoogleOutlined className='text-blue-500 ' />,
      onClick: () => submit(null, { method: 'post', action: '/auth/google' })
    },
    {
      children: 'facebook',
      id: 'page.login.facebook',
      href: '/auth/facebook',
      icon: () => <FacebookFilled className='text-blue-600' />,
      onClick: () => submit(null, { method: 'post', action: '/auth/facebook' })
    }
  ];

  const pageItems = filterItems([{ id: 'page', items: allowedPages }], search.value);
  const loginPageItems = filterItems([{ id: 'page.login', items: loginPages }], search.value);

  return <CommandPalette
    onChangeSearch={value => search.value = value}
    onChangeOpen={setIsOpen}
    search={search.value}
    isOpen={isOpen}
    page={page.value}
  >
    <CommandPalette.Page id={CommandPalettePage.Page}>
      {renderJsonStructure(pageItems)}
    </CommandPalette.Page>

    <CommandPalette.Page id={CommandPalettePage.Login} >
      {renderJsonStructure(loginPageItems)}
    </CommandPalette.Page>
  </CommandPalette >;
};