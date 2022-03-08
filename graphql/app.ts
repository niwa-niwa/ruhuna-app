import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { ApolloServer } from "apollo-server-express";
import { ExpressContext } from "apollo-server-express";
import { context } from "./context/";
import { join } from "path";

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
  context: context,
});
