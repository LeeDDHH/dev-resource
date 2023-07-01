'use strict';

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { offsetLimitPagination } from '@apollo/client/utilities';

const client = new ApolloClient({
  uri: 'api/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          searchWithOffsetAndLimit: offsetLimitPagination(),
        },
      },
    },
  }),
});

export default client;
