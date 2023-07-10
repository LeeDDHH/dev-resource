'use strict';

import React, { useMemo } from 'react';

import { TagsPage } from '@/components/screen/TagsPage';

const Tags = React.memo(({ tagCountList }: TagsProps) => {
  const renderView = useMemo(
    () => <TagsPage tagCountList={tagCountList} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return <div className='m-auto mb-32 mt-5 max-w-6xl'>{renderView}</div>;
});

if (process.env.NODE_ENV !== 'production') Tags.displayName = 'List';
export default Tags;

export const getStaticProps = async () => {
  const tagCountList = require('@/data/db_tagCount.json') as TagCountList;

  return {
    props: {
      tagCountList,
    },
  };
};
