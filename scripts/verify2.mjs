import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';

const OUT = process.env.SHOT_DIR || './shots';
mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:5173';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--force-color-profile=srgb'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
const errs = [];
page.on('pageerror', (e) => errs.push(String(e)));

// drag the mouse along a path so the trailing chain spreads out
async function sweep(y) {
  const steps = 26;
  for (let i = 0; i <= steps; i++) {
    const x = 250 + (i / steps) * 900;
    const yy = y + Math.sin(i / 3) * 70;
    await page.mouse.move(x, yy);
    await sleep(16);
  }
}

// ---- HOME: trail on dark hero, then on light site ----
await page.goto(BASE, { waitUntil: 'networkidle2' });
await sleep(1400);
await page.evaluate(() => { document.getElementById('loader')?.remove(); document.body.style.overflow = ''; });
await page.evaluate(() => window.scrollTo(0, 900)); // into the resolved hero
await sleep(700);
await sweep(430);
await page.screenshot({ path: `${OUT}/T1-trail-hero.png` });

await page.evaluate(() => document.querySelector('#facility')?.scrollIntoView());
await sleep(700);
await sweep(430);
await page.screenshot({ path: `${OUT}/T2-trail-site.png` });

// island compact state on the light site
await page.screenshot({ path: `${OUT}/T3-island-light.png`, clip: { x: 360, y: 0, width: 720, height: 110 } });

// ---- SUB-PAGES ----
const pages = ['membership', 'coaching', 'events', 'about', 'contact'];
for (const p of pages) {
  await page.goto(`${BASE}/${p}.html`, { waitUntil: 'networkidle2' });
  await sleep(1100);
  await sweep(300);
  await page.screenshot({ path: `${OUT}/P-${p}.png` });
}

console.log('PAGEERRORS:', errs.length ? errs : 'none');
await browser.close();
console.log('done');
