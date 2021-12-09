import { prismaClient } from "../../api/lib/prismaClient";
import { firebase_user, auth_user } from "./testData";
import { generateErrorObj } from "../../api/lib/generateErrorObj";
import { users, villages } from "../../prisma/seeds";
import { tokens } from "./testData";

beforeEach(async () => {
  await prismaClient.user.createMany({ data: users });
  await prismaClient.village.createMany({ data: villages });
  await prismaClient.$disconnect();
});

afterEach(async () => {
  const deleteUsers = prismaClient.user.deleteMany();
  const deleteVillages = prismaClient.village.deleteMany();
  const deleteMessage = prismaClient.message.deleteMany();
  await prismaClient.$transaction([deleteUsers, deleteVillages, deleteMessage]);
  await prismaClient.$disconnect();
});

jest.mock("../../api/lib/firebaseAdmin", () => ({
  verifyToken: (token: string) => {
    if (token == tokens.auth_user) {
      return auth_user;
    }
    if (token === tokens.firebase_user) {
      return firebase_user;
    }
    return generateErrorObj(400, "ID token has invalid signature");
  },
}));

jest.spyOn(console, "error").mockImplementation(() => {});
