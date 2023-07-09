'use strict';

import React from 'react';

import Layout from '@/components/layout/Layout';

import { IndexPage } from '@/components/screen/IndexPage';

const App = React.memo(({ itemsAmount }: AppProps) => {
  return (
    <Layout itemsAmount={itemsAmount}>
      <IndexPage />
    </Layout>
  );
});

if (process.env.NODE_ENV !== 'production') App.displayName = 'App';
export default App;

export const getStaticProps = async () => {
  const result = (require('@/data/db.json').resource as Resource).length;

  return {
    props: {
      itemsAmount: result,
    },
  };
};
