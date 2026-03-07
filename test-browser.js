const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => console.log('FAILED REQUEST:', request.url(), request.failure().errorText));
  
  await page.route('**/*', (route, request) => {
    if (request.url().startsWith('https://nietexamhub.bugmein.me/')) {
       // redirect to local file
       const localPath = path.join(__dirname, request.url().replace('https://nietexamhub.bugmein.me/', ''));
       route.fulfill({ path: localPath });
    } else {
       route.continue();
    }
  });

  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.waitForTimeout(3000);
  await browser.close();
})();
