'use strict';

import React, { useMemo, ReactElement } from 'react';

import Layout from '@/components/layout/Layout';
import { ListPage } from '@/components/screen/ListPage';
import type { NextPageWithLayout } from '@/pages/_app';

const List: NextPageWithLayout<AppProps> = React.memo(({ itemsAmount }) => {
  return useMemo(() => <ListPage />, []);
});

const getLayout = (page: ReactElement, { itemsAmount }: AppProps) => <Layout itemsAmount={itemsAmount}>{page}</Layout>;

List.getLayout = getLayout;

if (process.env.NODE_ENV !== 'production') List.displayName = 'List';
export default List;

export const getStaticProps = async () => {
  const itemsAmount = (require('@/data/db.json').resource as Resource).length;

  return {
    props: {
      itemsAmount,
    },
  };
};
