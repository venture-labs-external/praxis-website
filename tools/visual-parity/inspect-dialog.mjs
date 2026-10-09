import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff' };

function listen(root, port) {
  const server = createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    let file = join(root, p);
    if (!existsSync(file) || statSync(file).isDirectory()) file = join(root, 'index.html');
    if (!existsSync(file)) { res.statusCode = 404; res.end(); return; }
    res.setHeader('Content-Type', MIME[extname(file)] || 'application/octet-stream');
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

const repoRoot = 'D:/ai/dev-worktrees/venturelabs/praxis-gerresheim/20261009-praxis-gerresheim-migrated-site-must-match-the-l';
const server = await listen(repoRoot + '/dist', 0);
const port = server.address().port;
const browser = await chromium.launch();
for (const width of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.locator('footer a', { hasText: 'Impressum' }).evaluate((el) => el.click());
  await page.waitForTimeout(300);
  const info = await page.evaluate(() => {
    const title = document.querySelector('.v-card-title');
    const text = document.querySelector('.v-card-text');
    const titleSpan = title.querySelector('span');
    const firstP = text.querySelector('p');
    const cs = (el) => {
      const c = getComputedStyle(el);
      return { padding: `${c.paddingTop} ${c.paddingRight} ${c.paddingBottom} ${c.paddingLeft}`, margin: `${c.marginTop} ${c.marginBottom}`, fontSize: c.fontSize, lineHeight: c.lineHeight, fontWeight: c.fontWeight };
    };
    return {
      title: cs(title),
      titleRect: title.getBoundingClientRect(),
      titleSpan: cs(titleSpan),
      titleSpanRect: titleSpan.getBoundingClientRect(),
      text: cs(text),
      textRect: text.getBoundingClientRect(),
      firstP: cs(firstP),
      firstPRect: firstP.getBoundingClientRect(),
      vApplication: !!title.closest('.v-application'), textMatches: (() => { try { return [...document.querySelectorAll('.v-card-text')].map(el => ({ cls: el.className, outer: el.outerHTML.slice(0,80), rules: (window.getMatchedCSSRules ? getMatchedCSSRules(el) : null) })); } catch(e) { return String(e); } })(),
    };
  });
  console.log('width', width, JSON.stringify(info, null, 2));
  await page.close();
}
await browser.close();
await new Promise((r) => server.close(r));
