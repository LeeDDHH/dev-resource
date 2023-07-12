'use strict';

import React, { useMemo } from 'react';

import { TagsPage } from '@/components/screen/TagsPage';
import type { NextPageWithLayout } from '@/pages/_app';

import { getLayout } from '@/lib/pages/defaultLayout';

const Tags: NextPageWithLayout<TagsProps> = React.memo(({ tagCountList }) => {
  const renderView = useMemo(
    () => <TagsPage tagCountList={tagCountList} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return <div className='m-auto mb-32 mt-5 max-w-6xl'>{renderView}</div>;
});

Tags.getLayout = getLayout;

if (process.env.NODE_ENV !== 'production') Tags.displayName = 'Tags';
export default Tags;

export const getStaticProps = async () => {
  const tagCountList = require('@/data/db_tagCount.json') as TagCountList;

  return {
    props: {
      tagCountList,
    },
  };
};
