const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'python3 appy.py',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
