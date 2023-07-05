'use strict';

import React from 'react';

import { addKeywordToUrlQuery } from '@/lib/updateQuery';

import Tag from './common/Tag';

type Props = {
  tagCountList: TagCountList;
};

const TagsList = React.memo(({ tagCountList }: Props) => {
  const Tags = tagCountList.map((tagCount: TagCount) => (
    <Tag
      key={`${tagCount.tag}-${tagCount.count}`}
      tag={tagCount.tag}
      count={tagCount.count}
      onClick={() => addKeywordToUrlQuery(tagCount.tag)}
    />
  ));
  return <div>{Tags}</div>;
});

if (process.env.NODE_ENV !== 'production') TagsList.displayName = 'TagsList';
export default TagsList;
