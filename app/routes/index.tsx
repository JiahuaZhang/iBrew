import { MetaFunction } from '@remix-run/node';
import UserSidebar from '~/components/UserSidebar';

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