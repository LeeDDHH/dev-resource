'use strict';

import { useQuery } from '@apollo/client';
import React from 'react';

import { IntersectionObserverView } from '@/components/common/stateless/IntersectionObserver';
import ItemListsView from '@/components/parts/stateless/ItemListsView';

import {
  SearchWithOffsetAndLimitQuery,
  SearchWithOffsetAndLimitQueryVariables,
  SearchWithOffsetAndLimitDocument,
  Item,
} from '@/graphql/generated';

import { searchLimit } from '@/lib/Const';
import { filterItems } from '@/lib/generic';

export const ListPage = React.memo(() => {
  const { data, loading, error, fetchMore } = useQuery<
    SearchWithOffsetAndLimitQuery,
    SearchWithOffsetAndLimitQueryVariables
  >(SearchWithOffsetAndLimitDocument, {
    variables: { offset: 0, limit: searchLimit },
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

  const items = data && !!data.searchWithOffsetAndLimit && filterItems<Item | null>(data.searchWithOffsetAndLimit);

  if (!items) return <p>表示する項目がありません</p>;
  return (
    <div className='m-auto mb-32 mt-5 max-w-6xl'>
      <ItemListsView items={items} />
      {data && (
        <IntersectionObserverView<(Item | null | undefined)[]>
          data={data.searchWithOffsetAndLimit ?? []}
          searchLimit={searchLimit}
          fetchMore={fetchMore}
        />
      )}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') ListPage.displayName = 'ListPage';
