import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { addResolversToSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server-express";
import { ExpressContext } from "apollo-server-express";
import { join } from "path";
import { resolvers } from "./resolvers/con.resolvers";

// const schema = loadSchemaSync(join(__dirname, "/schema.graphql"), {
//   loaders: [new GraphQLFileLoader()],
// });

// const schemaWithResolvers = addResolversToSchema({
//   schema:mergeTypeDefs(schema),
//   resolvers,
// });

// merge types
const typesArray: any[] = loadFilesSync(
  join(__dirname, "/schemas/**/*.graphql")
);

// merge resolvers
const resolversArray: any[] = loadFilesSync(
  join(__dirname, "/resolvers/**/*.resolvers.*")
);

export const apolloServer: ApolloServer<ExpressContext> = new ApolloServer({
  typeDefs: mergeTypeDefs(typesArray),
  resolvers: mergeResolvers(resolversArray),
  context: ({ req }) => {},
});
