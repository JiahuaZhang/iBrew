import type { LinksFunction, LoaderArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import { links as homeLinks } from '~/routes/home';
import styles from '~/styles/app.css';
import { GlobalCommandPalette, links as paletteLinks } from './components/Global/GlobalCommandPalette';
import { authenticator } from './services/auth.server';

export const links: LinksFunction = () => [
  ...homeLinks(),
  ...paletteLinks(),
  { rel: 'stylesheet', href: styles },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "iBrew",
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
