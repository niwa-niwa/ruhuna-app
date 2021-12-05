import { prismaClient } from "../../src/lib/Prisma";

export default async () => {
  await prismaClient.$disconnect();
  console.log("TEST END");
};
