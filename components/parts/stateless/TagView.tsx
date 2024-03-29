'use strict';

import React, { ComponentPropsWithoutRef } from 'react';

import { Tag } from '@/components/common/stateless/Tag';

import { addKeywordToUrlQuery } from '@/lib/updateQuery';

type Props = {
  tag: string[];
  itemId: number;
} & ComponentPropsWithoutRef<'div'>;

const TagView = React.memo(({ tag, itemId }: Props) => {
  return (
    <div>
      {tag &&
        tag.map((item) => <Tag key={`${itemId}-${item}`} tag={item} onClick={() => addKeywordToUrlQuery(item)} />)}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') TagView.displayName = 'TagView';
export default TagView;
