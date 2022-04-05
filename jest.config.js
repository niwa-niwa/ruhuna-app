/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  globalSetup: "./__tests__/test_config/setup.ts",
  setupFilesAfterEnv: ["./__tests__/test_config/afterEnv.ts"],
  globalTeardown: "./__tests__/test_config/teardown.ts",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/test_config/",
    "/__tests__/graphql/",
  ],
  modulePaths: ["/__tests__/"],
};
