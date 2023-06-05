import { V2_MetaFunction } from '@remix-run/react';

export const meta: V2_MetaFunction = () => [{ title: '🏠' }];

const Index = () => {
  return <main>Route component</main>;
};

export default Index;