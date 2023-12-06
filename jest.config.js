/** @type {import('jest').Config} */
const config = {
    // transformIgnorePatterns: ['/node_modules/(?!(foo|bar)/)', '/bar/','/styles/','/bootstrap/'],
    "moduleNameMapper": {
        "\\.(css|jpg|png)$": "identity-obj-proxy"
      },
      "testEnvironment": "jsdom",
      transform: {
        '\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.testing.js' }]
      },
  };
  
  module.exports = config;