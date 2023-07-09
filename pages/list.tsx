'use strict';

import React, { useMemo } from 'react';

import { ListPage } from '@/components/screen/ListPage';
import Layout from '@/components/layout/Layout';

const List = React.memo(({ itemsAmount }: AppProps) => {
  const renderView = useMemo(() => <ListPage />, []);

  return <Layout itemsAmount={itemsAmount}>{renderView}</Layout>;
});

if (process.env.NODE_ENV !== 'production') List.displayName = 'List';
export default List;

export const getStaticProps = async () => {
  const result = (require('@/data/db.json').resource as Resource).length;

  return {
    props: {
      itemsAmount: result,
    },
  };
};
