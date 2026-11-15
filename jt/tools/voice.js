// Génère la piste voix de Maurice et l'enveloppe pour la bouche.
// Usage : node tools/voice.js AAAA-MM-JJ-N  → out/voice-ED.wav et out/voice-ED.js
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const ed = process.argv[2] || "2026-11-15-1";
const root = path.join(__dirname, ".."), out = path.join(root, "out"), tmp = path.join(out, "voice-tmp");
fs.mkdirSync(tmp, { recursive: true });
global.window = {};
require(path.join(root, "timeline.js"));
require(path.join(root, "editions", ed + ".js"));
const TL = window.TL, E = window.EDITION;
const T_OUTRO = TL.rub + 3 * TL.rubLen, DUR = T_OUTRO + TL.outroLen;
const strip = (l) => l.join(" ").replace(/\*/g, "");

const clips = [];
clips.push({ t: TL.hookVoice[0], max: TL.hookVoice[1], text: E.hookSay || strip(E.hook) });
E.rubriques.forEach((r, i) => TL.rubVoice.forEach(([a, m], k) =>
  clips.push({ t: TL.rub + i * TL.rubLen + a, max: m, text: (r.say && r.say[k]) || strip(r.subs[k]) })));
clips.push({ t: T_OUTRO + TL.outroVoice[0][0], max: TL.outroVoice[0][1], text: E.questionSay || strip(E.question) });
clips.push({ t: T_OUTRO + TL.outroVoice[1][0], max: TL.outroVoice[1][1], text: E.subscribeSay || strip(E.subscribe) });

const dur = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const inputs = [], filters = [];
clips.forEach((c, i) => {
  const raw = path.join(tmp, `c${i}.wav`), fit = path.join(tmp, `f${i}.wav`);
  execFileSync(path.join(__dirname, "reclame.sh"), [E.voice || "fr_FR-tom-medium", raw, c.text]);
  // retire le silence de fin, puis accélère si la réplique dépasse sa fenêtre
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", raw, "-af", "areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse", fit]);
  let d = dur(fit), k = 1;
  if (d > c.max) { k = Math.min(1.35, d / c.max); execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", fit, "-af", `atempo=${k.toFixed(3)}`, raw]); fs.renameSync(raw, fit); }
  console.log(`${c.t.toFixed(2)}s  ${d.toFixed(2)}s${k > 1 ? " x" + k.toFixed(2) : ""}${d / k > c.max + 0.05 ? "  (déborde)" : ""}  ${c.text}`);
  inputs.push("-i", fit);
  filters.push(`[${i}]adelay=${Math.round(c.t * 1000)}:all=1[d${i}]`);
});
const wav = path.join(out, `voice-${ed}.wav`);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex",
  filters.join(";") + ";" + clips.map((_, i) => `[d${i}]`).join("") + `amix=inputs=${clips.length}:normalize=0,apad,atrim=0:${DUR}`, "-ar", "44100", "-ac", "1", wav]);

// enveloppe par image (0..1) pour la bouche
const pcm = execFileSync("ffmpeg", ["-loglevel", "error", "-i", wav, "-f", "s16le", "-ac", "1", "-ar", "24000", "-"], { maxBuffer: 1 << 28 });
const per = 24000 / TL.fps, n = Math.round(DUR * TL.fps), env = [];
for (let f = 0; f < n; f++) {
  let s = 0, c = 0;
  for (let j = Math.floor(f * per); j < Math.floor((f + 1) * per) && j * 2 + 1 < pcm.length; j++) { const v = pcm.readInt16LE(j * 2) / 32768; s += v * v; c++; }
  env.push(c ? Math.sqrt(s / c) : 0);
}
const mx = Math.max(...env) || 1;
fs.writeFileSync(path.join(out, `voice-${ed}.js`), "window.VOICE_ENV=" + JSON.stringify(env.map((v) => +(Math.min(1, v / (mx * 0.6))).toFixed(2))) + ";\n");
fs.rmSync(tmp, { recursive: true });
console.log("voix ok", wav);
