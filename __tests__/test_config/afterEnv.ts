import { prismaClient } from "../../api/lib/prismaClient";
import {
  firebase_user,
  admin_user,
  anonymous_user,
  general_user,
  nonactive_user,
} from "./testData";
import { generateErrorObj } from "../../api/lib/generateErrorObj";
import { tokens } from "./testData";
import { seeds } from "./testSeeds";

beforeEach(async () => {
  await seeds();
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
    if (token == tokens.admin_user) {
      return admin_user;
    }

    if (token === tokens.firebase_user) {
      return firebase_user;
    }

    if (token === tokens.general_user) {
      return general_user;
    }

    if (token === tokens.anonymous_user) {
      return anonymous_user;
    }

    if (token === tokens.nonactive_user) {
      return nonactive_user;
    }

    return generateErrorObj(400, "ID token has invalid signature");
  },
}));

jest.spyOn(console, "error").mockImplementation(() => {});
