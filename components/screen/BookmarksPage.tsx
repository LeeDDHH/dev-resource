'use strict';

// import { useQuery } from '@apollo/client';
import React from 'react';

import { useLocalBookmarks } from '@/hooks/useLocalBookmarks';
import { useSearchBookmark } from '@/hooks/useSearchBookmark';

import { IntersectionObserverView } from '@/components/common/stateless/IntersectionObserver';
import ItemListsView from '@/components/parts/stateless/ItemListsView';

import { filterItems } from '@/lib/generic';

import { SingleData } from '@/types/data';

export const BookmarksPage = React.memo(() => {
  const { bookmarks } = useLocalBookmarks();
  const { isLoading, error, data, fetchNextPage } = useSearchBookmark(bookmarks);

  const fetchMore = async (inView: boolean) => {
    if (inView) await fetchNextPage();
  };

  if (isLoading) {
    return (
      <h2>
        <div>Loading...</div>
      </h2>
    );
  }

  if (error) {
    console.error(error);
    return null;
  }

  const items = data && data.pages && filterItems<SingleData>(data.pages.flat());

  if (!items) return <p>表示する項目がありません</p>;
  if (!items.length) return <p>まだブックマークされたアイテムがありません</p>;
  return (
    <div className='m-auto mb-32 mt-5 max-w-6xl'>
      <ItemListsView items={items} />
      {data && <IntersectionObserverView fetchMore={fetchMore} />}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') BookmarksPage.displayName = 'BookmarksPage';
