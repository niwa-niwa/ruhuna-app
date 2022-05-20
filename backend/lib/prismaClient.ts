import { Prisma, PrismaClient } from "@prisma/client";

export const prismaClient: PrismaClient<
  Prisma.PrismaClientOptions,
  never,
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
> = new PrismaClient();

export type PClient = typeof prismaClient