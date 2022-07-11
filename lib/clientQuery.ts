"use strict";

import { gql } from "@apollo/client";

export const GET_ALL_DATA = gql`
  query {
    items {
      id
      name
      url
      description
      tag
    }
  }
`;

export const GET_DATA_WITH_SEARCH_TEXT = gql`
  query GetDataWithSearchText($text: String!) {
    search(text: $text) {
      id
      name
      url
      description
      tag
    }
  }
`;
