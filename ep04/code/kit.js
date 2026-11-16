// Kit de dessin « rubber hose 1930 » : primitives, personnages articulés, pellicule.
// Inspiré des techniques publiées par huashu-art-motion (MIT) : œil pie-cut, bras tuyau, gant blanc, rebond sur le tempo.
const W = 1080, H = 810, BEAT = 60 / 128;
const INK = '#16110d';
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
const bnc = (tq, ph = 0) => Math.abs(Math.sin(Math.PI * (tq / BEAT + ph)));
const step = (t) => Math.floor(t * 12) / 12;                      // « sur 2 »
function hash(n) { const s = Math.sin(n * 12.9898) * 43758.5453; return s - Math.floor(s); }

function ink(c, w = 5) { c.strokeStyle = INK; c.lineWidth = w; c.lineJoin = 'round'; c.lineCap = 'round'; }
function F(c, p, col, w = 5) { c.fillStyle = col; c.fill(p); if (w) { ink(c, w); c.stroke(p); } }
function ell(x, y, rx, ry, a = 0) { const p = new Path2D(); p.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), a, 0, Math.PI * 2); return p; }
function poly(pts, close = true) { const p = new Path2D(); p.moveTo(...pts[0]); for (const q of pts.slice(1)) p.lineTo(...q); if (close) p.closePath(); return p; }
// courbe lisse fermée passant par les points (Catmull-Rom)
function smooth(pts, closed = true) {
  const p = new Path2D(), n = pts.length, g = (i) => pts[(i + n) % n];
  p.moveTo(...pts[0]);
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    p.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
  }
  if (closed) p.closePath(); return p;
}
// bras / jambe « tuyau d'arrosage » : une courbe sans coude, épaisseur constante
function hose(c, A, B, bend, w, col) {
  const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1;
  const C = [mx - dy / L * bend, my + dx / L * bend];
  c.lineCap = 'round'; c.strokeStyle = INK; c.lineWidth = w + 9;
  c.beginPath(); c.moveTo(...A); c.quadraticCurveTo(...C, ...B); c.stroke();
  c.strokeStyle = col; c.lineWidth = w; c.stroke();
}
// œil pie-cut (avec paupière mi-close possible)
function pieEye(c, x, y, rx, ry, lookX = 0, lookY = 0, blink = 0, lid = 0, lidCol = null) {
  if (blink > 0.5) { ink(c, 4); c.beginPath(); c.ellipse(x, y + ry * .2, rx, ry * .45, 0, .2, Math.PI - .2); c.stroke(); return; }
  F(c, ell(x, y, rx, ry), '#fbf8ef', 4);
  const px = x + lookX * rx * .35, py = y + ry * .2 + lookY * ry * .25;
  c.save(); c.clip(ell(x, y, rx, ry));
  c.fillStyle = INK; c.beginPath(); c.ellipse(px, py, rx * .6, ry * .68, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#fbf8ef'; c.beginPath(); c.moveTo(px, py); c.arc(px, py, ry, -1.45, -.85); c.closePath(); c.fill();
  if (lid > 0) { c.fillStyle = lidCol || '#c8662e'; c.fillRect(x - rx - 2, y - ry - 2, rx * 2 + 4, (ry * 2 + 4) * lid); ink(c, 4); c.beginPath(); c.moveTo(x - rx, y - ry + ry * 2 * lid); c.lineTo(x + rx, y - ry + ry * 2 * lid); c.stroke(); }
  c.restore(); ink(c, 4); c.stroke(ell(x, y, rx, ry));
}
// gant blanc à 4 doigts (ang = direction du poignet vers les doigts)
function glove(c, x, y, ang, s = 1, col = '#fbf8ef', open = 1) {
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);
  F(c, smooth([[-6, -16], [12, -20], [26, -12], [30, 2], [22, 16], [4, 18], [-10, 12], [-14, -2]]), col, 4);
  for (let k = 0; k < 3; k++) F(c, ell(28 + open * 6, -10 + k * 9, 10 * (0.6 + .4 * open), 6), col, 4);
  F(c, ell(10, -20, 6, 9, -.6), col, 4);
  F(c, smooth([[-8, -18], [-22, -22], [-26, 0], [-22, 22], [-8, 18], [-4, 0]]), col, 4);
  ink(c, 2.5); [-2, 6, 14].forEach(xx => { c.beginPath(); c.moveTo(xx - 6, -6); c.lineTo(xx, 6); c.stroke(); });
  c.restore();
}
function shoe(c, x, y, dir = 1, col = '#1c1612') {
  F(c, smooth([[x - 22 * dir, y], [x - 16 * dir, y - 18], [x + 10 * dir, y - 20], [x + 34 * dir, y - 10], [x + 38 * dir, y + 4], [x, y + 8]]), col, 4);
  c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(x + 18 * dir, y - 12, 9, 4, 0, 0, 7); c.fill();
}
// bouche : ouverture 0..1 (synchronisée sur l'enveloppe de la voix)
function mouth(c, x, y, w, open, smile = 1, tongue = '#c24a4a') {
  if (open < 0.08) { ink(c, 4); c.beginPath(); c.arc(x, y - w * .5 * smile, w * .6, .35, Math.PI - .35); c.stroke(); return; }
  const h = w * (0.25 + open * 0.9);
  const p = new Path2D(); p.moveTo(x - w * .6, y - 4 * smile); p.quadraticCurveTo(x, y - 8 * smile + 4, x + w * .6, y - 4 * smile);
  p.quadraticCurveTo(x + w * .3, y + h, x, y + h); p.quadraticCurveTo(x - w * .3, y + h, x - w * .6, y - 4 * smile); p.closePath();
  F(c, p, '#3a1410', 4);
  c.save(); c.clip(p); c.fillStyle = tongue; c.beginPath(); c.ellipse(x, y + h * .95, w * .32, h * .35, 0, 0, 7); c.fill(); c.restore();
}
// rebond « boing » autour du point au sol
function boing(c, ax, ay, b, amp, k, fn) {
  c.save(); c.translate(ax, ay - b * amp);
  const sq = (1 - b) ** 4 * 0.08 * k, st = b * 0.04 * k;
  c.scale(1 + sq - st * .6, 1 - sq + st); c.translate(-ax, -ay); fn(); c.restore();
}
function wobble(t, f = 1, a = 1, ph = 0) { return Math.sin(t * f * Math.PI * 2 + ph) * a; }

// ============================================================ PERSONNAGES
// Toutes les poses : { x, y (point au sol), s (échelle), face (1 = regarde à droite, -1 à gauche),
//   talk (0..1 ouverture bouche), laugh (0..1), look:[x,y], blink, tilt (rad), lean,
//   handL:[x,y], handR:[x,y] (relatives aux épaules, en unités ×s), walk (phase, 0 = immobile), bob }

// ---------- LE MOUTON (couleur) : laine blanche, casquette plate, gilet tricoté, nœud papillon
function drawMouton(c, P) {
  const s = P.s || 1, f = P.face || 1, x = P.x, y = P.y;
  const LAINE = '#f6f1e6', PEAU = '#f0d6bc', GILET = '#a3532a', GILET2 = '#7e3d1d', CHEM = '#f3e6cc', PANT = '#7a4a2b', CASQ = '#7b4a28';
  c.save(); c.translate(x, y); c.scale(s * f, s);
  const lean = P.lean || 0, tilt = P.tilt || 0;
  const hipY = -150, shY = -300, headY = -400 - (P.laugh || 0) * 6;
  // jambes
  const wk = P.walk || 0;
  for (const sd of [-1, 1]) {
    const ph = wk ? Math.sin(wk + (sd > 0 ? Math.PI : 0)) : 0;
    const hip = [sd * 26, hipY], foot = [sd * 32 + ph * 40, -18 - Math.max(0, ph) * 18];
    hose(c, hip, foot, sd * 6 - ph * 10, 34, PANT); shoe(c, foot[0], foot[1] + 6, 1, '#3b2414');
  }
  c.save(); c.translate(0, hipY); c.rotate(lean); c.translate(0, -hipY);
  // bras arrière
  const hR = P.handR || [70, 120], hL = P.handL || [-70, 120];
  hose(c, [-48, shY + 20], [-48 + hL[0], shY + 20 + hL[1]], 14, 26, CHEM);
  glove(c, -48 + hL[0], shY + 20 + hL[1], Math.atan2(hL[1], hL[0]), .9, PEAU);
  // corps : chemise + gilet tricoté
  F(c, smooth([[-60, shY], [60, shY], [66, hipY + 10], [-66, hipY + 10]]), CHEM, 5);
  const g = smooth([[-58, shY + 8], [-14, shY + 40], [0, shY + 80], [14, shY + 40], [58, shY + 8], [64, hipY + 20], [0, hipY + 34], [-64, hipY + 20]]);
  F(c, g, GILET, 5);
  c.save(); c.clip(g); ink(c, 2); c.strokeStyle = GILET2;
  for (let xx = -70; xx < 70; xx += 14) for (let yy = shY; yy < hipY + 40; yy += 16) { c.beginPath(); c.moveTo(xx, yy); c.lineTo(xx + 7, yy + 8); c.lineTo(xx + 14, yy); c.stroke(); }
  c.restore(); ink(c, 5); c.stroke(g);
  [shY + 100, shY + 130].forEach(by => F(c, ell(0, by, 6, 6), '#e2c08a', 3));
  // laine du cou
  for (let k = -3; k <= 3; k++) F(c, ell(k * 20, shY + 2 + Math.abs(k) * 2, 22, 18), LAINE, 4);
  // nœud papillon
  F(c, poly([[0, shY + 10], [-30, shY - 6], [-30, shY + 26]]), '#8b2a1d', 4);
  F(c, poly([[0, shY + 10], [30, shY - 6], [30, shY + 26]]), '#8b2a1d', 4); F(c, ell(0, shY + 10, 8, 8), '#a8382a', 3);
  // tête
  c.save(); c.translate(0, headY + 60); c.rotate(tilt - (P.laugh || 0) * .25); c.translate(0, -(headY + 60));
  for (const sd of [-1, 1]) F(c, smooth([[sd * 50, headY - 10], [sd * 96, headY + 6], [sd * 104, headY + 26], [sd * 54, headY + 20]]), '#e8c3a0', 4);   // oreilles tombantes
  for (let k = 0; k < 9; k++) { const a = Math.PI * (k / 8) + Math.PI; F(c, ell(Math.cos(a) * 60, headY - 20 + Math.sin(a) * 54, 26, 22), LAINE, 4); }   // laine du crâne
  F(c, smooth([[-46, headY - 30], [-20, headY - 56], [26, headY - 54], [60, headY - 20], [76, headY + 30], [60, headY + 74], [16, headY + 88], [-30, headY + 70], [-50, headY + 20]]), PEAU, 5);   // museau long
  pieEye(c, -6, headY - 6, 16, 22, (P.look || [0, 0])[0] + .4, (P.look || [0, 0])[1], P.blink || (P.laugh > .5 ? 1 : 0));
  pieEye(c, 34, headY - 8, 16, 22, (P.look || [0, 0])[0] + .4, (P.look || [0, 0])[1], P.blink || (P.laugh > .5 ? 1 : 0));
  F(c, ell(58, headY + 34, 10, 7), '#9c4a4a', 3);                                                                   // nez
  mouth(c, 40, headY + 58, 30, Math.max(P.talk || 0, (P.laugh || 0) * (0.6 + .4 * Math.abs(Math.sin((P.t || 0) * 18)))), 1);
  // casquette plate
  F(c, smooth([[-62, headY - 52], [-30, headY - 86], [30, headY - 92], [76, headY - 66], [80, headY - 44], [-50, headY - 38]]), CASQ, 5);
  F(c, smooth([[20, headY - 50], [80, headY - 58], [108, headY - 46], [70, headY - 36]]), '#5f3518', 4);
  ink(c, 2.5); c.strokeStyle = '#5f3518'; for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(k * 22, headY - 84); c.lineTo(k * 26 + 8, headY - 44); c.stroke(); }
  c.restore();
  // bras avant
  hose(c, [48, shY + 20], [48 + hR[0], shY + 20 + hR[1]], -14, 26, CHEM);
  glove(c, 48 + hR[0], shY + 20 + hR[1], Math.atan2(hR[1], hR[0]), .9, PEAU);
  c.restore(); c.restore();
}

// ---------- LE RENARD (couleur) : fourrure orange, costume trois-pièces rayé, cravate rouille
function drawRenard(c, P) {
  const s = P.s || 1, f = P.face || 1, x = P.x, y = P.y;
  const ROUX = '#c8662e', ROUX2 = '#9a4a1e', BLANC = '#f6efe2', COST = '#2e2723', RAY = '#4a403a';
  c.save(); c.translate(x, y); c.scale(s * f, s);
  const hipY = -170, shY = -330, headY = -430;
  const t = P.t || 0;
  // queue (derrière)
  const sw = wobble(t, .7, .25);
  c.save(); c.translate(-40, hipY + 20); c.rotate(-.6 + sw);
  F(c, smooth([[0, 0], [-60, -20], [-140, 10], [-170, 70], [-120, 90], [-60, 60]]), ROUX, 5);
  F(c, smooth([[-130, 30], [-172, 66], [-140, 88], [-110, 70]]), BLANC, 4); c.restore();
  // jambes
  for (const sd of [-1, 1]) {
    const hip = [sd * 24, hipY], foot = [sd * 30, -16];
    hose(c, hip, foot, sd * 4, 34, COST); shoe(c, foot[0], foot[1] + 6, 1, '#0e0b09');
  }
  c.save(); c.translate(0, hipY); c.rotate(P.lean || 0); c.translate(0, -hipY);
  const hR = P.handR || [60, 140], hL = P.handL || [-60, 140];
  hose(c, [-50, shY + 24], [-50 + hL[0], shY + 24 + hL[1]], 12, 28, COST);
  glove(c, -50 + hL[0], shY + 24 + hL[1], Math.atan2(hL[1], hL[0]), .9, ROUX);
  // veste rayée
  const v = smooth([[-62, shY], [62, shY], [70, hipY + 30], [0, hipY + 44], [-70, hipY + 30]]);
  F(c, v, COST, 5); c.save(); c.clip(v); ink(c, 2); c.strokeStyle = RAY; for (let xx = -80; xx < 80; xx += 12) { c.beginPath(); c.moveTo(xx, shY); c.lineTo(xx + 4, hipY + 50); c.stroke(); } c.restore(); ink(c, 5); c.stroke(v);
  F(c, poly([[-26, shY], [26, shY], [0, shY + 90]]), BLANC, 4);                                                    // chemise
  F(c, poly([[-8, shY + 4], [8, shY + 4], [12, shY + 70], [0, shY + 86], [-12, shY + 70]]), '#a8461c', 3);       // cravate
  F(c, poly([[-26, shY], [-6, shY + 96], [-40, shY + 40]]), '#3a322c', 4); F(c, poly([[26, shY], [6, shY + 96], [40, shY + 40]]), '#3a322c', 4);   // revers
  F(c, poly([[30, shY + 70], [52, shY + 64], [50, shY + 76]]), BLANC, 2);                                           // pochette
  ink(c, 3); c.strokeStyle = '#d2a64a'; c.beginPath(); c.moveTo(-30, hipY - 10); c.quadraticCurveTo(-10, hipY + 10, 10, hipY - 6); c.stroke();   // chaîne de montre
  // tête (profil 3/4, museau pointu vers la droite)
  c.save(); c.translate(0, headY + 70); c.rotate(P.tilt || 0); c.translate(0, -(headY + 70));
  for (const sd of [-1, 1]) {
    F(c, poly([[sd * 34 + 6, headY - 40], [sd * 52 + 10, headY - 130], [sd * 70 + 10, headY - 30]]), ROUX, 5);
    F(c, poly([[sd * 44 + 8, headY - 46], [sd * 54 + 10, headY - 108], [sd * 62 + 10, headY - 44]]), '#3a2216', 0);
  }
  F(c, smooth([[-58, headY - 30], [-20, headY - 60], [40, headY - 54], [90, headY - 10], [150, headY + 26], [156, headY + 40], [100, headY + 52], [40, headY + 74], [-40, headY + 56], [-66, headY + 10]]), ROUX, 5);
  F(c, smooth([[20, headY + 20], [96, headY + 22], [150, headY + 34], [100, headY + 54], [40, headY + 76], [-10, headY + 62]]), BLANC, 0);   // museau blanc
  ink(c, 5); c.stroke(smooth([[-58, headY - 30], [-20, headY - 60], [40, headY - 54], [90, headY - 10], [150, headY + 26], [156, headY + 40], [100, headY + 52], [40, headY + 74], [-40, headY + 56], [-66, headY + 10]]));
  F(c, ell(154, headY + 30, 12, 9), INK, 0);                                                                        // truffe
  const lk = P.look || [0, 0], lid = P.lid != null ? P.lid : .45;
  pieEye(c, 26, headY - 10, 15, 20, lk[0] + .5, lk[1], P.blink || 0, lid, ROUX);
  if (P.wink) { ink(c, 5); c.beginPath(); c.moveTo(48, headY - 14); c.quadraticCurveTo(64, headY - 22, 80, headY - 12); c.stroke(); }
  else pieEye(c, 64, headY - 12, 13, 18, lk[0] + .5, lk[1], P.blink || 0, lid, ROUX);
  ink(c, 5); c.beginPath(); c.moveTo(4, headY - 38); c.quadraticCurveTo(30, headY - 46 + (P.brow || 0) * -10, 48, headY - 34); c.stroke();   // sourcil
  mouth(c, 104, headY + 50, 34, P.talk || 0, 1.4);
  c.restore();
  hose(c, [50, shY + 24], [50 + hR[0], shY + 24 + hR[1]], -12, 28, COST);
  glove(c, 50 + hR[0], shY + 24 + hR[1], Math.atan2(hR[1], hR[0]), .9, ROUX);
  c.restore(); c.restore();
}

// ---------- LE CHAPEAU DE BOUFFON (doré, trois pointes à grelots)
function drawChapeau(c, x, y, s, t, tag = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const OR = '#c9902f', OR2 = '#8c5a17', OR3 = '#e8b85a';
  const sw = (k) => wobble(t, .9, .06, k);
  const pointe = (ang, len, k) => {
    c.save(); c.rotate(ang + sw(k));
    const p = smooth([[-46, 0], [-30, -len * .5], [6, -len * .9], [40, -len], [24, -len * .78], [20, -len * .4], [46, 0]]);
    F(c, p, OR, 5); c.save(); c.clip(p); c.fillStyle = OR3; c.beginPath(); c.ellipse(-10, -len * .5, 12, len * .4, -.2, 0, 7); c.fill(); c.restore(); ink(c, 5); c.stroke(p);
    F(c, ell(40, -len, 14, 14), '#e0b43c', 4); ink(c, 3); c.beginPath(); c.moveTo(32, -len + 4); c.lineTo(48, -len + 4); c.stroke();
    c.restore();
  };
  pointe(-1.0, 190, 0); pointe(1.0, 190, 2); pointe(0, 250, 1);
  F(c, smooth([[-130, -10], [0, -40], [130, -10], [136, 30], [0, 44], [-136, 30]]), OR2, 5);
  c.save(); c.clip(smooth([[-130, -10], [0, -40], [130, -10], [136, 30], [0, 44], [-136, 30]]));
  c.fillStyle = OR3; for (let k = -6; k <= 6; k++) { c.beginPath(); c.moveTo(k * 22, 30); c.lineTo(k * 22 + 11, 6); c.lineTo(k * 22 + 22, 30); c.fill(); } c.restore();
  if (tag > 0) {
    c.save(); c.translate(70, -130); c.rotate(wobble(t, .8, .12) + .1); c.scale(tag, tag);
    ink(c, 3); c.beginPath(); c.moveTo(0, -40); c.lineTo(0, 0); c.stroke();
    F(c, poly([[-50, 0], [50, 0], [56, 70], [-56, 70]]), '#f1e4c4', 4);
    c.fillStyle = INK; c.font = 'bold 26px Oswald, Impact, sans-serif'; c.textAlign = 'center'; c.fillText('BEST-', 0, 30); c.fillText('SELLER', 0, 58);
    c.restore();
  }
  c.restore();
}

// ============================================================ DÉCOR : la boutique (couleur, chaude)
function boutique(c, t) {
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5a2f17'); g.addColorStop(.6, '#7a4120'); g.addColorStop(1, '#3e1f0e');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  // étagères de chapeaux et de boîtes
  const COLS = ['#b5532f', '#e2c38f', '#8a3a2a', '#d99a5a', '#6e4a3a', '#efd9b0'];
  for (let r = 0; r < 3; r++) {
    const sy = 150 + r * 150;
    c.fillStyle = '#4a2412'; c.fillRect(0, sy, W, 18); ink(c, 3); c.strokeRect(-5, sy, W + 10, 18);
    for (let k = 0; k < 11; k++) {
      const x = 40 + k * 96 + (r % 2) * 40, col = COLS[(k + r * 2) % COLS.length];
      if ((k + r) % 3 === 0) { F(c, poly([[x - 34, sy], [x + 34, sy], [x + 30, sy - 50], [x - 30, sy - 50]]), col, 3); ink(c, 2); c.strokeStyle = '#f3e2bf'; c.beginPath(); c.moveTo(x - 30, sy - 30); c.lineTo(x + 30, sy - 30); c.stroke(); }
      else { F(c, ell(x, sy - 6, 40, 10), col, 3); F(c, smooth([[x - 24, sy - 8], [x - 20, sy - 44], [x + 20, sy - 44], [x + 24, sy - 8]]), col, 3); F(c, ell(x + 8, sy - 34, 10, 6), COLS[(k + 3) % 6], 2); }
      c.fillStyle = '#c99b4a'; c.fillRect(x - 3, sy, 6, 0);
    }
  }
  // lampes suspendues (lumière qui respire)
  for (const lx of [300, 780]) {
    ink(c, 3); c.beginPath(); c.moveTo(lx, 0); c.lineTo(lx, 50); c.stroke();
    const gl = c.createRadialGradient(lx, 80, 10, lx, 260, 420); const a = .28 + .04 * Math.sin(t * 3 + lx);
    gl.addColorStop(0, `rgba(255,214,140,${a})`); gl.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = gl; c.fillRect(lx - 420, 0, 840, 700);
    F(c, poly([[lx - 50, 90], [lx - 20, 50], [lx + 20, 50], [lx + 50, 90]]), '#b07a3a', 4); F(c, ell(lx, 92, 16, 10), '#fff1c4', 3);
  }
  // sol en parquet
  c.fillStyle = '#5b2e14'; c.fillRect(0, 640, W, H - 640);
  ink(c, 2); c.strokeStyle = '#3e1d0b'; for (let k = 0; k < 14; k++) { c.beginPath(); c.moveTo(k * 90 - 60, H); c.lineTo(k * 80 + 40, 640); c.stroke(); }
  ink(c, 4); c.beginPath(); c.moveTo(0, 640); c.lineTo(W, 640); c.stroke();
}
function comptoir(c, x0, x1, y) {
  F(c, poly([[x0, y], [x1, y], [x1 + 10, y + 26], [x0 - 10, y + 26]]), '#b8864a', 5);                                  // plateau vitré
  F(c, poly([[x0, y + 26], [x1, y + 26], [x1, H + 10], [x0, H + 10]]), '#6b3618', 5);
  c.fillStyle = 'rgba(255,240,210,.18)'; c.fillRect(x0 + 20, y + 40, x1 - x0 - 40, 120); ink(c, 3); c.strokeRect(x0 + 20, y + 40, x1 - x0 - 40, 120);
  for (let k = 0; k < 6; k++) { const hx = x0 + 60 + k * (x1 - x0 - 120) / 5; F(c, ell(hx, y + 150, 30, 8), ['#e2c38f', '#8a3a2a', '#d99a5a'][k % 3], 3); F(c, smooth([[hx - 18, y + 148], [hx - 14, y + 116], [hx + 14, y + 116], [hx + 18, y + 148]]), ['#e2c38f', '#8a3a2a', '#d99a5a'][k % 3], 3); }
}

// ============================================================ PELLICULE
function pellicule(c, t, couleur) {
  const fi = Math.floor(t * 24), r = (k) => hash(fi * 31 + k);
  c.fillStyle = `rgba(255,245,220,${.02 + r(1) * .05})`; c.fillRect(0, 0, W, H);
  c.fillStyle = `rgba(0,0,0,${r(2) * .05})`; c.fillRect(0, 0, W, H);
  const fs = Math.floor(t * 6);
  ink(c, 1.5); c.strokeStyle = 'rgba(255,250,235,.35)';
  for (let k = 0; k < (couleur ? 1 : 3); k++) { const x = hash(fs * 7 + k) * W; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 6, H); c.stroke(); }
  c.fillStyle = 'rgba(20,14,10,.6)'; for (let k = 0; k < 12; k++) { c.beginPath(); c.arc(r(10 + k) * W, r(40 + k) * H, 1 + r(70 + k) * 2.5, 0, 7); c.fill(); }
  if (r(99) < .2) { ink(c, 1.5); c.strokeStyle = 'rgba(20,14,10,.6)'; const hx = r(100) * W, hy = r(101) * H; c.beginPath(); c.moveTo(hx, hy); c.bezierCurveTo(hx + 20, hy - 30, hx + 40, hy + 20, hx + 60, hy - 10); c.stroke(); }
  const vg = c.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .85); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)'); c.fillStyle = vg; c.fillRect(0, 0, W, H);
}
