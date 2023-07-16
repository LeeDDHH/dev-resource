'use strict';

import { useQuery } from '@apollo/client';
import React from 'react';


import { useBookmarks } from '@/hooks/useLocalBookmarks';

import { IntersectionObserverView } from '@/components/common/stateless/IntersectionObserver';
import ItemListsView from '@/components/parts/stateless/ItemListsView';

import {
  BookmarkWithOffsetAndLimitQuery,
  BookmarkWithOffsetAndLimitQueryVariables,
  BookmarkWithOffsetAndLimitDocument,
  Item,
} from '@/graphql/generated';

import { searchLimit } from '@/lib/Const';
import { filterItems } from '@/lib/generic';


export const BookmarksPage = React.memo(() => {
  const { bookmarks } = useBookmarks();
  const { data, loading, error, fetchMore } = useQuery<
    BookmarkWithOffsetAndLimitQuery,
    BookmarkWithOffsetAndLimitQueryVariables
  >(BookmarkWithOffsetAndLimitDocument, {
    variables: { bookmarkList: bookmarks, offset: 0, limit: searchLimit },
  });

  if (loading) {
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

  const items = data && !!data.bookmarkWithOffsetAndLimit && filterItems<Item | null>(data.bookmarkWithOffsetAndLimit);

  if (!items) return <p>表示する項目がありません</p>;
  if (!items.length) return <p>まだブックマークされたアイテムがありません</p>;
  return (
    <div className='m-auto mb-32 mt-5 max-w-6xl'>
      <ItemListsView items={items} />
      {data && (
        <IntersectionObserverView<(Item | null | undefined)[]>
          data={data.bookmarkWithOffsetAndLimit ?? []}
          searchLimit={searchLimit}
          fetchMore={fetchMore}
        />
      )}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') BookmarksPage.displayName = 'BookmarksPage';
