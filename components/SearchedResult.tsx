"use strict";

import React from "react";

import { useQuery } from "@apollo/client";
import { GET_DATA_WITH_SEARCH_TEXT } from "../lib/clientQuery";

import ItemListsView from "./ItemListsView";

type Props = {
  searchText: string;
};

const SearchedResult = React.memo(({ searchText }: Props) => {
  const { data, loading, error } = useQuery(GET_DATA_WITH_SEARCH_TEXT, {
    variables: { text: searchText },
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

  const items = data;

  if (!data || data.search.length < 1) return <p>表示する項目がありません</p>;
  return <ItemListsView items={items.search} />;
});

SearchedResult.displayName = "SearchedResult";
export default SearchedResult;
