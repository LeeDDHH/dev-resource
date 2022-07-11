"use strict";

import React from "react";

import styles from "../styles/ItemListsView.module.css";

import SingleItemView from "./SingleItemView";

type Props = { items: GetAllDataItem[] };

const ItemListsView = React.memo(({ items }: Props) => {
  const generateItems = (items: GetAllDataItem[]) => {
    return items && items.map((item) => <SingleItemView key={item.id} item={item} />);
  };

  return <ul className={styles.gridContainer}>{generateItems(items)}</ul>;
});

ItemListsView.displayName = "ItemListsView";
export default ItemListsView;
