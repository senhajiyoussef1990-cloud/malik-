// node rendu.js [--images 1,5,12]  -> sortie/essai.mp4 (avec les voix) ou travail/img_*.jpg
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { spawn, execFileSync } = require('child_process');
const D = __dirname, FPS = 24;
const args = process.argv.slice(2), ii = args.indexOf('--images'), stills = ii >= 0 ? args[ii + 1].split(',').map(Number) : null;
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 810 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.setContent('<canvas id="c" width="1080" height="810"></canvas>');
  await pg.addScriptTag({ content: 'const BOUCHE = ' + fs.readFileSync(path.join(D, 'travail/bouche.json')) + ';' });
  await pg.addScriptTag({ path: path.join(D, 'persos.js') }); await pg.addScriptTag({ path: path.join(D, 'scene_essai.js') });
  const img = (t) => pg.evaluate((t) => { const cv = document.getElementById('c'); frame(cv.getContext('2d'), t); return cv.toDataURL('image/jpeg', .92); }, t);
  if (stills) {
    for (const t of stills) fs.writeFileSync(path.join(D, `travail/img_${t}.jpg`), Buffer.from((await img(t)).split(',')[1], 'base64'));
  } else {
    const T = await pg.evaluate(() => DUREE), tmp = path.join(D, 'travail/essai_muet.mp4');
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', '30', tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < Math.round(T * FPS); i++) { const d = await img(i / FPS); if (!ff.stdin.write(Buffer.from(d.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r)); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', tmp, '-i', path.join(D, 'voix/renard.mp3'), '-i', path.join(D, 'voix/mouton.mp3'),
      '-filter_complex', '[1]adelay=400|400[a];[2]adelay=10000|10000[b];[a][b]amix=inputs=2:normalize=0,apad,loudnorm=I=-16[s]',
      '-map', '0:v', '-map', '[s]', '-shortest', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', path.join(D, 'sortie/essai_renard_mouton.mp4')]);
    console.log('ok', T, 's');
  }
  await b.close(); if (errs.length) { console.error('ERREURS', errs.slice(0, 3)); process.exit(1); }
})();
