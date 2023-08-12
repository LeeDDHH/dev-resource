'use strict';

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { offsetLimitPagination } from '@apollo/client/utilities';

import { env } from '@/lib/env/env';

const client = new ApolloClient({
  // uri: 'api/graphql',
  uri: env.NEXT_PUBLIC_GRAPHQL_SERVER_URL,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // 無限スクロールする対象を検索する単語単位にする
          // https://www.apollographql.com/docs/react/pagination/offset-based/#setting-keyargs-with-offsetlimitpagination
          search: offsetLimitPagination(['text']),
          searchWithOffsetAndLimit: offsetLimitPagination(),
          // bookmarkWithOffsetAndLimit: offsetLimitPagination(['bookmarkList']),
        },
      },
    },
  }),
});

export default client;

export const runtime = 'edge';
