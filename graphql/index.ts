import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { addResolversToSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server-express";
import { ExpressContext } from "apollo-server-express";
import { join } from "path";
import { resolvers } from './resolvers'

const schema = loadSchemaSync(join(__dirname, "/schema.graphql"), {
  loaders: [new GraphQLFileLoader()],
});

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

export const apolloServer: ApolloServer<ExpressContext> = new ApolloServer({
  schema: schemaWithResolvers,
  context: ({ req }) => {},
});
