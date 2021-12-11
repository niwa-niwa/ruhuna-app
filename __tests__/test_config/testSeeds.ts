import { prismaClient } from "../../api/lib/prismaClient";
import { users, villages } from "../../prisma/seeds";

export async function testSeeds() {
  const user_a = await prismaClient.user.create({ data: users[0] });
  const user_b = await prismaClient.user.create({ data: users[1] });
  const user_c = await prismaClient.user.create({ data: users[2] });
  const user_d = await prismaClient.user.create({ data: users[3] });
  const user_e = await prismaClient.user.create({ data: users[4] });

  const village_a = await prismaClient.village.create({
    data: { ...villages[0], users: { connect: { id: user_a.id } } },
  });
  const village_b = await prismaClient.village.create({
    data: { ...villages[1], users: { connect: { id: user_b.id } } },
  });
  const village_c = await prismaClient.village.create({
    data: { ...villages[2], users: { connect: { id: user_a.id } } },
  });
  const village_d = await prismaClient.village.create({
    data: { ...villages[3], users: { connect: { id: user_d.id } } },
  });
  const village_e = await prismaClient.village.create({ data: villages[4] });

  await prismaClient.message.create({
    data: {
      content: "message_1 content",
      village: {
        connect: { id: village_a.id },
      },
      user: {
        connect: { id: user_a.id },
      },
    },
  });

  await prismaClient.message.create({
    data: {
      content: "message_2 content",
      village: {
        connect: { id: village_a.id },
      },
      user: {
        connect: { id: user_a.id },
      },
    },
  });

  await prismaClient.message.create({
    data: {
      content: "message_3 content",
      village: {
        connect: { id: village_c.id },
      },
      user: {
        connect: { id: user_c.id },
      },
    },
  });

  await prismaClient.message.create({
    data: {
      content: "message_4 content",
      village: {
        connect: { id: village_b.id },
      },
      user: {
        connect: { id: user_b.id },
      },
    },
  });
  await prismaClient.message.create({
    data: {
      content: "message_5 content",
      village: {
        connect: { id: village_b.id },
      },
      user: {
        connect: { id: user_a.id },
      },
    },
  });
}
