import type { LinksFunction, LoaderArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import styles from '~/styles/app.css';
import { GlobalCommandPalette, links as paletteLinks } from './components/Global/GlobalCommandPalette';
import { links as timerLinks } from './components/Timer';
import { authenticator } from './services/auth.server';

export const links: LinksFunction = () => [
  ...timerLinks(),
  ...paletteLinks(),
  { rel: 'stylesheet', href: styles },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = ({ request }: LoaderArgs) => {
  return authenticator.isAuthenticated(request);
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <GlobalCommandPalette />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
