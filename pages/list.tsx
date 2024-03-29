'use strict';

import React, { useMemo, ReactElement } from 'react';

import Layout from '@/components/layout/Layout';
import { ListPage } from '@/components/screen/ListPage';

import type { NextPageWithLayout } from '@/pages/_app';

import { ResourceDataFromDB } from '@/types/data';
import { DefaultPageProps } from '@/types/getStaticProps';

// eslint-disable-next-line unused-imports/no-unused-vars
const List: NextPageWithLayout<DefaultPageProps> = React.memo(() => {
  return useMemo(() => <ListPage />, []);
});

const getLayout = (page: ReactElement, { itemsAmount }: DefaultPageProps) => (
  <Layout itemsAmount={itemsAmount}>{page}</Layout>
);

List.getLayout = getLayout;

if (process.env.NODE_ENV !== 'production') List.displayName = 'List';
export default List;

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
