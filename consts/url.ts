export const PATH = Object.freeze({
  REST: "/api",
  V1: "/v1",
  HEALTH: "/health",
  ME: "/me",
  USERS: "/users",
  VILLAGES: "/villages",
  MESSAGES: "/messages",
});

export const V1 = Object.freeze({
  USERS: `${PATH.REST}${PATH.V1}${PATH.USERS}`,
});

export const PARAMS = Object.freeze({
  X_TOTAL_COUNT: "x-total-count",
  X_TOTAL_PAGE_COUNT: "x-total-pages-count",
  FIELDS: "fields",
  SORT: "sort",
  PAR_PAGE: "par_page",
  PAGE: "page",
  OFFSET: "offset",
});
