import { PARAMS } from "./../../consts/url";
import {
  genErrorObj,
  genLinksHeader,
  genResponseHeader,
} from "../../lib/utilities";

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
      expect(result.next).toBe('/aaa/bbb/ccc?page=31')
      expect(result.prev).toBe('/aaa/bbb/ccc?page=29')
    });

    test("Success : request has other param", () => {
      const page = 30;
      const total_page = 100;
      const url = "/aaa/bbb/ccc?user_id=1";
      const result = genLinksHeader(page, total_page, url);
      expect(result.next).toBe('/aaa/bbb/ccc?user_id=1&page=31')
      expect(result.prev).toBe('/aaa/bbb/ccc?user_id=1&page=29')
    });

    test("Success : request has not a param", () => {
      const page = 30;
      const total_page = 100;
      const url = "/aaa/bbb/ccc";
      const result = genLinksHeader(page, total_page, url);
      expect(result.next).toBe('/aaa/bbb/ccc?page=31')
      expect(result.prev).toBe('/aaa/bbb/ccc?page=29')
    });

    test("Success : link header should be empty ", () => {
      const page = 1;
      const total_page = 1;
      const url = "/aaa/bbb/ccc";
      const result = genLinksHeader(page, total_page, url);
      expect(result.next).toBe("")
      expect(result.prev).toBe("")
    });
  });
});
