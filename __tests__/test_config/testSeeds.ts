import { Prisma } from "@prisma/client";
import { prismaClient } from "../../api/lib/prismaClient";
import { users, villages } from "../../prisma/seeds";

export async function seedUsers() {
  await prismaClient.user.createMany({ data: users });
}

export async function seedVillage() {
  await prismaClient.village.createMany({ data: villages });
}

export async function seedMessages() {
  const message_1: Prisma.MessageCreateInput = {
    content: "message_1 content",
    village: {
      create: {
        name: "village for message_1",
        description: "message_1 for village",
      },
    },
    user: {
      create: {
        firebaseId: "firebase_id_message_1",
        username: "firebase message_1",
      },
    },
  };

  const message_2: Prisma.MessageCreateInput = {
    content: "message_2 content",
    village: {
      create: {
        name: "village for message_2",
        description: "message_2 for village",
      },
    },
    user: {
      create: {
        firebaseId: "firebase_id_message_2",
        username: "firebase message_2",
      },
    },
  };

  const message_3: Prisma.MessageCreateInput = {
    content: "message_3 content",
    village: {
      create: {
        name: "village for message_3",
        description: "message_3 for village",
      },
    },
    user: {
      create: {
        firebaseId: "firebase_id_message_3",
        username: "firebase message_3",
      },
    },
  };

  const message_4: Prisma.MessageCreateInput = {
    content: "message_4 content",
    village: {
      create: {
        name: "village for message_4",
        description: "message_4 for village",
      },
    },
    user: {
      create: {
        firebaseId: "firebase_id_message_4",
        username: "firebase message_4",
      },
    },
  };

  const message_5: Prisma.MessageCreateInput = {
    content: "message_5 content",
    village: {
      create: {
        name: "village for message_5",
        description: "message_5 for village",
      },
    },
    user: {
      create: {
        firebaseId: "firebase_id_message_5",
        username: "firebase message_5",
      },
    },
  };

  await prismaClient.message.create({ data: message_1 });
  await prismaClient.message.create({ data: message_2 });
  await prismaClient.message.create({ data: message_3 });
  await prismaClient.message.create({ data: message_4 });
  await prismaClient.message.create({ data: message_5 });
}
