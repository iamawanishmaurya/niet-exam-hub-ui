const { chromium } = require('playwright');
const { exec } = require('child_process');

// use local node http-server or python directly
const pythonServer = exec('python3 -m http.server 3555');

setTimeout(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
    
    console.log('Navigating to http://localhost:3555...');
    await page.goto('http://localhost:3555');
    await page.waitForTimeout(3000);
    
    // verify if UI text contains '0 Semester' or '97 Semester'
    const html = await page.content();
    if (html.includes('0\nSemester I')) {
       console.log('STILL ZERO');
    } else {
       console.log('It seems zero issue is gone!');
    }
    
    await browser.close();
  } catch (e) {
    console.error('Playwright Error:', e);
  } finally {
    pythonServer.kill();
    process.exit(0);
  }
}, 1000);
