// Vidéo de présentation de la page (≈ 10 s) : node tools/promo.js
// Prérequis : out/promo/a.wav et b.wav (voix clonée), out/promo/qc.qc.json (fin des mots).
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const root = path.join(__dirname, ".."), dir = path.join(root, "out", "promo"), ED = "2026-11-16-1";
const ff = (a) => execFileSync("ffmpeg", ["-nostdin", "-y", "-loglevel", "error", ...a]);
const dur = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const qc = JSON.parse(fs.readFileSync(path.join(dir, "qc.qc.json")));
const VINTAGE = "highpass=f=140,lowpass=f=6500,equalizer=f=2000:t=q:w=1:g=3,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,loudnorm=I=-16:TP=-1.5";
["a", "b"].forEach((k, i) => ff(["-i", path.join(dir, k + ".wav"), "-af", `atrim=0:${qc[i].end + 0.18},${VINTAGE}`, "-ar", "44100", "-ac", "1", path.join(dir, k + "-fit.wav")]));
const dA = dur(path.join(dir, "a-fit.wav")), dB = dur(path.join(dir, "b-fit.wav"));
const P = { a: [1.8, 1.8 + dA], b: [1.8 + dA + 0.35, 1.8 + dA + 0.35 + dB] };
P.dur = P.b[1] + 1.6;
const FPS = 24, n = Math.round(P.dur * FPS);
// voix + enveloppe de la bouche
const voice = path.join(dir, "voice.wav");
ff(["-i", path.join(dir, "a-fit.wav"), "-i", path.join(dir, "b-fit.wav"), "-filter_complex",
  `[0]adelay=${Math.round(P.a[0] * 1000)}:all=1[x];[1]adelay=${Math.round(P.b[0] * 1000)}:all=1[y];[x][y]amix=inputs=2:normalize=0,apad,atrim=0:${P.dur}`, "-ar", "44100", "-ac", "1", voice]);
const pcm = execFileSync("ffmpeg", ["-nostdin", "-loglevel", "error", "-i", voice, "-f", "s16le", "-ac", "1", "-ar", "24000", "-"], { maxBuffer: 1 << 26 });
const env = [];
for (let f = 0; f < n; f++) { let s = 0, c = 0; for (let j = f * 1000; j < (f + 1) * 1000 && j * 2 + 1 < pcm.length; j++) { const v = pcm.readInt16LE(j * 2) / 32768; s += v * v; c++; } env.push(c ? Math.sqrt(s / c) : 0); }
const mx = Math.max(...env) || 1; P.env = env.map((v) => Math.min(1, v / (mx * 0.6)));
// musique : le jingle et le début de la musique de l'édition (à partir de l'opening)
execFileSync("python3", ["-I", path.join(__dirname, "audio.py"), path.join(dir, "music-full.wav"), path.join(root, "out", `timeline-${ED}.js`)]);
global.window = {}; require(path.join(root, "out", `timeline-${ED}.js`));
ff(["-ss", String(window.TL.open), "-t", String(P.dur), "-i", path.join(dir, "music-full.wav"), "-af", `afade=t=out:st=${P.dur - 1}:d=1`, path.join(dir, "music.wav")]);
ff(["-i", path.join(dir, "music.wav"), "-i", voice, "-filter_complex",
  "[1]asplit=2[sc][v];[0][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=300[m];[m][v]amix=inputs=2:normalize=0:weights=0.8 1.25,loudnorm=I=-14:TP=-1.5", "-ar", "44100", path.join(dir, "mix.wav")]);
(async () => {
  const frames = path.join(dir, "frames"); fs.rmSync(frames, { recursive: true, force: true }); fs.mkdirSync(frames, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on("pageerror", (e) => console.error("pageerror:", e.message));
  await page.goto("file://" + path.join(root, "scene.html") + "?ed=" + ED);
  await page.evaluate(() => window.ready);
  await page.evaluate((P) => { window.__P = P; }, P);
  for (let f = 0; f < n; f++) {
    await page.evaluate((f) => window.renderPromo(f, window.__P), f);
    await page.screenshot({ path: path.join(frames, String(f).padStart(5, "0") + ".jpg"), type: "jpeg", quality: 92 });
  }
  await browser.close();
  ff(["-framerate", "24", "-i", path.join(frames, "%05d.jpg"), "-i", path.join(dir, "mix.wav"), "-c:v", "libx264", "-preset", "medium", "-crf", "22",
    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", path.join(root, "out", "page-presentation.mp4")]);
  fs.rmSync(frames, { recursive: true });
  console.log("promo ok", P.dur.toFixed(1), "s");
})();
