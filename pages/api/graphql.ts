"use strict";

import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "../../apollo/schema";
import { resolvers } from "../../apollo/resolvers";

const server = new ApolloServer({ typeDefs, resolvers });

export default startServerAndCreateNextHandler(server);
