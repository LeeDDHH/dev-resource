'use strict';

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

import { resolvers } from '@/apollo/resolvers';
import { typeDefs } from '@/apollo/schema';

const server = new ApolloServer({ typeDefs, resolvers });

export default startServerAndCreateNextHandler(server);
