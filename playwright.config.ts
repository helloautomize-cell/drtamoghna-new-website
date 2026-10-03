import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run build && npm run start",
        url: "http://localhost:3000/styleguide/",
        timeout: 240_000,
        reuseExistingServer: true,
      },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
