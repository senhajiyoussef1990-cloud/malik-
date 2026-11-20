// Rendu d'une scène d'épisode à 30 images par seconde, avec les voix.
// node rendu_scene.js ep01 01 [--images 1,3]   -> sortie/EP01_scene01.mp4
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { spawn, execFileSync } = require('child_process');
const D = __dirname, FPS = 30;
const [ep, num] = process.argv.slice(2), ii = process.argv.indexOf('--images'), stills = ii >= 0 ? process.argv[ii + 1].split(',').map(Number) : null;
const EP = path.join(D, '..', ep), VOIX = path.join(EP, 'voix');
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
(async () => {
  // répliques de la scène, enchaînées avec une petite pause ; enveloppe de bouche à 30 i/s
  const lignes = JSON.parse(fs.readFileSync(path.join(EP, 'lignes.json'))).filter(l => l.scene === +num);
  const L = {}, BOUCHE = {}; let t = 0.5;
  for (const l of lignes) {
    const f = path.join(VOIX, l.id + '.mp3'), d = dur(f); L[l.id] = [t, d, l.who]; t += d + (l.pause ?? .5);
    const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', f, '-f', 's16le', '-ac', '1', '-ar', '24000', '-']);
    const a = new Int16Array(raw.buffer, raw.byteOffset, raw.length / 2), hop = 800, e = [];
    for (let i = 0; i + hop <= a.length; i += hop) { let q = 0; for (let j = i; j < i + hop; j++) q += (a[j] / 32768) ** 2; e.push(Math.sqrt(q / hop)); }
    const p95 = [...e].sort((x, y) => x - y)[Math.floor(e.length * .95)] || 1;
    BOUCHE[l.id] = e.map((v, i) => Math.min(1, ((e[i - 1] || v) * .25 + v * .5 + (e[i + 1] || v) * .25) / p95));
  }
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 810 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.setContent('<canvas id="c" width="1080" height="810"></canvas>');
  await pg.addScriptTag({ content: `const L = ${JSON.stringify(L)}; const BOUCHE = ${JSON.stringify(BOUCHE)};` });
  const estTV = fs.readFileSync(path.join(D, `${ep}/scene${num}.js`), 'utf8').includes('enNoirEtBlanc');
  for (const f of ['persos.js', 'decor.js', 'decor_boutique.js', 'decor_salon.js', 'humains.js', `${ep}/commun.js`, ...(estTV ? [`${ep}/tv.js`] : []), `${ep}/scene${num}.js`]) if (fs.existsSync(path.join(D, f))) await pg.addScriptTag({ path: path.join(D, f) });
  const img = (t) => pg.evaluate((t) => { const cv = document.getElementById('c'); frame(cv.getContext('2d'), t); return cv.toDataURL('image/jpeg', .93); }, t);
  const nom = `${ep.toUpperCase()}_scene${num}`;
  if (stills) {
    for (const s of stills) fs.writeFileSync(path.join(D, `travail/${nom}_${s}.jpg`), Buffer.from((await img(s)).split(',')[1], 'base64'));
  } else {
    const T = await pg.evaluate(() => DUREE), AUD = await pg.evaluate(() => AUDIO), tmp = path.join(D, `travail/${nom}_muet.mp4`);
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < Math.round(T * FPS); i++) { const d = await img(i / FPS); if (!ff.stdin.write(Buffer.from(d.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r)); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    const inp = [], fl = []; AUD.forEach(([id, st], k) => { inp.push('-i', path.join(VOIX, id + '.mp3')); const ms = Math.round(st * 1000); fl.push(`[${k + 1}]adelay=${ms}|${ms}[a${k}]`); });
    fl.push(AUD.map((_, k) => `[a${k}]`).join('') + `amix=inputs=${AUD.length}:normalize=0,apad,atrim=0:${T.toFixed(2)},loudnorm=I=-16:TP=-1.5[s]`);
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', tmp, ...inp, '-filter_complex', fl.join(';'), '-map', '0:v', '-map', '[s]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', path.join(D, `sortie/${nom}.mp4`)]);
    fs.writeFileSync(path.join(D, `travail/${nom}.json`), JSON.stringify({ dur: T, lignes: L }));
    console.log('ok', nom, T.toFixed(1), 's');
  }
  await b.close(); if (errs.length) { console.error('ERREURS', errs.slice(0, 3)); process.exit(1); }
})();
