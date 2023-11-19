'use strict';

import React from 'react';

import { useSearchKeyword } from '@/hooks/useSearchKeyword';

import { IntersectionObserverView } from '@/components/common/stateless/IntersectionObserver';
import ItemListsView from '@/components/parts/stateless/ItemListsView';

import { filterItems } from '@/lib/generic';

import { SingleData } from '@/types/data';

type Props = {
  searchText: string;
};

export const SearchedResult = React.memo(({ searchText }: Props) => {
  const { isLoading, error, data, fetchNextPage } = useSearchKeyword(searchText);

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

  const items = data && !!data.pages && filterItems<SingleData>(data.pages.flat());

  if (!items) return <p>表示する項目がありません</p>;
  return (
    <>
      <ItemListsView items={items} />
      {data && <IntersectionObserverView fetchMore={fetchMore} />}
    </>
  );
});

if (process.env.NODE_ENV !== 'production') SearchedResult.displayName = 'SearchedResult';
