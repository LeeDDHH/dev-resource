'use strict';

import React, { ReactElement } from 'react';

import Layout from '@/components/layout/Layout';
import { BookmarksPage } from '@/components/screen/BookmarksPage';

import type { NextPageWithLayout } from '@/pages/_app';

import { LocalBookmarksProvider } from '@/hooks/useLocalBookmarks';

// eslint-disable-next-line unused-imports/no-unused-vars
const Bookmark: NextPageWithLayout<AppProps> = React.memo(({ itemsAmount }) => {
  return <BookmarksPage />;
});

const getLayout = (page: ReactElement, { itemsAmount }: AppProps) => (
  <Layout itemsAmount={itemsAmount}>
    <LocalBookmarksProvider>{page}</LocalBookmarksProvider>
  </Layout>
);

Bookmark.getLayout = getLayout;

if (process.env.NODE_ENV !== 'production') Bookmark.displayName = 'Bookmark';
export default Bookmark;

export const getStaticProps = async () => {
  const itemsAmount = (require('@/data/db.json').resource as Resource).length;

  return {
    props: {
      itemsAmount,
    },
  };
};
