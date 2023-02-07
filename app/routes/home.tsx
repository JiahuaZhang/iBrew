import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from 'react-router';
import { authenticator } from '~/services/auth.server';

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request);

  return user;
};

export default function Home() {
  const user = useLoaderData();

  return (
    <div>
      {user && JSON.stringify(user)}
      {!user && 'You are not authenticated'}
    </div>
  );
}