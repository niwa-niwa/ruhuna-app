import { Resolvers} from '../resolvers-types'

export const resolvers:Resolvers = {
  Query: {
    connect: () => {
      return "Hello resolvers";
    },
  },
};
