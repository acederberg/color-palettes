/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testMatch : [
    "**/*.test.ts"
  ],
  testEnvironment: 'node',
  testTimeout : 100000 ,
  bail: 1,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  globals: {
    'ts-jest': {
        isolatedModules: true
    }
  },
};
// Some useful flags :
// - testNamePattern
// - testPathPattern
// - onlyFailed
// - onlyChanged
