import type { LinksFunction, LoaderArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import { FacebookProfile, GoogleProfile } from 'remix-auth-socials';
import { links as homeLinks } from '~/routes/home';
import styles from '~/styles/app.css';
import { GlobalCommandPalette, links as paletteLinks } from './components/Global/GlobalCommandPalette';
import { authenticator } from './services/auth.server';
import { getUser } from './services/database/prisma.db.server';

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

export type GlobalUser = {
  profile: GoogleProfile | FacebookProfile;
  user: Awaited<ReturnType<typeof getUser>>;
};
export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const profile = await authenticator.isAuthenticated(request);

  if (profile) {
    const user = await getUser(profile.provider as any, profile.id);
    return { profile, user } as GlobalUser;
  }

  return null;
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
