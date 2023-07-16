'use strict';

import React, { useMemo, ReactElement } from 'react';

import { LocalBookmarksProvider } from '@/hooks/useLocalBookmarks';

import Layout from '@/components/layout/Layout';
import { ListPage } from '@/components/screen/ListPage';

import type { NextPageWithLayout } from '@/pages/_app';


// eslint-disable-next-line unused-imports/no-unused-vars
const List: NextPageWithLayout<AppProps> = React.memo(() => {
  return useMemo(() => <ListPage />, []);
});

const getLayout = (page: ReactElement, { itemsAmount }: AppProps) => (
  <Layout itemsAmount={itemsAmount}>
    <LocalBookmarksProvider>{page}</LocalBookmarksProvider>
  </Layout>
);

List.getLayout = getLayout;

if (process.env.NODE_ENV !== 'production') List.displayName = 'List';
export default List;

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticProps = async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const itemsAmount = (require('@/data/db.json') as ResourceDataFroDB).resource.length;

  return {
    props: {
      itemsAmount,
    },
  };
};
