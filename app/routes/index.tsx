import { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => ({ title: '🏠' });

const Index = () => {
  return <main>main component</main>;
};

export default Index;