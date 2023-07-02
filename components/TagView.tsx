'use strict';

import React from 'react';

import { updateQuery } from '@/lib/updateQuery';

import styles from '@/styles/TagView.module.css';

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
          <div key={`${itemId}-${item}`} className={styles.tagBox} onClick={() => addKeywordToUrlQuery(item)}>
            {item}
          </div>
        ))}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') TagView.displayName = 'TagView';
export default TagView;
