// Planche de personnages : node planche.js -> travail/planche.png
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1200, height: 1100 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.setContent('<canvas id="c" width="1200" height="1100"></canvas>');
  await pg.addScriptTag({ path: path.join(__dirname, 'persos.js') });
  const d = await pg.evaluate(() => {
    const c = document.getElementById('c').getContext('2d');
    c.fillStyle = '#ffffff'; c.fillRect(0, 0, 1200, 1100);
    drawRenard(c, { x: 330, y: 1050, s: 1.0, t: 0 });
    drawMouton(c, { x: 860, y: 1050, s: 1.0, t: 0, froncer: .7 });
    return document.getElementById('c').toDataURL('image/png');
  });
  fs.writeFileSync(path.join(__dirname, 'travail/planche.png'), Buffer.from(d.split(',')[1], 'base64'));
  if (errs.length) console.log('ERREURS', errs);
  await b.close();
})();
