'use strict';

import React, { ReactElement } from 'react';

import { LocalBookmarksProvider } from '@/hooks/useLocalBookmarks';

import Layout from '@/components/layout/Layout';
import { IndexPage } from '@/components/screen/IndexPage';

import type { NextPageWithLayout } from '@/pages/_app';

import { ResourceDataFromDB } from '@/types/data';
import { DefaultPageProps } from '@/types/getStaticProps';

// eslint-disable-next-line unused-imports/no-unused-vars
const Index: NextPageWithLayout<DefaultPageProps> = React.memo(() => {
  return <IndexPage />;
});

const getLayout = (page: ReactElement, { itemsAmount }: DefaultPageProps) => (
  <Layout itemsAmount={itemsAmount}>
    <LocalBookmarksProvider>{page}</LocalBookmarksProvider>
  </Layout>
);

Index.getLayout = getLayout;

if (process.env.NODE_ENV !== 'production') Index.displayName = 'Index';
export default Index;

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticProps = async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const itemsAmount = (require('@/data/db.json') as ResourceDataFromDB).resource.length;

  return {
    props: {
      itemsAmount,
    },
  };
};
