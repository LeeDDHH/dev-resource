import { gql } from '@apollo/client';

export const typeDefs = gql`
  type Item {
    id: Int
    name: String
    url: String
    description: String
    tag: [String]
  }

  type Query {
    items: [Item]
    search(text: String, offset: Int, limit: Int): [Item]
    searchWithOffsetAndLimit(offset: Int, limit: Int): [Item]
    bookmarkWithOffsetAndLimit(bookmarkList: [Int], offset: Int, limit: Int): [Item]
  }

  input SortOrderByInput {
    id: Sort
    url: Sort
  }

  enum Sort {
    asc
    desc
  }
`;
