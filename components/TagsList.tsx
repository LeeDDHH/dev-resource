'use strict';

import React from 'react';

import { addKeywordToUrlQuery } from '@/lib/updateQuery';

import { Tag } from './common/Tag';

type Props = {
  tagCountList: TagCountList;
};

type CountDistinction = {
  countRange: (tag: TagCount) => TagCount | undefined;
  title: string;
};

const countDistinctions: CountDistinction[] = [
  {
    countRange: (tag: TagCount) => {
      if (tag.count >= 100) return tag;
    },
    title: '100件以上',
  },
  {
    countRange: (tag: TagCount) => {
      if (tag.count < 100 && tag.count >= 50) return tag;
    },
    title: '50件以上',
  },
  {
    countRange: (tag: TagCount) => {
      if (tag.count < 50 && tag.count >= 10) return tag;
    },
    title: '10件以上',
  },
  {
    countRange: (tag: TagCount) => {
      if (tag.count < 10) return tag;
    },
    title: '新規キーワード',
  },
];

const TagsList = React.memo(({ tagCountList }: Props) => {
  const sortTagsByCountedElements = countDistinctions.map((countObj: CountDistinction) => {
    return tagCountList
      .map(countObj.countRange)
      .filter((tag): tag is TagCount => typeof tag == 'object')
      .map((tagCount: TagCount) => (
        <Tag
          key={`${tagCount.tag}-${tagCount.count}`}
          tag={tagCount.tag}
          count={tagCount.count}
          onClick={() => addKeywordToUrlQuery(tagCount.tag)}
        />
      ));
  });
  const TagCategoriesBySorted = sortTagsByCountedElements.map((categoryElement: React.JSX.Element[], i: number) => {
    return (
      <div className='mb-10' key={countDistinctions[i].title}>
        <div className='text-4xl'>{countDistinctions[i].title}</div>
        <hr className='my-2 border border-solid' />
        {categoryElement}
      </div>
    );
  });
  return <div className='mx-3'>{TagCategoriesBySorted}</div>;
});

if (process.env.NODE_ENV !== 'production') TagsList.displayName = 'TagsList';
export default TagsList;
