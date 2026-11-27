/**
 * Captures the main pages in both themes for docs/screenshots.
 *
 * Usage: start the dev server, then `pnpm screenshots`.
 * Uses the Chromium that Playwright already caches on this machine; set
 * CHROME_PATH to override, or SCREENSHOT_BASE_URL to point at another origin.
 */
import { existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

import { chromium } from "playwright-core";

const baseUrl = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";
const outputDir = path.resolve(process.cwd(), "../../docs/screenshots");
const executablePath =
  process.env.CHROME_PATH ??
  path.join(
    homedir(),
    ".cache/ms-playwright/chromium-1148/chrome-linux/chrome",
  );

const pages = [
  { name: "arena", route: "/" },
  { name: "judge", route: "/judge" },
  { name: "brochure", route: "/brochure" },
  { name: "templates", route: "/templates" },
  { name: "history", route: "/history" },
  { name: "run-detail", route: "/history/run_01" },
  { name: "dashboard", route: "/dashboard" },
  { name: "settings", route: "/settings" },
];

const themes = ["dark", "light"];

if (!existsSync(executablePath)) {
  console.error(
    `Chromium not found at ${executablePath}. Set CHROME_PATH to a Chrome binary.`,
  );
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({ executablePath, headless: true });

try {
  for (const theme of themes) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      colorScheme: theme,
    });

    await context.addInitScript((value) => {
      window.localStorage.setItem("theme", value);
    }, theme);

    const page = await context.newPage();

    for (const entry of pages) {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`${baseUrl}${entry.route}`, {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(700);

      // Screenshotting with `fullPage` resizes the page under Recharts and
      // leaves its responsive charts blank, so grow the viewport instead.
      const contentHeight = await page.evaluate(() =>
        Math.min(document.body.scrollHeight, 4000),
      );
      await page.setViewportSize({ width: 1440, height: contentHeight });
      await page.waitForTimeout(400);

      const file = path.join(outputDir, `${entry.name}-${theme}.png`);
      await page.screenshot({
        path: file,
        clip: { x: 0, y: 0, width: 1440, height: contentHeight },
      });
      console.log(`docs/screenshots/${entry.name}-${theme}.png`);
    }

    await context.close();
  }
} finally {
  await browser.close();
}
