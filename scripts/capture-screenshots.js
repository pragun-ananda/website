import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = '/Users/pragun/.gemini/antigravity/brain/1110decf-c9fc-436f-a2ff-403f0d266891';

const pagesToCapture = [
  { name: 'screenshot_home_dark.png', url: 'http://localhost:4321/', theme: 'dark' },
  { name: 'screenshot_home_light.png', url: 'http://localhost:4321/', theme: 'light' },
  { name: 'screenshot_blog_dark.png', url: 'http://localhost:4321/blog', theme: 'dark' },
  { name: 'screenshot_post_dark.png', url: 'http://localhost:4321/blog/test-post', theme: 'dark' },
  { name: 'screenshot_projects_dark.png', url: 'http://localhost:4321/projects', theme: 'dark' }
];

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 }
  });

  for (const pageInfo of pagesToCapture) {
    const page = await context.newPage();
    await page.goto(pageInfo.url, { waitUntil: 'networkidle' });
    
    // Set theme
    if (pageInfo.theme === 'light') {
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      });
    } else {
      await page.evaluate(() => {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      });
    }

    await page.waitForTimeout(500); // Allow render & fonts
    const savePath = path.join(outDir, pageInfo.name);
    await page.screenshot({ path: savePath, fullPage: true });
    console.log(`Saved screenshot: ${savePath}`);
    await page.close();
  }

  await browser.close();
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
