import { PARAMS } from "./../../consts/url";
import { genErrorObj, genResponseHeader } from "../../lib/utilities";

describe("utilities.ts/genErrorObj", () => {
  test("Success ", () => {
    const code = 200;
    const message = "this is a test";
    const result = genErrorObj(code, message);
    expect(result.code).toBe(code);
    expect(result.message).toBe(message);
  });
});

describe("utilities.ts/genResponseHeader", () => {
  test("Success", () => {
    const count = 30;
    const par_page = 10;
    const result = genResponseHeader(count, par_page);
    expect(result[PARAMS.X_TOTAL_COUNT]).toBe(count);
    expect(result[PARAMS.X_TOTAL_PAGE_COUNT]).toBe(Math.ceil(count / par_page));
  });

  test("Success whatever par_page is undefined", () => {
    const count = 100;
    const par_page = undefined;
    const result = genResponseHeader(count, par_page);
    expect(result[PARAMS.X_TOTAL_COUNT]).toBe(count);
    expect(result[PARAMS.X_TOTAL_PAGE_COUNT]).toBe(1);
  });

  test("Success Whatever par_page over count", () => {
    const count = 100;
    const par_page = 101;
    const result = genResponseHeader(count, par_page);
    expect(result[PARAMS.X_TOTAL_COUNT]).toBe(count);
    expect(result[PARAMS.X_TOTAL_PAGE_COUNT]).toBe(1);
  });
});
