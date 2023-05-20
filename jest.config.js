/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // moduleFileExtensions: ['ts', 'js'],
  // testMatch: ['**/__tests__/**/*.+(ts|js)'],
  testMatch: ["**/**/*.test.ts"],
  // testMatch: ["src/**/*.test.ts"],
  // testMatch: ["**/*.test.ts"],
  // testMatch: ["src/**/*.test.ts"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};