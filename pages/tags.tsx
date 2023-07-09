'use strict';

import React, { useMemo } from 'react';

import Layout from '@/components/layout/Layout';
import { TagsPage } from '@/components/screen/TagsPage';

const Tags = React.memo(({ itemsAmount, tagCountList }: TagsProps) => {
  const renderView = useMemo(
    () => <TagsPage tagCountList={tagCountList} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Layout itemsAmount={itemsAmount}>
      <div className='m-auto mb-32 mt-5 max-w-6xl'>{renderView}</div>
    </Layout>
  );
});

if (process.env.NODE_ENV !== 'production') Tags.displayName = 'List';
export default Tags;

export const getStaticProps = async () => {
  const itemsAmount = (require('@/data/db.json').resource as Resource).length;
  const tagCountList = require('@/data/db_tagCount.json') as TagCountList;

  return {
    props: {
      itemsAmount,
      tagCountList,
    },
  };
};
