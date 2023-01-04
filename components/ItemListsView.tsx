"use strict";

import React from "react";

import styles from "../styles/ItemListsView.module.css";

import SingleItemView from "./SingleItemView";

import { Item } from "../graphql/generated";

type Props = { items: Item[] };

const ItemListsView = React.memo(({ items }: Props) => {
  const generateItems = (items: Item[]) =>
    items.map((item) => <SingleItemView key={item.id} item={item} />);
  return <ul className={styles.gridContainer}>{generateItems(items)}</ul>;
});

export default ItemListsView;
