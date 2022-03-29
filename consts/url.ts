export const PATH = Object.freeze({
  REST: "/api",
  V1: "/v1",
  ME: "/me",
  HEALTH: "/health",
  USERS: "/users",
  VILLAGES: "/villages",
  MESSAGES: "/messages",
});

export const V1 = Object.freeze({
  ME: `${PATH.REST}${PATH.V1}${PATH.ME}`,
  HEALTH: `${PATH.REST}${PATH.V1}${PATH.HEALTH}`,
  USERS: `${PATH.REST}${PATH.V1}${PATH.USERS}`,
  VILLAGES: `${PATH.REST}${PATH.V1}${PATH.VILLAGES}`,
  MESSAGES: `${PATH.REST}${PATH.V1}${PATH.MESSAGES}`,
});

export const PARAMS = Object.freeze({
  HEADER_AUTH_KEY: "Authorization",
  X_TOTAL_COUNT: "x-total-count",
  X_TOTAL_PAGE_COUNT: "x-total-page-count",
  FIELDS: "fields",
  SORT: "sort",
  PAR_PAGE: "par_page",
  PAGE: "page",
  OFFSET: "offset",
});
