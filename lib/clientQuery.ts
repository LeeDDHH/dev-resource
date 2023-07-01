'use strict';

import { gql } from '@apollo/client';

export const GET_ALL_DATA = gql`
  query GetAllData {
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

export const SEARCH_WITH_OFFSET_AND_LIMIT = gql`
  query SearchWithOffsetAndLimit($offset: Int, $limit: Int) {
    searchWithOffsetAndLimit(offset: $offset, limit: $limit) {
      id
      name
      url
      description
      tag
    }
  }
`;
