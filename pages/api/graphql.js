import { ApolloServer, gql } from "apollo-server-micro";
import { typeDefs } from '../../apollo/schema'
import { resolvers } from '../../apollo/resolvers'

const server = new ApolloServer({ typeDefs, resolvers })

const handler = server.createHandler({ path: "/api/graphql" })

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler
