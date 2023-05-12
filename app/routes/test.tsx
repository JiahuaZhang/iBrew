import type { LoaderArgs, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { prisma } from '~/services/database/prisma.db.server';

export const loader: LoaderFunction = async ({ request, params }: LoaderArgs) => {
  const socialAccount = await prisma.socialUser.findFirst({
    where: {
      id: '5912409328795659',
      provider: 'facebook'
    }
  });

  return socialAccount;
};

export const test = () => {
  const dummy = useLoaderData();
  console.log({ dummy });

  return <div> test page </div>;
};

export default test;