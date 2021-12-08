import { prismaClient } from "../../api/lib/prismaClient";

async function teardown() {
  await prismaClient.$disconnect();
  console.log("TEST END");
}

export default teardown;
