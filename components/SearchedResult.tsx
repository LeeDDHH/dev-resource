'use strict';

import React from 'react';

import { useQuery } from '@apollo/client';

import {
  GetDataWithSearchTextQuery,
  GetDataWithSearchTextDocument,
  GetDataWithSearchTextQueryVariables,
  Item,
} from '@/graphql/generated';

import { filterItems } from '@/lib/generic';

import ItemListsView from './ItemListsView';

type Props = {
  searchText: string;
};

const SearchedResult = React.memo(({ searchText }: Props) => {
  const { data, loading, error } = useQuery<GetDataWithSearchTextQuery, GetDataWithSearchTextQueryVariables>(
    GetDataWithSearchTextDocument,
    {
      variables: { text: searchText },
    }
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
  return <ItemListsView items={items} />;
});

if (process.env.NODE_ENV !== 'production') SearchedResult.displayName = 'SearchedResult';
export default SearchedResult;
