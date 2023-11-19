'use strict';

import React from 'react';

import { useLocalBookmarks } from '@/hooks/useLocalBookmarks';

import SingleItemView from '@/components/parts/stateless/SingleItemView';

import { SingleData } from '@/types/data';

type Props = { items: SingleData[] };

const ItemListsView = React.memo(({ items }: Props) => {
  const { bookmarks, handleBookmarks } = useLocalBookmarks();

  const generateItems = (items: SingleData[]) =>
    items.map((item) => (
      <SingleItemView
        key={item.id}
        item={item}
        isBookmarked={bookmarks.includes(item.id)}
        handleBookmarks={handleBookmarks}
      />
    ));
  return <ul className='mt-5 grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-5'>{generateItems(items)}</ul>;
});

if (process.env.NODE_ENV !== 'production') ItemListsView.displayName = 'ItemListsView';

export default ItemListsView;
