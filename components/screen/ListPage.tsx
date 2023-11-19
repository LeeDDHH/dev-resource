'use strict';

import React from 'react';

import { useSearchList } from '@/hooks/useSearchList';

import { IntersectionObserverView } from '@/components/common/stateless/IntersectionObserver';
import ItemListsView from '@/components/parts/stateless/ItemListsView';

import { filterItems } from '@/lib/generic';

import { SingleData } from '@/types/data';

export const ListPage = React.memo(() => {
  const { isLoading, error, data, fetchNextPage } = useSearchList();
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
  return (
    <div className='m-auto mb-32 mt-5 max-w-6xl'>
      <ItemListsView items={items} />
      {data && <IntersectionObserverView fetchMore={fetchMore} />}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') ListPage.displayName = 'ListPage';
