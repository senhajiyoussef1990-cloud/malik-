// Scène d'essai : la boutique, le renard parle, le mouton répond.
// window.frame(t) dessine l'image au temps t (secondes). Voix : renard 0.4 s -> 9.4 s, mouton 10.0 s -> 17.5 s.
const W = 1080, H = 810, BEAT = 60 / 128;
const T_R = 0.4, T_M = 10.0, DUREE = 18.6;
const step = (t) => Math.floor(t * 30) / 30;                 // 30 dessins par seconde
const bnc = (t, ph = 0) => Math.abs(Math.sin(Math.PI * (t / BEAT + ph)));
function wob(t, f, a, ph = 0) { return Math.sin(t * f * Math.PI * 2 + ph) * a; }
function seg(t, a, b) { return clamp((t - a) / (b - a)); }
function bouchePour(n, t0, t) { const e = BOUCHE[n] || [], k = Math.floor((t - t0) * 30); return k >= 0 && k < e.length ? Math.min(1, e[k] * 1.15) : 0; }

// ------------------------------------------------ décor : boutique de chapeaux, lumière chaude
function boutique(c, t) {
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#4a2212'); g.addColorStop(.62, '#7a3e1c'); g.addColorStop(1, '#3a1a0a');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  // boiseries murales
  for (let x = 20; x < W; x += 180) { c.fillStyle = 'rgba(40,16,6,.35)'; c.fillRect(x, 60, 150, 470); ink(c, 3, 'rgba(30,10,4,.6)'); c.strokeRect(x, 60, 150, 470); }
  // étagères avec chapeaux et boîtes
  const COLS = ['#b5532f', '#e2c38f', '#8a3a2a', '#d99a5a', '#6e4a3a', '#efd9b0', '#9a6a3a'];
  for (let r = 0; r < 3; r++) {
    const sy = 175 + r * 140;
    F(c, poly([[0, sy], [W, sy], [W, sy + 16], [0, sy + 16]]), '#5a2a12', 3);
    for (let k = 0; k < 10; k++) {
      const x = 60 + k * 104 + (r % 2) * 46, col = COLS[(k + r * 3) % COLS.length];
      if ((k + r) % 3 === 0) { F(c, poly([[x - 36, sy], [x + 36, sy], [x + 32, sy - 52], [x - 32, sy - 52]]), col, 3); ink(c, 2, '#f3e2bf'); c.beginPath(); c.moveTo(x - 32, sy - 30); c.lineTo(x + 32, sy - 30); c.stroke(); }
      else { F(c, ell(x, sy - 6, 42, 10), col, 3); F(c, smooth([[x - 26, sy - 8], [x - 20, sy - 46], [x + 20, sy - 46], [x + 26, sy - 8]]), col, 3); F(c, ell(x + 10, sy - 30, 11, 6), COLS[(k + 4) % 7], 2); }
    }
  }
  // lampes suspendues qui respirent
  for (const lx of [300, 800]) {
    ink(c, 3); c.beginPath(); c.moveTo(lx, 0); c.lineTo(lx, 46); c.stroke();
    const gl = c.createRadialGradient(lx, 80, 10, lx, 300, 460), a = .26 + .04 * Math.sin(t * 2.4 + lx);
    gl.addColorStop(0, `rgba(255,214,140,${a})`); gl.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = gl; c.fillRect(lx - 460, 0, 920, 760);
    F(c, poly([[lx - 52, 88], [lx - 22, 46], [lx + 22, 46], [lx + 52, 88]]), '#b07a3a', 4); F(c, ell(lx, 90, 16, 9), '#fff1c4', 3);
  }
  // parquet
  c.fillStyle = '#5b2e14'; c.fillRect(0, 640, W, H - 640);
  ink(c, 2, '#3e1d0b'); for (let k = 0; k < 16; k++) { c.beginPath(); c.moveTo(k * 90 - 80, H); c.lineTo(k * 76 + 30, 640); c.stroke(); }
  ink(c, 4); c.beginPath(); c.moveTo(0, 640); c.lineTo(W, 640); c.stroke();
}
function comptoir(c, x0, x1, y) {
  F(c, poly([[x0, y], [x1, y], [x1 + 12, y + 26], [x0 - 12, y + 26]]), '#c08a4c', 5);
  F(c, poly([[x0, y + 26], [x1, y + 26], [x1, H + 20], [x0, H + 20]]), '#6b3618', 5);
  c.fillStyle = 'rgba(255,240,210,.16)'; c.fillRect(x0 + 22, y + 44, x1 - x0 - 44, 120); ink(c, 3); c.strokeRect(x0 + 22, y + 44, x1 - x0 - 44, 120);
  for (let k = 0; k < 5; k++) { const hx = x0 + 70 + k * (x1 - x0 - 140) / 4; const col = ['#e2c38f', '#8a3a2a', '#d99a5a'][k % 3];
    F(c, ell(hx, y + 150, 32, 8), col, 3); F(c, smooth([[hx - 20, y + 148], [hx - 15, y + 116], [hx + 15, y + 116], [hx + 20, y + 148]]), col, 3); }
}
function bocal(c, x, y, s, t, brille) {                 // le produit posé sur le comptoir
  c.save(); c.translate(x, y); c.scale(s, s);
  if (brille) { const g = c.createRadialGradient(0, -60, 10, 0, -60, 150); g.addColorStop(0, 'rgba(255,230,150,.55)'); g.addColorStop(1, 'rgba(255,230,150,0)'); c.fillStyle = g; c.fillRect(-160, -220, 320, 260); }
  F(c, smooth([[-50, 0], [-56, -70], [-46, -104], [46, -104], [56, -70], [50, 0]]), '#f2e1b8', 5);
  F(c, poly([[-50, -104], [50, -104], [46, -124], [-46, -124]]), '#c0502a', 4); F(c, ell(0, -128, 22, 8), '#d9a04a', 3);
  F(c, ell(0, -58, 30, 24), '#b8471c', 3); ink(c, 2, '#f6e5cc'); c.beginPath(); c.arc(0, -58, 16, .4, 2.7); c.stroke();
  c.restore();
}
// ------------------------------------------------ pellicule
function pellicule(c, t) {
  const fi = Math.floor(t * 24), r = (k) => hash(fi * 31 + k);
  c.fillStyle = `rgba(255,245,220,${.02 + r(1) * .05})`; c.fillRect(0, 0, W, H);
  c.fillStyle = `rgba(0,0,0,${r(2) * .05})`; c.fillRect(0, 0, W, H);
  ink(c, 1.5, 'rgba(255,250,235,.3)'); const x = hash(Math.floor(t * 6) * 7) * W; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 5, H); c.stroke();
  c.fillStyle = 'rgba(20,14,10,.55)'; for (let k = 0; k < 10; k++) { c.beginPath(); c.arc(r(10 + k) * W, r(40 + k) * H, 1 + r(70 + k) * 2.4, 0, 7); c.fill(); }
  const vg = c.createRadialGradient(W / 2, H / 2, H * .38, W / 2, H / 2, H * .88); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.5)'); c.fillStyle = vg; c.fillRect(0, 0, W, H);
}
function camera(c, t) {
  // plan large -> rapproché sur le renard pendant sa réplique -> sur le mouton -> plan large
  const keys = [[0, 540, 405, 1.0], [T_R + 0.3, 420, 380, 1.22], [T_R + 6, 450, 380, 1.18], [T_M - 0.2, 650, 400, 1.25], [T_M + 7.4, 640, 400, 1.2], [DUREE, 540, 405, 1.02]];
  let k = keys[0];
  for (let i = 1; i < keys.length; i++) { const a = keys[i - 1], b = keys[i]; if (t >= b[0]) { k = b; continue; } const u = ease((t - a[0]) / Math.min(1.2, b[0] - a[0])); k = [0, lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u)]; break; }
  let [, cx, cy, z] = k; cx = clamp(cx, W / (2 * z), W - W / (2 * z)); cy = clamp(cy, H / (2 * z), H - H / (2 * z));
  c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-cx, -cy);
}

// ------------------------------------------------ jeu des personnages
function renardPose(t) {
  const tq = step(t), l = t - T_R, parle = l >= 0 && l < 9;
  const P = { x: 360, y: 760, s: .62, t: tq, talk: parle ? bouchePour('renard', T_R, t) : 0, lid: .5, blink: (t % 3.3) < .1 ? 1 : 0, look: [.6, 0] };
  P.tilt = wob(tq, .35, .04); P.handL = [-104, -440]; P.handR = [104, -440];
  if (l >= 0 && l < 2) {               // « Tu crois avoir tes propres goûts ? » : il tapote sa tempe
    const u = ease(seg(l, 0, .5)); P.handR = [lerp(104, 70, u), lerp(-440, -880, u) + wob(tq, 3, 8 * u)]; P.sourcil = 1; P.tilt = -.06;
  } else if (l >= 2 && l < 6) {        // « Alors explique-moi pourquoi… » : main ouverte, paume tendue
    const u = ease(seg(l, 2, 2.6)); P.handR = [lerp(70, 200, u), lerp(-880, -650, u) + wob(tq, 1.2, 14)]; P.handL = [-104, -440]; P.tilt = .05 + wob(tq, 1.1, .04); P.look = [.9, 0];
  } else if (l >= 6 && l < 9) {        // « D'ailleurs, celui-ci… tout le monde se l'arrache ! » : il présente le bocal
    const u = ease(seg(l, 6, 6.5)); P.handR = [lerp(200, 250, u), lerp(-650, -560, u) + wob(tq, .8, 6)]; P.handL = [lerp(-104, -150, u), lerp(-440, -620, u)]; P.lid = .62; P.sourcil = .6; P.look = [1, .3];
  } else if (t > T_M) {                // il écoute le mouton, l'air satisfait
    P.look = [1, 0]; P.lid = .6; P.handL = [-104, -440]; P.handR = [104, -440];
  }
  P.bob = parle ? bnc(tq, .5) * 8 : bnc(tq, .5) * 3;
  return P;
}
function moutonPose(t) {
  const tq = step(t), l = t - T_M;
  const P = { x: 800, y: 790, s: .58, t: tq, face: -1, talk: (l >= 0 && l < 7.5) ? bouchePour('mouton', T_M, t) : 0, look: [-.6, 0], blink: (t % 2.8) < .1 ? 1 : 0, froncer: .5, sourire: .3 };
  P.handL = [-118, -360]; P.handR = [118, -360]; P.tilt = wob(tq, .4, .03);
  if (t < T_M) { P.look = [-.8, 0]; P.froncer = .3; }                                   // il écoute le renard
  if (l >= 0 && l < .9) { P.handR = [40, -540]; P.handL = [-118, -360]; P.froncer = .2; }          // « Moi ? » : main sur la poitrine
  else if (l >= .9 && l < 2.2) { P.tilt = wob(tq, 3.2, .12); P.handR = [130, -470]; P.handL = [-130, -470]; P.froncer = .9; }   // « Personne ne m'influence ! » : non de la tête
  else if (l >= 2.2 && l < 2.7) { P.rire = true; P.tilt = -.12; P.handR = [60, -420]; P.handL = [-60, -420]; }            // « Ha ha ! »
  else if (l >= 2.7 && l < 4.8) { P.handR = [lerp(150, 220, Math.abs(Math.sin(tq * 6))), -600]; P.froncer = .7; P.sourire = .8; }  // « Même gratuitement… » : geste de la main, dédaigneux
  else if (l >= 4.8 && l < 7.6) { P.lean = .1; P.handR = [70, -470]; P.handL = [10, -480]; P.froncer = 0; P.look = [-1, .4]; P.oreille = .15; }  // « Ah bon ? Attends… il coûte combien ? » : penché, intéressé
  P.bob = (l >= 2.2 && l < 2.7) ? Math.abs(Math.sin(tq * 14)) * 16 : bnc(tq, .25) * 4;
  return P;
}
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
  c.save(); camera(c, t);
  boutique(c, t);
  const R = renardPose(t), M = moutonPose(t);
  c.save(); c.translate(0, -R.bob); drawRenard(c, R); c.restore();
  comptoir(c, 150, 640, 560);
  bocal(c, 470, 560, .9, t, t > T_R + 6 && t < T_M + 7.6);
  c.save(); c.translate(0, -M.bob); drawMouton(c, M); c.restore();
  c.restore();
  pellicule(c, t);
}
