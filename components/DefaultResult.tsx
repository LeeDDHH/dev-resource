"use strict";

import React from "react";

import { useQuery } from "@apollo/client";
import { GET_ALL_DATA } from "../lib/clientQuery";

import ItemListsView from "./ItemListsView";

type GetAllDataItems = {
  items: GetAllDataItem[];
};

const DefaultResult = React.memo(() => {
  const { data, loading, error } = useQuery(GET_ALL_DATA);

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

  const items = (data as GetAllDataItems).items;

  return <ItemListsView items={items} />;
});

DefaultResult.displayName = "DefaultResult";
export default DefaultResult;
