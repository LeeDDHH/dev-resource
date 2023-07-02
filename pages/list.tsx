'use strict';

import React, { useMemo } from 'react';

import DefaultResult from '@/components/DefaultResult';
import Layout from '@/components/layout/Layout';

const List = React.memo(({ itemsAmount }: AppProps) => {
  const renderView = useMemo(() => <DefaultResult />, []);

  return (
    <Layout itemsAmount={itemsAmount}>
      <div className='m-auto mb-32 mt-5 max-w-6xl'>{renderView}</div>
    </Layout>
  );
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
