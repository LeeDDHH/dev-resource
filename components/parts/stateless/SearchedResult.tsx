'use strict';

import React from 'react';

import { useQuery } from '@apollo/client';

import { IntersectionObserverView } from '@/components/common/stateless/IntersectionObserver';
import ItemListsView from '@/components/parts/stateless/ItemListsView';

import {
  GetDataWithSearchTextQuery,
  GetDataWithSearchTextDocument,
  GetDataWithSearchTextQueryVariables,
  Item,
} from '@/graphql/generated';

import { searchLimit } from '@/lib/Const';
import { filterItems } from '@/lib/generic';

type Props = {
  searchText: string;
};

export const SearchedResult = React.memo(({ searchText }: Props) => {
  const value = {
    variables: { text: searchText, offset: 0, limit: searchLimit } as GetDataWithSearchTextQueryVariables,
  };
  const { data, loading, error, fetchMore } = useQuery<GetDataWithSearchTextQuery, GetDataWithSearchTextQueryVariables>(
    GetDataWithSearchTextDocument,
    value,
  );

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

  const items = data && !!data.search && filterItems<Item | null>(data.search);

  if (!items) return <p>表示する項目がありません</p>;
  return (
    <>
      <ItemListsView items={items} />
      {data && (
        <IntersectionObserverView<(Item | null | undefined)[]>
          data={data.search ?? []}
          searchLimit={searchLimit}
          fetchMore={fetchMore}
        />
      )}
    </>
  );
});

if (process.env.NODE_ENV !== 'production') SearchedResult.displayName = 'SearchedResult';
