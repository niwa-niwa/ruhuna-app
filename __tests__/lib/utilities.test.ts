import { PARAMS } from "./../../consts/url";
import {
  genErrorObj,
  genLinksHeader,
  genResponseHeader,
  parseFields,
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

    test("parseParPage argument = undefined return PAR_PAGE_DEFAULT", () => {
      const result = parseParPage(undefined);
      expect(result).toBe(config.PAR_PAGE_DEFAULT);
      const result_2 = parseParPage(null)
      expect(result).toBe(config.PAR_PAGE_DEFAULT)
    });

    test("parseParPage argument = 0 return undefined", () => {
      const result = parseParPage(0);
      expect(result).toBeUndefined();
    });
  });

  describe("just test", () => {
    test("Success", () => {
      const text: any = "fafd";
      if (isNaN(text)) {
        console.log("test");
      }
    });
  });
});
