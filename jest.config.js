'use strict';

module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/performance/**/*-test.js',
  ],
  globalSetup: './tests/utilities/jestStartup.js',
  globalTeardown: './tests/utilities/jestTeardown.js',
};
