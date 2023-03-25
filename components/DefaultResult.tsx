'use strict';

import React from 'react';

import { useQuery } from '@apollo/client';

import { GetAllDataQuery, GetAllDataDocument, Item } from '@/graphql/generated';

import { filterItems } from '@/lib/generic';

import ItemListsView from './ItemListsView';

const DefaultResult = React.memo(() => {
  const { data, loading, error } = useQuery<GetAllDataQuery>(GetAllDataDocument);

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

  const items = data && !!data.items && filterItems<Item | null>(data.items);

  if (!items) return <p>表示する項目がありません</p>;
  return <ItemListsView items={items} />;
});

if (process.env.NODE_ENV !== 'production') DefaultResult.displayName = 'DefaultResult';
export default DefaultResult;
