import { prismaClient } from "../../api/lib/Prisma";

async function teardown() {
  await prismaClient.$disconnect();
  console.log("TEST END");
}

export default teardown;
