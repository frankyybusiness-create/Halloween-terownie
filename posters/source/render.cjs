// Render a canvas-based poster source to PNGs.
// usage: NODE_PATH=$(npm root -g) node posters/source/render.cjs <source.html> <outDir> [scale] [extra query, e.g. halo=F5921E]
// The page draws into canvases, exposes window.OUT = { name: canvas }, then sets document.title = 'ready'.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const [src, outDir, scale = '3', extra = ''] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage();
  page.on('console', (m) => console.log('[page]', m.text()));
  page.on('pageerror', (e) => console.error('[page error]', e.message));
  await page.goto('file://' + path.resolve(src) + '?s=' + scale + (extra ? '&' + extra : ''));
  await page.waitForFunction(() => document.title === 'ready' || document.title.startsWith('error'), null, { timeout: 900000 });
  const t = await page.title(); if (t !== 'ready') { console.error(t); process.exit(1); }
  const names = await page.evaluate(() => Object.keys(window.OUT));
  for (const name of names) {
    const url = await page.evaluate((n) => window.OUT[n].toDataURL('image/png'), name);
    fs.writeFileSync(path.join(outDir, name + '.png'), Buffer.from(url.split(',')[1], 'base64'));
    console.log('wrote', path.join(outDir, name + '.png'));
  }
  await browser.close();
})();
