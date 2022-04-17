import {
  firebase_user,
  admin_user,
  anonymous_user,
  general_user,
  nonactive_user,
  sub_user,
} from "./testData";
import { genErrorObj } from "../../lib/utilities";
import { testTokens } from "./testData";
import initDB from "./initDB";

beforeAll(async () => await initDB());

jest.mock("../../lib/firebaseAdmin", () => ({
  verifyToken: (token: string) => {
    if (token == testTokens.admin_user) {
      return admin_user;
    }

    if (token === testTokens.firebase_user) {
      return firebase_user;
    }

    if (token === testTokens.general_user) {
      return general_user;
    }

    if (token === testTokens.anonymous_user) {
      return anonymous_user;
    }

    if (token === testTokens.nonactive_user) {
      return nonactive_user;
    }

    if (token === testTokens.sub_user) {
      return sub_user;
    }

    return genErrorObj(400, "ID token has invalid signature");
  },
}));

jest.spyOn(console, "error").mockImplementation(() => {});
