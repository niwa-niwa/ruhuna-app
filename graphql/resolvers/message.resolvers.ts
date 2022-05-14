import { CContext } from "../../types/gql.types";

const Message = {
  village: async (
    message: any,
    args: any,
    { prisma, currentUser }: CContext
  ) => {
    const village = await prisma.village.findUnique({
      where: { id: message.villageId },
    });
    return village;
  },

  user: async (message: any, args: any, { prisma, currentUser }: CContext) => {
    const user = await prisma.user.findUnique({
      where: { id: message.userId },
    });

    return user;
  },
};

const messageResolvers = {
  Message,
};

export default messageResolvers;
