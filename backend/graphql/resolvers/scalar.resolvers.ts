import { GraphQLScalarType, ValueNode } from "graphql";

export const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "The scalar returns Prisma DateTime as Date of type",
    serialize(value: any) {
      return value;
    },
    parseValue(value: any) {
      return value;
    },
    parseLiteral(ast: any) {
      return ast;
    },
  }),

  Base64: new GraphQLScalarType({
    name: "Base64",
    description: "request base64 to string & response string to base64",
    serialize(value: unknown) {
      const base64 = Buffer.from(String(value)).toString("base64");
      return base64;
    },
    parseValue(value: unknown) {
      const text = Buffer.from(String(value), "base64").toString();
      return text;
    },
    parseLiteral(ast: ValueNode) {
      if (ast.kind === "StringValue") {
        const text = Buffer.from(String(ast.value), "base64").toString();
        return text;
      }
      return null;
    },
  }),
};
