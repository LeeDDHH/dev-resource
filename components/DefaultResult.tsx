'use strict';

import React from 'react';

import { useQuery } from '@apollo/client';

import { SearchWithOffsetAndLimitQuery, SearchWithOffsetAndLimitQueryVariables, Item } from '@/graphql/generated';

import { SEARCH_WITH_OFFSET_AND_LIMIT } from '@/lib/clientQuery';
import { searchLimit } from '@/lib/Const';
import { filterItems } from '@/lib/generic';

import { IntersectionObserverView } from './IntersectionObserver';
import ItemListsView from './ItemListsView';

const DefaultResult = React.memo(() => {
  const { data, loading, error, fetchMore } = useQuery<SearchWithOffsetAndLimitQuery>(SEARCH_WITH_OFFSET_AND_LIMIT, {
    variables: { offset: 0, limit: searchLimit } as SearchWithOffsetAndLimitQueryVariables,
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
    <>
      <ItemListsView items={items} />
      {data && (
        <IntersectionObserverView<(Item | null | undefined)[]>
          data={data.searchWithOffsetAndLimit ?? []}
          searchLimit={searchLimit}
          fetchMore={fetchMore}
        />
      )}
    </>
  );
});

if (process.env.NODE_ENV !== 'production') DefaultResult.displayName = 'DefaultResult';
export default DefaultResult;
