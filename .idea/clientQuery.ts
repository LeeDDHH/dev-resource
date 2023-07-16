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
  query GetDataWithSearchText($text: String!, $offset: Int, $limit: Int) {
    search(text: $text, offset: $offset, limit: $limit) {
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

export const BOOKMARK_WITH_OFFSET_AND_LIMIT = gql`
  query BookmarkWithOffsetAndLimit($bookmarkList: [Int], $offset: Int, $limit: Int) {
    bookmarkWithOffsetAndLimit(bookmarkList: $bookmarkList, offset: $offset, limit: $limit) {
      id
      name
      url
      description
      tag
    }
  }
`;
