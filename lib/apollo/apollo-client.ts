'use strict';

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { offsetLimitPagination } from '@apollo/client/utilities';

const client = new ApolloClient({
  uri: 'api/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // 無限スクロールする対象を検索する単語単位にする
          // https://www.apollographql.com/docs/react/pagination/offset-based/#setting-keyargs-with-offsetlimitpagination
          search: offsetLimitPagination(['text']),
          searchWithOffsetAndLimit: offsetLimitPagination(),
          // bookmarkWithOffsetAndLimit: offsetLimitPagination(),
        },
      },
    },
  }),
});

export default client;
