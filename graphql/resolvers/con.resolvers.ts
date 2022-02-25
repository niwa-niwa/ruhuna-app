import { Resolvers } from "../../types/resolvers-types";

export const resolvers: Resolvers = {
  Query: {
    connect: () => {
      return "Hello resolvers";
    },
  },
};
