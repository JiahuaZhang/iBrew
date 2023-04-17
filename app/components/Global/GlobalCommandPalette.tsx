import { signal } from '@preact/signals-react';
import type { LinksFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import CommandPalette, { JsonStructureItem, filterItems, renderJsonStructure, useHandleOpenCommandPalette } from 'react-cmdk';
import styles from 'react-cmdk/dist/cmdk.css';
import { IoLogInOutline, IoLogOutOutline } from 'react-icons/io5';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

enum CommandPalettePage {
  Page = 'page',
}

const pages: JsonStructureItem[] = [
  {
    children: 'Login',
    id: 'page.login',
    href: '/login',
    icon: IoLogInOutline
  },
  {
    children: 'Logout',
    id: 'page.logout',
    href: '/logout',
    icon: IoLogOutOutline
  }
];

const search = signal('');
const page = signal(CommandPalettePage.Page);

export const GlobalCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useLoaderData();
  const skipRoutes = user === null ? '/logout' : '/login';
  const allowedPages = pages.filter(({ href }) => href !== skipRoutes);

  useHandleOpenCommandPalette(setIsOpen);

  const pageItems = filterItems([{
    id: 'page',
    items: allowedPages
  }], search.value);

  return <CommandPalette
    onChangeSearch={value => search.value = value}
    onChangeOpen={setIsOpen}
    search={search.value}
    isOpen={isOpen}
    page={page.value}
  >
    <CommandPalette.Page
      id={CommandPalettePage.Page}
    >
      {renderJsonStructure(pageItems)}
    </CommandPalette.Page>
  </CommandPalette >;
};