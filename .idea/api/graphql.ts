'use strict';

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

import { resolvers } from '@/apollo/resolvers';
import { typeDefs } from '@/apollo/schema';

const server = new ApolloServer({ typeDefs, resolvers });

export default startServerAndCreateNextHandler(server);

// export const config = {
//   runtime: 'edge',
//   /**
//    * yarn vercel build時に発生する以下のエラーの対応のため、 unstable_allowDynamic を指定する
//    * Dynamic Code Evaluation (e. g. 'eval', 'new Function', 'WebAssembly.compile') not allowed in Edge Runtime Learn More: https://nextjs.org/docs/messages/edge-dynamic-code-evaluation
//    * https://nextjs.org/docs/messages/edge-dynamic-code-evaluation
//    */
//   unstable_allowDynamic: ['/node_modules/@protobufjs/inquire/index.js', '/node_modules/lodash.sortby/index.js'],
// };
