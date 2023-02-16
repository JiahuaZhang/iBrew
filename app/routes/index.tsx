import { MetaFunction } from '@remix-run/node';
import type { LoaderFunction } from 'react-router';
import UserSidebar from '~/components/UserSidebar';
import { authenticator } from '~/services/auth.server';

export const loader: LoaderFunction = ({ request }) => {
  return authenticator.isAuthenticated(request);
};

export const meta: MetaFunction = () => ({ title: '🏠' });

const Index = () => {
  return <div className='border-2 border-blue-200 w-full h-screen grid grid-cols-[max-content_1fr]'>
    <UserSidebar />
    <main>
      main component
    </main>
  </div>;
};

export default Index;