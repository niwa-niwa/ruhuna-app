import { prismaClient } from "./../../lib/prismaClient";
import { PARAMS } from "./../../consts/url";
import {
  calcSkipRecords,
  genErrorObj,
  genLinksHeader,
  genResponseHeader,
  isOwner,
  isVillager,
  parseFields,
  parseOffset,
  parsePage,
  parseParPage,
  parseSort,
} from "../../lib/utilities";
import { config } from "../../consts/config";

describe("utilities.ts", () => {
  describe("genErrorObj", () => {
    test("Success ", () => {
      const code = 200;
      const message = "this is a test";
      const result = genErrorObj(code, message);
      expect(result.code).toBe(code);
      expect(result.message).toBe(message);
    });
  });

  describe("genResponseHeader", () => {
    test("Success", () => {
      const count = 30;
      const par_page = 10;
      const result = genResponseHeader(count, par_page);
      expect(result[PARAMS.X_TOTAL_COUNT]).toBe(count);
      expect(result[PARAMS.X_TOTAL_PAGE_COUNT]).toBe(
        Math.ceil(count / par_page)
      );
    });

    test("Success : whatever par_page is undefined", () => {
      const count = 100;
      const par_page = undefined;
      const result = genResponseHeader(count, par_page);
      expect(result[PARAMS.X_TOTAL_COUNT]).toBe(count);
      expect(result[PARAMS.X_TOTAL_PAGE_COUNT]).toBe(1);
    });

    test("Success : Whatever par_page over count", () => {
      const count = 100;
      const par_page = 101;
      const result = genResponseHeader(count, par_page);
      expect(result[PARAMS.X_TOTAL_COUNT]).toBe(count);
      expect(result[PARAMS.X_TOTAL_PAGE_COUNT]).toBe(1);
    });
  });

  describe("genLinksHeader", () => {
    test("Success : request has page param", () => {
      const page = 30;
      const total_page = 100;
      const url = `/aaa/bbb/ccc?page=${page}`;
      const result = genLinksHeader(page, total_page, url);
      expect(result.next).toBe("/aaa/bbb/ccc?page=31");
      expect(result.prev).toBe("/aaa/bbb/ccc?page=29");
    });

    test("Success : request has other param", () => {
      const page = 30;
      const total_page = 100;
      const url = "/aaa/bbb/ccc?user_id=1";
      const result = genLinksHeader(page, total_page, url);
      expect(result.next).toBe("/aaa/bbb/ccc?user_id=1&page=31");
      expect(result.prev).toBe("/aaa/bbb/ccc?user_id=1&page=29");
    });

    test("Success : request has not a param", () => {
      const page = 30;
      const total_page = 100;
      const url = "/aaa/bbb/ccc";
      const result = genLinksHeader(page, total_page, url);
      expect(result.next).toBe("/aaa/bbb/ccc?page=31");
      expect(result.prev).toBe("/aaa/bbb/ccc?page=29");
    });

    test("Success : link header should be empty ", () => {
      const page = 1;
      const total_page = 1;
      const url = "/aaa/bbb/ccc";
      const result = genLinksHeader(page, total_page, url);
      expect(result.next).toBe("");
      expect(result.prev).toBe("");
    });
  });

  describe("parseFields", () => {
    test("Success normal arguments", () => {
      const args = "id,name,createdAt";
      const result = parseFields(args);
      expect(result).toEqual({ id: true, name: true, createdAt: true });
    });
    test("Success nothing arguments then return undefined", () => {
      const result = parseFields("");
      expect(result).toBeUndefined();
    });
  });

  describe("parseSort", () => {
    test("Success", () => {
      const args = "-createdAt,+updatedAt";
      const result = parseSort(args);
      expect(result).toEqual([{ createdAt: "desc" }, { updatedAt: "asc" }]);
    });
    test("Fail arguments must add a prefix - or + otherwise slice top character", () => {
      const args = "-createdAt,abc";
      const result = parseSort(args);
      expect(result).toEqual([{ createdAt: "desc" }, { bc: "asc" }]);
    });
  });

  describe("parseParPage", () => {
    test("Success  argument = 20 return 20", () => {
      const result = parseParPage(20);
      expect(result).toBe(20);
    });

    test("argument = '20' return 20", () => {
      const result = parseParPage("20");
      expect(result).toBe(20);
    });

    test("argument = 'test' return PAR_PAGE_DEFAULT", () => {
      const result = parseParPage("test");
      expect(result).toBe(config.PAR_PAGE_DEFAULT);
    });

    test("argument = '' return PAR_PAGE_DEFAULT", () => {
      const result = parseParPage("");
      expect(result).toBe(config.PAR_PAGE_DEFAULT);
    });

    test("argument = undefined return PAR_PAGE_DEFAULT", () => {
      const result = parseParPage(undefined);
      expect(result).toBe(config.PAR_PAGE_DEFAULT);
      const result_2 = parseParPage(null);
      expect(result).toBe(config.PAR_PAGE_DEFAULT);
    });

    test("argument = null return PAR_PAGE_DEFAULT", () => {
      const result = parseParPage(null);
      expect(result).toBe(config.PAR_PAGE_DEFAULT);
    });

    test("argument = '0' return undefined", () => {
      const result = parseParPage("0");
      expect(result).toBeUndefined();
    });

    test("argument = 0 return undefined", () => {
      const result = parseParPage(0);
      expect(result).toBeUndefined();
    });

    test("argument = 1 return 1", () => {
      const result = parseParPage(1);
      expect(result).toBe(1);
    });
  });

  describe("parseOffset", () => {
    test("argument = 10 , return = 10", () => {
      const result = parseOffset(1);
      expect(result).toBe(1);
    });

    test("argument = '10',return = 10 ", () => {
      const result = parseOffset("10");
      expect(result).toBe(10);
    });

    test("argument = 'text', result = undefined", () => {
      const result = parseOffset("text");
      expect(result).toBeUndefined();
    });

    test("argument = undefined, result = undefined", () => {
      const result = parseOffset(undefined);
      expect(result).toBeUndefined();
    });

    test("argument = null, result = null", () => {
      const result = parseOffset(null);
      expect(result).toBeUndefined();
    });

    test("argument = 1, result = 1", () => {
      const result = parseOffset(1);
      expect(result).toBe(1);
    });

    test("argument = 0, result = 0", () => {
      const result = parseOffset(0);
      expect(result).toBe(undefined);
    });
  });

  describe("parsePage", () => {
    test("argument = 21, return = 21", () => {
      const result = parsePage(21);
      expect(result).toBe(21);
    });

    test("argument = '21', return = 21", () => {
      const result = parsePage("21");
      expect(result).toBe(21);
    });

    test("argument = 'text', return = 1", () => {
      const result = parsePage("text");
      expect(result).toBe(1);
    });

    test("argument = null, return = 1", () => {
      const result = parsePage(null);
      expect(result).toBe(1);
    });

    test("argument = undefined, return = 1", () => {
      const result = parsePage(undefined);
      expect(result).toBe(1);
    });

    test("argument = 1, return = 1", () => {
      const result = parsePage(1);
      expect(result).toBe(1);
    });

    test("argument = 0, return = 1", () => {
      const result = parsePage(0);
      expect(result).toBe(1);
    });
  });

  describe("calcSkipRecords", () => {
    test("argument pattern 1 ", () => {
      const par_page = 1;
      const page = 1;
      const offset = 0;
      const result = calcSkipRecords(par_page, page, offset);
      expect(result).toBe(0);
    });

    test("argument pattern 2 ", () => {
      const par_page = 5;
      const page = 1;
      const offset = 0;
      const result = calcSkipRecords(par_page, page, offset);
      expect(result).toBe(0);
    });

    test("argument pattern 3 ", () => {
      const par_page = 5;
      const page = 1;
      const offset = 2;
      const result = calcSkipRecords(par_page, page, offset);
      expect(result).toBe(2);
    });

    test("argument pattern 4 ", () => {
      const par_page = 5;
      const page = 3;
      const offset = 2;
      const result = calcSkipRecords(par_page, page, offset);
      expect(result).toBe(12);
    });

    test("argument pattern 5", () => {
      const par_page = undefined;
      const page = 3;
      const offset = 2;
      const result = calcSkipRecords(par_page, page, offset);
      expect(result).toBe(2);
    });

    test("argument pattern 5", () => {
      const par_page = 0;
      const page = 3;
      const offset = 2;
      const result = calcSkipRecords(par_page, page, offset);
      expect(result).toBe(2);
    });

    test("argument pattern 5", () => {
      const par_page = 10;
      const page = 3;
      const offset = 0;
      const result = calcSkipRecords(par_page, page, offset);
      expect(result).toBe(20);
    });
  });

  describe("isVillager", () => {
    test("Success", async () => {
      const user = await prismaClient.user.findFirst({
        include: { villages: true },
      });
      if (!user) return;

      const village = await prismaClient.village.findFirst();
      if (!village) return;

      const result = isVillager(user, village);
      expect(result).toBeTruthy();
    });
    test("Fail", async () => {
      const user = await prismaClient.user.findFirst({
        include: { villages: true },
      });
      if (!user) return;

      const village = await prismaClient.village.findFirst({
        where: { name: "village_B" },
      });
      if (!village) return;

      const result = isVillager(user, village);
      expect(result).toBeFalsy();
    });
  });

  describe("isOwner", () => {
    test("Success", async () => {
      const user = await prismaClient.user.findFirst({
        include: { ownVillages: { select: { id: true } } },
      });
      if (!user) return;
      const village = await prismaClient.village.findFirst();
      if (!village) return;

      const result = isOwner(user, village);
      expect(result).toBeTruthy();
    });
    test("Fail", async () => {
      const user = await prismaClient.user.findFirst({
        include: { ownVillages: { select: { id: true } } },
      });
      if (!user) return;

      const village = await prismaClient.village.findFirst({
        where: { name: "village_B" },
      });
      if (!village) return;

      const result = isOwner(user, village);
      expect(result).toBeFalsy();
    });
  });
  describe("just test", () => {
    test("Success", () => {
      const text: any = "";
      if (Number.isNaN(text)) {
        console.log("test");
      }
    });
  });
});
