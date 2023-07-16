'use strict';

import React, { ReactElement } from 'react';

import { LocalBookmarksProvider } from '@/hooks/useLocalBookmarks';

import Layout from '@/components/layout/Layout';
import { BookmarksPage } from '@/components/screen/BookmarksPage';

import type { NextPageWithLayout } from '@/pages/_app';

import { ResourceDataFromDB } from '@/types/data';
import { DefaultPageProps } from '@/types/getStaticProps';

// eslint-disable-next-line unused-imports/no-unused-vars
const Bookmark: NextPageWithLayout<DefaultPageProps> = React.memo(() => {
  return <BookmarksPage />;
});

const getLayout = (page: ReactElement, { itemsAmount }: DefaultPageProps) => (
  <Layout itemsAmount={itemsAmount}>
    <LocalBookmarksProvider>{page}</LocalBookmarksProvider>
  </Layout>
);

Bookmark.getLayout = getLayout;

if (process.env.NODE_ENV !== 'production') Bookmark.displayName = 'Bookmark';
export default Bookmark;

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
