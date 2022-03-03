import { GraphQLScalarType } from "graphql";

export const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "The scalar returns Prisma DateTime as Date of type",
    serialize(value: any) {
      return value
    },
    parseValue(value: any) {
      return value
    },
    parseLiteral(ast: any) {
      return ast
    },
  }),
};
