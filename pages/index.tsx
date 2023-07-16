'use strict';

import React, { ReactElement } from 'react';

import Layout from '@/components/layout/Layout';
import { IndexPage } from '@/components/screen/IndexPage';
import type { NextPageWithLayout } from '@/pages/_app';

import { LocalBookmarksProvider } from '@/hooks/useLocalBookmarks';

const Index: NextPageWithLayout<AppProps> = React.memo(({ itemsAmount }) => {
  return <IndexPage />;
});

const getLayout = (page: ReactElement, { itemsAmount }: AppProps) => (
  <Layout itemsAmount={itemsAmount}>
    <LocalBookmarksProvider>{page}</LocalBookmarksProvider>
  </Layout>
);

Index.getLayout = getLayout;

if (process.env.NODE_ENV !== 'production') Index.displayName = 'Index';
export default Index;

export const getStaticProps = async () => {
  const itemsAmount = (require('@/data/db.json').resource as Resource).length;

  return {
    props: {
      itemsAmount,
    },
  };
};
