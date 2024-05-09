/** @type {import('jest').Config} */
const config = {
    "moduleNameMapper": {
        "\\.(css|jpg|png)$": "identity-obj-proxy"
      },
      "testEnvironment": "jsdom",
	  extensionsToTreatAsEsm: ['.jsx'],

      transform: {
        '\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.testing.js' }]
      },
  };
  
  module.exports = config;