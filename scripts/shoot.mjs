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

async function scrollTo(y) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await sleep(850); // let scrubbed timeline catch up
}
async function shot(name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('shot', name, 'scrollY=', await page.evaluate(() => Math.round(window.scrollY)));
}

await page.goto(BASE, { waitUntil: 'networkidle2' });
await sleep(1500); // fonts + cutout processing
// skip the loader gate
await page.evaluate(() => {
  document.getElementById('loader')?.remove();
  document.body.style.overflow = '';
});
await sleep(400);

// --- HERO reveal states ---
await scrollTo(0);    await shot('01-hero-top');
await scrollTo(360);  await shot('02-hero-early');
await scrollTo(760);  await shot('03-hero-mid');
await scrollTo(1120); await shot('04-hero-resolved');

// --- ACCORDION ---
const accTop = await page.evaluate(() => {
  const el = document.getElementById('memberships');
  return el ? el.getBoundingClientRect().top + window.scrollY : null;
});
console.log('accTop', accTop);
if (accTop != null) {
  const vh = 900;
  await scrollTo(accTop + vh * 0.5);  await shot('05-acc-panel1');
  await scrollTo(accTop + vh * 1.5);  await shot('06-acc-panel2');
  await scrollTo(accTop + vh * 2.5);  await shot('07-acc-panel3');
  await scrollTo(accTop + vh * 3.5);  await shot('08-acc-panel4');
}

// --- a content section for good measure ---
await page.evaluate(() => document.getElementById('coaching')?.scrollIntoView());
await sleep(700);
await shot('09-coaching');

// capture any console errors
const errs = [];
page.on('pageerror', (e) => errs.push(String(e)));
await sleep(200);
console.log('PAGEERRORS:', errs.length ? errs : 'none');

await browser.close();
console.log('done');
