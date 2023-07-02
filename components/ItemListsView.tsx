'use strict';

import React from 'react';

import SingleItemView from '@/components/SingleItemView';

import { Item } from '@/graphql/generated';

import styles from '@/styles/ItemListsView.module.css';

type Props = { items: Item[] };

const ItemListsView = React.memo(({ items }: Props) => {
  const generateItems = (items: Item[]) => items.map((item) => <SingleItemView key={item.id} item={item} />);
  return <ul className={styles.gridContainer}>{generateItems(items)}</ul>;
});

if (process.env.NODE_ENV !== 'production') ItemListsView.displayName = 'ItemListsView';

export default ItemListsView;
