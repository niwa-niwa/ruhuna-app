export const resolvers = {
  Query: {
    getMe: (parent: any, args: any, context: any, info: any) => {
      return context.currentUser;
    },
  },
};
