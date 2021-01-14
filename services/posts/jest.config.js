module.exports = {
  moduleNameMapper: {
    "/opt/nodejs/mongo-utils": "../../packages/mongo-utils",
  },
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
