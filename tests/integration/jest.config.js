const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  globalSetup: '<rootDir>/tests/integration/setup.js',
  globalTeardown: '<rootDir>/tests/integration/teardown.js',
  testEnvironment: '<rootDir>/tests/integration/puppeteer_environment.js',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/dist',
    '<rootDir>/docs'
  ],
  reporters: [
    'default'
  ],
  testMatch: [
    '<rootDir>/tests/integration/**/*.spec.js'
  ],
  transform: {
    '^.+\\.js$': '<rootDir>/tests/integration/jest-transform.js'
  }
}
