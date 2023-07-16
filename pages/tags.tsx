'use strict';

import React, { useMemo, ReactElement } from 'react';

import Layout from '@/components/layout/Layout';
import { TagsPage } from '@/components/screen/TagsPage';

import type { NextPageWithLayout } from '@/pages/_app';

import { ResourceDataFromDB } from '@/types/data';

// eslint-disable-next-line unused-imports/no-unused-vars
const Tags: NextPageWithLayout<TagsProps> = React.memo(({ tagCountList }: TagsProps) => {
  const renderView = useMemo(
    () => <TagsPage tagCountList={tagCountList} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return <div className='m-auto mb-32 mt-5 max-w-6xl'>{renderView}</div>;
});

const getLayout = (page: ReactElement, { itemsAmount }: AppProps) => <Layout itemsAmount={itemsAmount}>{page}</Layout>;

Tags.getLayout = getLayout;

if (process.env.NODE_ENV !== 'production') Tags.displayName = 'Tags';
export default Tags;

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticProps = async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const itemsAmount = (require('@/data/db.json') as ResourceDataFromDB).resource.length;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const tagCountList = require('@/data/db_tagCount.json') as TagCountList;

  return {
    props: {
      itemsAmount,
      tagCountList,
    },
  };
};
