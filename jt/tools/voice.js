// Génère la piste voix de Maurice, la ligne de temps calée sur les répliques, et l'enveloppe de la bouche.
// Usage : node tools/voice.js AAAA-MM-JJ-N
//   → out/voice-ED.wav, out/voice-ED.js (bouche), out/timeline-ED.js (ligne de temps)
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const ed = process.argv[2] || "2026-11-15-1";
const root = path.join(__dirname, ".."), out = path.join(root, "out"), tmp = path.join(out, "voice-tmp");
fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp, { recursive: true });
global.window = {};
require(path.join(root, "timeline.js"));
require(path.join(root, "editions", ed + ".js"));
const BASE = window.TL, E = window.EDITION;
const strip = (l) => l.join(" ").replace(/\*/g, "");
const sh = (cmd, args, opt) => execFileSync(cmd, args, { ...opt, env: { ...process.env, HF_HUB_DISABLE_XET: "1" } });
const ff = (args) => sh("ffmpeg", ["-nostdin", "-y", "-loglevel", "error", ...args]);
const dur = (f) => parseFloat(sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());

// ---------- 1. les répliques ----------
const clips = [{ id: "hook", text: E.hookSay || strip(E.hook) }];
E.rubriques.forEach((r, i) => r.subs.forEach((s, k) => clips.push({ id: `r${i}s${k}`, text: (r.say && r.say[k]) || strip(s) })));
clips.push({ id: "question", text: E.questionSay || strip(E.question) });
clips.push({ id: "subscribe", text: E.subscribeSay || strip(E.subscribe) });
clips.forEach((c, i) => { c.raw = path.join(tmp, `g${i}.wav`); c.fit = path.join(tmp, `f${i}.wav`); });

// ---------- 2. synthèse ----------
const clone = E.voiceEngine === "clone";
const VINTAGE = "highpass=f=140,lowpass=f=6500,equalizer=f=2000:t=q:w=1:g=3,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,loudnorm=I=-16:TP=-1.5";
function synthClone(list, seed) {
  const job = path.join(tmp, `clone-${seed}.json`);
  fs.writeFileSync(job, JSON.stringify(list.map((c) => ({ text: c.text, out: c.raw, seed }))));
  sh("/root/venvs/cb/bin/python", [path.join(__dirname, "clone.py"), job], { stdio: ["ignore", "inherit", "ignore"] });
}
function qc(list) {
  const job = path.join(tmp, `qc.json`);
  fs.writeFileSync(job, JSON.stringify(list.map((c) => ({ wav: c.raw, text: c.text }))));
  sh("python3", [path.join(__dirname, "qc.py"), job], { stdio: ["ignore", "inherit", "ignore"] });
  return JSON.parse(fs.readFileSync(job.replace(".json", ".qc.json")));
}
if (clone) {
  let todo = clips, seed = 1930;
  for (let pass = 0; pass < 3 && todo.length; pass++, seed += 7) {
    synthClone(todo, seed);
    const r = qc(todo);
    todo.forEach((c, i) => { c.qc = r[i]; });
    const bad = todo.filter((c) => c.qc.score < 0.8);
    bad.forEach((c) => console.log(`  à refaire (${c.qc.score}) : « ${c.qc.heard} »`));
    if (pass < 2) todo = bad;
  }
  for (const c of clips) {
    // coupe ce qui suit le dernier mot (bruits parasites de fin de génération)
    const end = c.qc && c.qc.end > 0.5 ? c.qc.end + 0.18 : dur(c.raw);
    ff(["-i", c.raw, "-af", `atrim=0:${end},afade=t=out:st=${Math.max(0, end - 0.06)}:d=0.06,${VINTAGE}`, "-ar", "44100", "-ac", "1", c.fit]);
  }
} else {
  for (const c of clips) {
    sh(path.join(__dirname, "reclame.sh"), [E.voice || "fr_FR-tom-medium", c.raw, c.text]);
    ff(["-i", c.raw, "-af", "areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse", c.fit]);
  }
}
clips.forEach((c) => { c.d = dur(c.fit); });

// ---------- 3. ligne de temps calée sur les répliques ----------
const GAP = 0.35, LEAD = 0.05, MINW = 2.4;
const win = (d) => Math.max(MINW, LEAD + d + GAP);
const byId = Object.fromEntries(clips.map((c) => [c.id, c]));
const TL = { ...BASE };
const hook = byId.hook;
hook.t = 0.4;
TL.open = Math.max(3.0, hook.t + hook.d + 0.3);
TL.hookSub = [0.35, TL.open - 0.05];
TL.rub = TL.open + 1.5;
TL.rubStarts = []; TL.rubLens = []; TL.rubSubsList = [];
let S = TL.rub;
E.rubriques.forEach((r, i) => {
  let x = 1.0;
  const W = [];
  r.subs.forEach((_, k) => {
    const c = byId[`r${i}s${k}`], w = win(c.d);
    c.t = S + x + LEAD;
    W.push([x, x + w]);
    x += w;
  });
  TL.rubStarts.push(S); TL.rubLens.push(x + 0.3); TL.rubSubsList.push(W);
  S += x + 0.3;
});
TL.outro = S;
const q = byId.question, sb = byId.subscribe;
const wq = win(q.d) + 0.1, ws = win(sb.d);
q.t = S + 0.1 + LEAD; sb.t = S + 0.1 + wq + LEAD;
TL.outroSubs = [[0.1, 0.1 + wq], [0.1 + wq, 0.1 + wq + ws]];
TL.outroRight = 0.1 + wq;
TL.outroSalute = 0.1 + wq + ws - 0.1;
TL.outroLen = TL.outroSalute + 0.75;
const DUR = TL.outro + TL.outroLen;
TL.duration = DUR;
fs.writeFileSync(path.join(out, `timeline-${ed}.js`), "// Généré par tools/voice.js\nwindow.TL = " + JSON.stringify(TL) + ";\n");
for (const c of clips) console.log(`${c.t.toFixed(2)}s  ${c.d.toFixed(2)}s  ${c.text.replace(/\|/g, " ")}`);
console.log(`durée totale : ${DUR.toFixed(1)} s`);

// ---------- 4. piste voix + bouche ----------
const wav = path.join(out, `voice-${ed}.wav`);
ff([...clips.flatMap((c) => ["-i", c.fit]), "-filter_complex",
  clips.map((c, i) => `[${i}]adelay=${Math.round(c.t * 1000)}:all=1[d${i}]`).join(";") + ";" +
  clips.map((_, i) => `[d${i}]`).join("") + `amix=inputs=${clips.length}:normalize=0,apad,atrim=0:${DUR}`, "-ar", "44100", "-ac", "1", wav]);
const pcm = sh("ffmpeg", ["-nostdin", "-loglevel", "error", "-i", wav, "-f", "s16le", "-ac", "1", "-ar", "24000", "-"], { maxBuffer: 1 << 28 });
const per = 24000 / BASE.fps, n = Math.round(DUR * BASE.fps), env = [];
for (let f = 0; f < n; f++) {
  let s = 0, c = 0;
  for (let j = Math.floor(f * per); j < Math.floor((f + 1) * per) && j * 2 + 1 < pcm.length; j++) { const v = pcm.readInt16LE(j * 2) / 32768; s += v * v; c++; }
  env.push(c ? Math.sqrt(s / c) : 0);
}
const mx = Math.max(...env) || 1;
fs.writeFileSync(path.join(out, `voice-${ed}.js`), "window.VOICE_ENV=" + JSON.stringify(env.map((v) => +(Math.min(1, v / (mx * 0.6))).toFixed(2))) + ";\n");
fs.rmSync(tmp, { recursive: true });
console.log("voix ok", wav);
