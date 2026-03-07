const { chromium } = require('playwright');
const { exec } = require('child_process');

const server = exec('npx serve -l 3555 .');
setTimeout(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => console.log('FAILED REQUEST:', request.url(), request.failure().errorText));
  
  await page.goto('http://localhost:3555');
  await page.waitForTimeout(3000);
  await browser.close();
  server.kill();
  process.exit(0);
}, 2000);
