'use strict';

import React, { useMemo, ReactElement } from 'react';

import Layout from '@/components/layout/Layout';
import { TagsPage } from '@/components/screen/TagsPage';

import type { NextPageWithLayout } from '@/pages/_app';

// eslint-disable-next-line unused-imports/no-unused-vars
const Tags: NextPageWithLayout<TagsProps> = React.memo(({ itemsAmount, tagCountList }) => {
  const renderView = useMemo(
    () => <TagsPage tagCountList={tagCountList} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return <div className='m-auto mb-32 mt-5 max-w-6xl'>{renderView}</div>;
});

const getLayout = (page: ReactElement, { itemsAmount }: AppProps) => <Layout itemsAmount={itemsAmount}>{page}</Layout>;

Tags.getLayout = getLayout;

if (process.env.NODE_ENV !== 'production') Tags.displayName = 'Tags';
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
