'use strict';

import React from 'react';

import { updateQuery } from '@/lib/updateQuery';

type Props = {
  tag: string[];
  itemId: number;
};

const TagView = React.memo(({ tag, itemId }: Props) => {
  const addKeywordToUrlQuery = (item: string) => {
    updateQuery({ url: '/', query: { keyword: item } });
  };

  return (
    <div>
      {tag &&
        tag.map((item) => (
          <div
            key={`${itemId}-${item}`}
            className='mr-1 mt-1 inline-block cursor-pointer
          rounded-md border-2 border-solid border-rod-red-500 bg-rod-yellow-400
          px-3 last:mr-0 hover:border-rod-gray-500 hover:bg-rod-red-500 hover:text-neutral-100'
            onClick={() => addKeywordToUrlQuery(item)}
          >
            {item}
          </div>
        ))}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') TagView.displayName = 'TagView';
export default TagView;
