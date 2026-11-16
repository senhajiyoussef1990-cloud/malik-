// Rend les scènes dessinées en code (code/scenes.js) avec Chromium sans tête.
// Usage : node code/rendu.js 2 [3 ...] [--images 0.5,2,4]   -> travail/code_S<n>.mp4 (1080x810)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const R = path.resolve(__dirname, '..'), FPS = 24;
let args = process.argv.slice(2), stills = null;
const ii = args.indexOf('--images'); if (ii >= 0) { stills = args[ii + 1].split(',').map(Number); args.splice(ii, 2); }
const plans = JSON.parse(fs.readFileSync(`${R}/travail/plans.json`)), bouche = JSON.parse(fs.readFileSync(`${R}/code/bouche.json`));
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 810 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto(`file://${R}/code/index.html`); await pg.evaluate(([a, c]) => init(a, c), [plans, bouche]);
  for (const n of args.map(Number)) {
    const s = plans.find(x => x.n === n), T = s.dur;
    if (stills) {
      for (const t of stills) { const d = await pg.evaluate(([n, t]) => renderFrame(n, t), [n, t]); fs.writeFileSync(`${R}/travail/code_S${String(n).padStart(2, '0')}_${t.toFixed(1)}.jpg`, Buffer.from(d.split(',')[1], 'base64')); }
      continue;
    }
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast',
      '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', `${R}/travail/code_S${String(n).padStart(2, '0')}.mp4`], { stdio: ['pipe', 'inherit', 'inherit'] });
    const N = Math.round(T * FPS);
    for (let i = 0; i < N; i++) {
      const d = await pg.evaluate(([n, t]) => renderFrame(n, t), [n, i / FPS]);
      if (!ff.stdin.write(Buffer.from(d.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); console.log(`ok scène ${n} ${T.toFixed(1)}s`);
  }
  await b.close();
  if (errs.length) { console.error('ERREURS JS :', errs.slice(0, 3)); process.exit(1); }
})();
