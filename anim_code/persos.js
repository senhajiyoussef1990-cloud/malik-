// Le renard et le mouton, dessinés en code d'après les fiches de personnage (face).
// Origine = entre les pieds, au sol. Unités : le renard mesure ~1000, le mouton ~800.
const INK = '#2a140a';
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
function hash(n) { const s = Math.sin(n * 12.9898) * 43758.5453; return s - Math.floor(s); }
function ink(c, w = 5, col = INK) { c.strokeStyle = col; c.lineWidth = w; c.lineJoin = 'round'; c.lineCap = 'round'; }
function F(c, p, col, w = 5) { c.fillStyle = col; c.fill(p); if (w) { ink(c, w); c.stroke(p); } }
function ell(x, y, rx, ry, a = 0) { const p = new Path2D(); p.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), a, 0, Math.PI * 2); return p; }
function poly(pts) { const p = new Path2D(); p.moveTo(...pts[0]); for (const q of pts.slice(1)) p.lineTo(...q); p.closePath(); return p; }
function smooth(pts, closed = true) {
  const p = new Path2D(), n = pts.length, g = (i) => pts[(i + n) % n];
  p.moveTo(...pts[0]);
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    p.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
  }
  if (closed) p.closePath(); return p;
}
// ombrage doux (lumière en haut à gauche) et reflet, à l'intérieur d'une forme
function ombre(c, p, x0, y0, x1, y1, a = .26) {
  c.save(); c.clip(p); const g = c.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, 'rgba(40,14,4,0)'); g.addColorStop(.55, 'rgba(40,14,4,0)'); g.addColorStop(1, `rgba(40,14,4,${a})`);
  c.fillStyle = g; c.fillRect(-2000, -2000, 4000, 4000); c.restore();
}
function reflet(c, p, x, y, rx, ry, a = .22, ang = -.4) {
  c.save(); c.clip(p); c.fillStyle = `rgba(255,245,225,${a})`; c.beginPath(); c.ellipse(x, y, rx, ry, ang, 0, 7); c.fill(); c.restore();
}
// membre souple (manche / jambe) : courbe de A à B, avec volume (ombre + reflet) et plis au coude / genou
function tube(c, A, B, bend, w, col, edge = INK, plis = true) {
  const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L, C = [mx + nx * bend, my + ny * bend];
  const trace = (ox, oy) => { c.beginPath(); c.moveTo(A[0] + ox, A[1] + oy); c.quadraticCurveTo(C[0] + ox, C[1] + oy, B[0] + ox, B[1] + oy); };
  c.lineCap = 'round'; c.strokeStyle = edge; c.lineWidth = w + 8; trace(0, 0); c.stroke();
  c.strokeStyle = col; c.lineWidth = w; trace(0, 0); c.stroke();
  c.strokeStyle = 'rgba(40,14,4,.22)'; c.lineWidth = w * .34; trace(nx * w * .3, ny * w * .3); c.stroke();      // côté ombre
  c.strokeStyle = 'rgba(255,245,225,.18)'; c.lineWidth = w * .16; trace(-nx * w * .26, -ny * w * .26); c.stroke(); // reflet
  if (plis && Math.abs(bend) > 2) {                                                                               // plis du tissu
    const sg = bend > 0 ? 1 : -1; ink(c, 2.4, 'rgba(40,14,4,.55)');
    for (let k = -1; k <= 1; k++) {
      const px = C[0] * .5 + mx * .5 + dx / L * k * w * .32, py = C[1] * .5 + my * .5 + dy / L * k * w * .32;
      c.beginPath(); c.moveTo(px - nx * sg * w * .42, py - ny * sg * w * .42);
      c.quadraticCurveTo(px + dx / L * w * .12, py + dy / L * w * .12, px + nx * sg * w * .08, py + ny * sg * w * .08); c.stroke();
    }
  }
  return C;
}
// texture : fines lignes (rayures, tweed) clippées dans une forme
function rayures(c, p, col, pas, ang = 0, w = 1.5) {
  c.save(); c.clip(p); ink(c, w, col);
  c.rotate(ang);
  for (let x = -1500; x < 1500; x += pas) { c.beginPath(); c.moveTo(x, -1500); c.lineTo(x, 1500); c.stroke(); }
  c.restore();
}
function chevrons(c, p, col, pas = 14) {
  c.save(); c.clip(p); ink(c, 1.6, col);
  for (let y = -1200; y < 100; y += pas) for (let x = -300; x < 300; x += pas * 1.4) {
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + pas * .35, y + pas * .45); c.lineTo(x + pas * .7, y); c.stroke();
  }
  c.restore();
}
// main détaillée. ang : direction poignet -> doigts. pose : repos | ouverte | poing | pointe. cote : ±1 (côté du pouce)
function main(c, x, y, ang, s, col, griffes = false, pose = 'repos', cote = 1) {
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(s * cote, s);
  const sombre = 'rgba(60,20,6,.28)', ligne = (w = 2.2) => ink(c, w, 'rgba(50,18,6,.75)');
  const doigt = (bx, by, a, L, w) => {                                   // un doigt : 2 phalanges, ongle ou griffe
    c.save(); c.translate(bx, by); c.rotate(a);
    const p = smooth([[-w / 2, 0], [-w / 2 - 1, L * .55], [-w * .42, L * .92], [0, L + w * .35], [w * .42, L * .92], [w / 2 + 1, L * .55], [w / 2, 0]]);
    F(c, p, col, 3.5); ombre(c, p, -w, 0, w, 0, .3);
    ligne(); c.beginPath(); c.moveTo(-w * .32, L * .48); c.quadraticCurveTo(0, L * .54, w * .32, L * .48); c.stroke();      // pli d'articulation
    if (griffes) { F(c, smooth([[-w * .28, L * .86], [w * .28, L * .86], [0, L + w * .9]]), '#2e1308', 1.5); }
    else { c.fillStyle = 'rgba(255,240,225,.55)'; c.beginPath(); c.ellipse(0, L * .84, w * .22, w * .3, 0, 0, 7); c.fill(); }
    c.restore();
  };
  // longueurs et angles des 4 doigts selon la pose
  const base = [[-15, 36], [-5, 40], [5, 40], [15, 36]];
  let L = [26, 31, 30, 24], A = [.14, .05, -.05, -.16];
  if (pose === 'ouverte') { L = [30, 36, 34, 27]; A = [.42, .14, -.14, -.42]; }
  if (pose === 'poing') { L = [11, 12, 12, 10]; A = [.05, 0, 0, -.05]; }
  if (pose === 'pointe') { L = [42, 12, 12, 10]; A = [.08, 0, 0, -.05]; }
  // dos de la main
  const paume = smooth([[-17, -2], [-23, 16], [-22, 36], [-11, 44], [7, 45], [21, 39], [23, 18], [17, -2], [0, -5]]);
  for (let i = 0; i < 4; i++) if (pose === 'poing' || (pose === 'pointe' && i > 0)) doigt(base[i][0], base[i][1], A[i], L[i], 11);
  F(c, paume, col, 4); ombre(c, paume, -24, 0, 24, 30, .3); reflet(c, paume, -6, 14, 9, 6, .25);
  for (let i = 0; i < 4; i++) if (!(pose === 'poing' || (pose === 'pointe' && i > 0))) doigt(base[i][0], base[i][1], A[i], L[i], 11);
  if (pose === 'poing' || pose === 'pointe') {                            // jointures repliées vues de dos
    for (let i = (pose === 'poing' ? 0 : 1); i < 4; i++) { const kx = base[i][0]; F(c, ell(kx, 44, 6.5, 5), col, 3); ligne(1.8); c.beginPath(); c.moveTo(kx - 4, 40); c.lineTo(kx + 4, 40); c.stroke(); }
  }
  ligne(); for (const kx of [-10, 0, 10]) { c.beginPath(); c.moveTo(kx, 12); c.lineTo(kx + 1, 26); c.stroke(); }      // tendons
  if (griffes) { ink(c, 1.6, 'rgba(120,40,10,.6)'); for (let k = 0; k < 6; k++) { const fx = -14 + k * 5.5; c.beginPath(); c.moveTo(fx, 4); c.lineTo(fx + 2, 11); c.stroke(); } }   // poils
  // pouce
  c.save(); c.translate(-20, 18); c.rotate(pose === 'ouverte' ? .95 : pose === 'poing' ? .25 : .55);
  const po = smooth([[-6, 0], [-8, 14], [-6, 26], [0, 30], [6, 26], [7, 12], [6, 0]]);
  F(c, po, col, 3.5); ombre(c, po, -8, 0, 8, 0, .28); ligne(1.8); c.beginPath(); c.moveTo(-4, 15); c.quadraticCurveTo(0, 18, 4, 15); c.stroke();
  if (griffes) F(c, smooth([[-3, 25], [3, 25], [0, 34]]), '#2e1308', 1.5);
  c.restore();
  c.restore();
}
function chaussure(c, x, y, dir, col, s = 1) {
  c.save(); c.translate(x, y); c.scale(dir * s, s);
  const p = smooth([[-34, 0], [-30, -30], [6, -36], [40, -24], [58, -8], [54, 6], [-30, 8]]);
  F(c, p, col, 5); F(c, poly([[-34, 2], [56, 2], [54, 12], [-32, 12]]), '#5a2a10', 3);
  c.fillStyle = 'rgba(255,240,220,.45)'; c.beginPath(); c.ellipse(22, -24, 14, 5, -.2, 0, 7); c.fill();
  ink(c, 2.5); for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(-6 + k * 9, -30); c.lineTo(2 + k * 9, -22); c.stroke(); }
  ombre(c, p, 0, -36, 0, 8, .3);
  ink(c, 1.4, 'rgba(255,230,200,.45)'); c.setLineDash([3, 3]); c.beginPath(); c.moveTo(-28, -4); c.quadraticCurveTo(10, -10, 50, -6); c.stroke(); c.setLineDash([]);
  ink(c, 2, 'rgba(50,18,6,.6)'); c.beginPath(); c.moveTo(14, -34); c.quadraticCurveTo(26, -20, 40, -24); c.stroke();      // bout rapporté
  c.restore();
}
function bouche(c, x, y, w, ouv, sourire = 1, col = '#5a1a12') {
  if (ouv < 0.06) {
    ink(c, 4); c.beginPath(); c.moveTo(x - w * .55, y - 4 * sourire); c.quadraticCurveTo(x, y + 10 * sourire, x + w * .6, y - 8 * sourire); c.stroke(); return;
  }
  const h = w * (0.18 + ouv * 0.62);
  const p = new Path2D(); p.moveTo(x - w * .5, y - 2 * sourire); p.quadraticCurveTo(x, y + 4 * sourire - 4, x + w * .55, y - 6 * sourire);
  p.quadraticCurveTo(x + w * .3, y + h, x, y + h); p.quadraticCurveTo(x - w * .32, y + h, x - w * .5, y - 2 * sourire); p.closePath();
  F(c, p, col, 4);
  c.save(); c.clip(p); c.fillStyle = '#d0605a'; c.beginPath(); c.ellipse(x + 2, y + h * .95, w * .3, h * .38, 0, 0, 7); c.fill();
  c.fillStyle = '#fff8ee'; c.fillRect(x - w * .45, y - 10, w * .95, 7); c.restore();
}

// ============================================================ LE RENARD
const RENARD = { fur: '#f2691c', fur2: '#c8461a', creme: '#fbdcb3', tip: '#8a3412', inner: '#f7c89a', cost: '#5b2614', ray: '#7c3c22',
  cravate: '#f2641c', chemise: '#fbe6c8', main: '#ea6420', chaus: '#b4561f', or: '#e3a42c' };
function drawRenard(c, P) {
  const R = RENARD, t = P.t || 0, s = P.s || 1;
  c.save(); c.translate(P.x, P.y); c.scale(s * (P.face || 1), s);
  const hipY = -470, shY = -735, neckY = -760;
  // jambes (pantalon rayé)
  for (const sd of [-1, 1]) {
    const ph = P.walk ? Math.sin(P.walk + (sd > 0 ? Math.PI : 0)) : 0;
    const ecart = P.ecart != null ? P.ecart : 1;                       // jambes légèrement écartées, comme sur la fiche
    const hip = [sd * 32, hipY], foot = [sd * (36 + 26 * ecart) + ph * 60, -42 - Math.max(0, ph) * 22];
    const knee = [lerp(hip[0], foot[0], .5) + sd * 3 + ph * 18, -255];
    const jambe = (w, col) => { c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = col; c.lineWidth = w;
      c.beginPath(); c.moveTo(...hip); c.quadraticCurveTo(lerp(hip[0], knee[0], .5) - sd * 2, (hip[1] + knee[1]) / 2, ...knee);
      c.quadraticCurveTo(lerp(knee[0], foot[0], .5) + sd * 2, (knee[1] + foot[1]) / 2, ...foot); c.stroke(); };
    jambe(68, INK); jambe(60, R.cost);                                                                 // jambe d'un seul trait
    c.save(); c.translate(sd * 9, 0); jambe(18, 'rgba(40,14,4,.22)'); c.restore();                     // côté ombre
    c.save(); c.translate(-sd * 14, 0); jambe(8, 'rgba(255,245,225,.12)'); c.restore();                // reflet
    ink(c, 2, 'rgba(255,220,190,.18)'); c.beginPath(); c.moveTo(hip[0], hipY + 20); c.lineTo(foot[0], foot[1] - 20); c.stroke();   // pli du pantalon
    c.save(); c.translate(foot[0] + sd * 6, foot[1] + 40); c.rotate(sd * .1);
    chaussure(c, 0, 0, sd > 0 ? 1 : -1, R.chaus, 1.15); c.restore();
  }
  c.save(); c.translate(0, hipY); c.rotate(P.lean || 0); c.translate(0, -hipY);
  // bras arrière
  const hL = P.handL || [-104, -440], hR = P.handR || [104, -440];
  const sL = [-84, shY + 20], sR = [84, shY + 20];
  tube(c, sL, hL, 14, 40, R.cost); F(c, ell(hL[0], hL[1] - 6, 22, 10, Math.atan2(hL[1] - sL[1], hL[0] - sL[0]) + Math.PI / 2), R.chemise, 3);
  main(c, hL[0], hL[1] + 4, Math.atan2(hL[1] - sL[1], hL[0] - sL[0]) - Math.PI / 2, 1.1, R.main, true, P.poseL || 'repos', -1);
  // veste
  const veste = smooth([[-88, shY], [-50, shY - 14], [50, shY - 14], [88, shY], [74, -560], [84, -390], [0, -376], [-84, -390], [-74, -560]]);
  F(c, veste, R.cost, 5); rayures(c, veste, R.ray, 16);
  ombre(c, veste, -60, shY, 90, -420, .34); reflet(c, veste, -50, shY + 60, 26, 90, .08, .1);
  for (const sd of [-1, 1]) {                                                                               // poches à rabat
    const pk = poly([[sd * 26, -470], [sd * 72, -472], [sd * 72, -452], [sd * 26, -450]]); F(c, pk, '#4a1d0e', 3);
    ink(c, 1.6, 'rgba(255,220,180,.35)'); c.setLineDash([4, 4]); c.beginPath(); c.moveTo(sd * 29, -455); c.lineTo(sd * 69, -457); c.stroke(); c.setLineDash([]);
  }
  ink(c, 2, 'rgba(30,8,2,.6)'); c.beginPath(); c.moveTo(0, -560); c.lineTo(0, -380); c.stroke();          // ouverture de la veste
  ink(c, 5); c.stroke(veste);
  // gilet + chemise + cravate
  F(c, poly([[-46, shY - 6], [46, shY - 6], [52, -420], [0, -400], [-52, -420]]), '#4d1f10', 4);
  rayures(c, poly([[-46, shY - 6], [46, shY - 6], [52, -420], [0, -400], [-52, -420]]), '#6a321c', 14);
  F(c, poly([[-30, shY - 14], [30, shY - 14], [0, shY + 70]]), R.chemise, 4);
  for (const sd of [-1, 1]) F(c, poly([[sd * 4, shY - 16], [sd * 30, shY - 18], [sd * 18, shY + 12]]), R.chemise, 2.5);    // pointes du col
  F(c, poly([[-12, shY - 4], [12, shY - 4], [18, shY + 90], [0, shY + 116], [-18, shY + 90]]), R.cravate, 3);
  F(c, poly([[-12, shY - 4], [12, shY - 4], [6, shY + 10], [-6, shY + 10]]), '#d44f0a', 2);
  ink(c, 1.4, 'rgba(120,30,0,.55)'); for (let k = 0; k < 6; k++) { c.beginPath(); c.moveTo(-14 + k * 6, shY + 20 + k * 10); c.lineTo(-4 + k * 6, shY + 28 + k * 10); c.stroke(); }   // motif de la cravate
  for (const sd of [-1, 1]) F(c, poly([[sd * 28, shY - 14], [sd * 56, shY - 4], [sd * 30, -560], [sd * 14, shY + 80]]), '#4a1d0e', 4);   // revers
  [-592, -552, -512, -472].forEach(y => F(c, ell(0, y, 6, 6), "#3a1608", 2));
  F(c, poly([[46, shY + 64], [72, shY + 58], [68, shY + 74], [48, shY + 76]]), R.chemise, 2);            // pochette
  { const pts = []; for (let k = 0; k <= 14; k++) { const u = k / 14, x = lerp(-40, 46, u), y = -560 + Math.sin(u * Math.PI) * 34 - (u > .5 ? 0 : 0); pts.push([x, y]); }
    for (const [x, y] of pts) { F(c, ell(x, y, 3.4, 2.4), R.or, 1.2); } F(c, ell(-40, -562, 6, 6), R.or, 2); }      // chaîne de montre à maillons
  // tête
  const hy = -862;
  c.save(); c.translate(0, neckY); c.rotate(P.tilt || 0); c.scale(.86, .86); c.translate(0, -neckY);
  F(c, poly([[-26, neckY + 10], [26, neckY + 10], [20, neckY - 40], [-20, neckY - 40]]), R.fur2, 3);
  for (const sd of [-1, 1]) {                                                                              // oreilles
    const o = poly([[sd * 34, hy - 50], [sd * 80, hy - 160 + (P.oreille || 0) * sd * 6], [sd * 104, hy - 40]]);
    F(c, o, R.fur, 5); F(c, poly([[sd * 46, hy - 54], [sd * 80, hy - 140], [sd * 92, hy - 52]]), R.inner, 0);
    ink(c, 2, '#fff4e4'); for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(sd * (52 + k * 7), hy - 54); c.lineTo(sd * (56 + k * 6), hy - 84 - k * 4); c.stroke(); }
    c.save(); c.clip(o); c.fillStyle = R.tip; c.fillRect(-300, hy - 200, 600, 70); c.restore(); ink(c, 5); c.stroke(o);
  }
  const tete = smooth([[0, hy - 66], [60, hy - 58], [92, hy - 20], [116, hy + 8], [92, hy + 22], [100, hy + 40], [64, hy + 56], [30, hy + 84], [0, hy + 92],
                       [-30, hy + 84], [-64, hy + 56], [-100, hy + 40], [-92, hy + 22], [-116, hy + 8], [-92, hy - 20], [-60, hy - 58]]);
  F(c, tete, R.fur, 5); ombre(c, tete, -40, hy - 40, 90, hy + 60, .3);
  ink(c, 2.6, R.fur2);
  for (const sd of [-1, 1]) for (let k = 0; k < 5; k++) { const y0 = hy + 6 + k * 9; c.beginPath(); c.moveTo(sd * (84 - k * 6), y0); c.lineTo(sd * (100 - k * 4), y0 + 4); c.stroke(); }   // joues ébouriffées
  for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(k * 10, hy - 60); c.quadraticCurveTo(k * 12 + 4, hy - 46, k * 9, hy - 34); c.stroke(); }                                   // front
  F(c, smooth([[-58, hy + 14], [-24, hy + 8], [0, hy + 20], [24, hy + 8], [58, hy + 14], [40, hy + 60], [0, hy + 96], [-40, hy + 60]]), R.creme, 0);
  ink(c, 3, R.fur2); c.beginPath(); c.moveTo(-14, hy + 22); c.quadraticCurveTo(0, hy + 12, 14, hy + 22); c.stroke();
  ink(c, 5); c.stroke(tete);
  const lk = P.look || [0, 0], lid = P.lid != null ? P.lid : .5, bl = P.blink ? 1 : 0;
  for (const sd of [-1, 1]) {                                                                                // yeux mi-clos
    const ex = sd * 40, ey = hy - 4;
    if (bl || (P.wink && sd > 0)) { ink(c, 5); c.beginPath(); c.moveTo(ex - 20, ey); c.quadraticCurveTo(ex, ey + 8, ex + 20, ey - 2); c.stroke(); }
    else {
      F(c, ell(ex, ey, 22, 13), '#fff8ea', 3);
      c.save(); c.clip(ell(ex, ey, 22, 13)); F(c, ell(ex + 4 + lk[0] * 6, ey + 3 + lk[1] * 3, 10, 10), '#7a4a1a', 0); F(c, ell(ex + 4 + lk[0] * 6, ey + 3, 5, 6), '#1a0c06', 0);
      c.fillStyle = R.fur; c.fillRect(ex - 26, ey - 16, 52, 26 * lid); c.restore();
      ink(c, 4.5); c.beginPath(); c.moveTo(ex - 22, ey - 13 + 26 * lid); c.quadraticCurveTo(ex, ey - 16 + 26 * lid, ex + 22, ey - 12 + 26 * lid); c.stroke();
    }
    const br = P.sourcil || 0;                                                                              // sourcils épais
    F(c, smooth([[ex - 28, ey - 24 - br * sd * 0], [ex, ey - 34 - br * 8], [ex + 28, ey - 26 + sd * 2], [ex + 24, ey - 20], [ex, ey - 27 - br * 8], [ex - 24, ey - 18]]), R.fur2, 2.5);
  }
  F(c, smooth([[-20, hy + 34], [20, hy + 34], [16, hy + 50], [0, hy + 58], [-16, hy + 50]]), '#2a120a', 3);   // truffe
  c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.ellipse(-5, hy + 41, 5, 3, 0, 0, 7); c.fill();
  bouche(c, 4, hy + 70, 58, P.talk || 0, 1.2);
  c.fillStyle = 'rgba(120,50,20,.6)'; [[-28, hy + 64], [-34, hy + 72], [28, hy + 64], [34, hy + 72]].forEach(([a, b]) => { c.beginPath(); c.arc(a, b, 2, 0, 7); c.fill(); });
  c.restore();
  // bras avant
  tube(c, sR, hR, -14, 40, R.cost); F(c, ell(hR[0], hR[1] - 6, 22, 10, Math.atan2(hR[1] - sR[1], hR[0] - sR[0]) + Math.PI / 2), R.chemise, 3);
  for (let k = 1; k <= 2; k++) F(c, ell(lerp(hR[0], sR[0], .1 * k), lerp(hR[1], sR[1], .1 * k), 4, 4), '#3a1608', 1.5);
  main(c, hR[0], hR[1] + 4, Math.atan2(hR[1] - sR[1], hR[0] - sR[0]) - Math.PI / 2, 1.1, R.main, true, P.poseR || 'repos', 1);
  c.restore(); c.restore();
}

// ============================================================ LE MOUTON
const MOUTON = { casq: '#b8471c', casq2: '#8e3412', laine: '#f4ddb8', laine2: '#dcbc8f', visage: '#f7d0a4', oreille: '#f2c39c', oreilleIn: '#eea08f',
  gilet: '#b4491a', gilet2: '#8a3410', chemise: '#f6e5cc', pant: '#c35a1f', pant2: '#97401a', noeud: '#a8231c', main: '#f4c79a', chaus: '#a04a1c', bouton: '#d0823c' };
function drawMouton(c, P) {
  const M = MOUTON, t = P.t || 0, s = P.s || 1;
  c.save(); c.translate(P.x, P.y); c.scale(s * (P.face || 1), s);
  const hipY = -360, shY = -580, neckY = -610, hy = -700;
  for (const sd of [-1, 1]) {                                                                               // jambes + revers
    const ph = P.walk ? Math.sin(P.walk + (sd > 0 ? Math.PI : 0)) : 0;
    const hip = [sd * 46, hipY], foot = [sd * 52 + ph * 50, -40 - Math.max(0, ph) * 20];
    const C = tube(c, hip, [foot[0], foot[1] - 60], sd * 4 - ph * 8, 96, M.pant);
    const cuff = poly([[foot[0] - 48, foot[1] - 86], [foot[0] + 48, foot[1] - 86], [foot[0] + 46, foot[1] - 34], [foot[0] - 46, foot[1] - 34]]);
    F(c, cuff, M.pant, 5); chevrons(c, cuff, M.pant2, 12); ink(c, 5); c.stroke(cuff);
    F(c, poly([[foot[0] - 22, foot[1] - 36], [foot[0] + 22, foot[1] - 36], [foot[0] + 20, foot[1] - 14], [foot[0] - 20, foot[1] - 14]]), '#e9cfa8', 3);   // chaussettes
    chaussure(c, foot[0] + sd * 4, foot[1] + 38, sd > 0 ? 1 : -1, M.chaus, 1.05);
  }
  c.save(); c.translate(0, hipY); c.rotate(P.lean || 0); c.translate(0, -hipY);
  const hL = P.handL || [-118, -360], hR = P.handR || [118, -360];
  const sL = [-92, shY + 24], sR = [92, shY + 24];
  tube(c, sL, hL, 18, 58, M.chemise); F(c, ell(hL[0], hL[1] - 10, 26, 12, Math.atan2(hL[1] - sL[1], hL[0] - sL[0]) + Math.PI / 2), M.chemise, 3);
  main(c, hL[0], hL[1], Math.atan2(hL[1] - sL[1], hL[0] - sL[0]) - Math.PI / 2, 1.05, M.main, false, P.poseL || 'repos', -1);
  // pantalon haut (taille)
  F(c, poly([[-94, -450], [94, -450], [100, -330], [-100, -330]]), M.pant, 5);
  chevrons(c, poly([[-94, -450], [94, -450], [100, -330], [-100, -330]]), M.pant2, 12);
  // chemise + gilet tricoté
  F(c, smooth([[-92, shY], [92, shY], [96, -460], [-96, -460]]), M.chemise, 5);
  const gilet = poly([[-80, shY + 4], [-24, shY + 4], [0, shY + 70], [24, shY + 4], [80, shY + 4], [88, -400], [0, -380], [-88, -400]]);
  F(c, gilet, M.gilet, 5); chevrons(c, gilet, M.gilet2, 12); ombre(c, gilet, -50, shY, 90, -400, .32); reflet(c, gilet, -46, shY + 70, 20, 60, .1, .1); ink(c, 5); c.stroke(gilet);
  ink(c, 1.4, 'rgba(255,220,190,.45)'); c.setLineDash([4, 3]); c.beginPath(); c.moveTo(-84, -404); c.quadraticCurveTo(0, -384, 84, -404); c.stroke(); c.setLineDash([]);
  for (const sd of [-1, 1]) { F(c, poly([[sd * 24, shY + 4], [sd * 44, shY + 4], [sd * 8, shY + 92], [sd * 2, shY + 76]]), M.gilet2, 3);
    F(c, poly([[sd * 34, -452], [sd * 72, -452], [sd * 72, -438], [sd * 34, -438]]), M.gilet2, 3); }
  [-488, -452, -416].forEach(y => { F(c, ell(0, y, 9, 9), M.bouton, 3); c.fillStyle = 'rgba(255,240,210,.6)'; c.beginPath(); c.arc(-2, y - 2, 3, 0, 7); c.fill(); });
  // nœud papillon
  const ny = neckY + 10;
  F(c, smooth([[0, ny], [-36, ny - 18], [-40, ny + 18]]), M.noeud, 4); F(c, smooth([[0, ny], [36, ny - 18], [40, ny + 18]]), M.noeud, 4); F(c, ell(0, ny, 9, 10), '#8a1a14', 3);
  // tête
  c.save(); c.translate(0, neckY); c.rotate(P.tilt || 0); c.translate(0, -neckY);
  for (const sd of [-1, 1]) {                                                                                // oreilles tombantes
    const a = (P.oreille || 0) * sd;
    c.save(); c.translate(sd * 74, hy + 10); c.rotate(sd * (0.12 + a));
    const o = smooth([[0, -16], [sd * 60, -22], [sd * 104, -6], [sd * 70, 18], [0, 18]]);
    F(c, o, M.oreille, 4); F(c, smooth([[sd * 10, -6], [sd * 60, -10], [sd * 88, -4], [sd * 60, 8], [sd * 10, 8]]), M.oreilleIn, 0); c.restore();
  }
  const laine = [[-70, hy + 86], [-88, hy + 56], [-100, hy + 22], [-104, hy - 12], [-94, hy - 46], [-66, hy - 72], [-30, hy - 84], [6, hy - 88], [42, hy - 82], [74, hy - 66], [98, hy - 40], [106, hy - 6], [100, hy + 26], [88, hy + 58], [70, hy + 88], [-36, hy + 104], [0, hy + 112], [36, hy + 104]];
  for (const [x, y] of laine) F(c, ell(x, y, 32, 28), M.laine2, 4);
  for (const [x, y] of laine) F(c, ell(x - 2, y - 4, 27, 23), M.laine, 0);
  for (const [x, y] of laine) { c.fillStyle = 'rgba(255,255,250,.55)'; c.beginPath(); c.ellipse(x - 9, y - 10, 9, 6, -.5, 0, 7); c.fill(); }
  ink(c, 2.4, M.laine2); for (const [x, y] of laine) { c.beginPath(); c.arc(x + 3, y + 1, 11, 0.3, 2.6); c.stroke(); c.beginPath(); c.arc(x - 6, y - 4, 5, 3.4, 5.6); c.stroke(); }
  const vis = smooth([[-58, hy - 40], [0, hy - 54], [58, hy - 40], [66, hy + 8], [52, hy + 62], [22, hy + 88], [0, hy + 92], [-22, hy + 88], [-52, hy + 62], [-66, hy + 8]]);
  F(c, vis, M.visage, 5); ombre(c, vis, -30, hy - 30, 60, hy + 80, .24); reflet(c, vis, -22, hy - 20, 18, 12, .22);
  c.fillStyle = 'rgba(240,140,120,.25)'; for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * 40, hy + 46, 14, 8, 0, 0, 7); c.fill(); }   // joues roses
  const lk = P.look || [0, 0];
  for (const sd of [-1, 1]) {
    const ex = sd * 32, ey = hy + 4;
    if (P.blink || P.rire) { ink(c, 5); c.beginPath(); c.moveTo(ex - 20, ey + 2); c.quadraticCurveTo(ex, ey - 12, ex + 20, ey + 2); c.stroke(); }
    else {
      F(c, ell(ex, ey, 24, 27), '#fffaf0', 3.5);
      F(c, ell(ex + lk[0] * 7, ey + 3 + lk[1] * 6, 12, 13), '#7a3e14', 0); F(c, ell(ex + lk[0] * 7, ey + 3 + lk[1] * 6, 6, 7), '#1a0a04', 0);
      c.fillStyle = '#fff'; c.beginPath(); c.arc(ex + lk[0] * 7 - 4, ey - 3, 3.5, 0, 7); c.fill();
    }
    const fr = P.froncer != null ? P.froncer : .5;                                                           // sourcils
    ink(c, 7, '#4a2410'); c.beginPath(); c.moveTo(ex - sd * 22, ey - 36 + fr * 6 * 0); c.quadraticCurveTo(ex, ey - 44 - (1 - fr) * 6, ex + sd * 24, ey - 34 + fr * 10); c.stroke();
  }
  F(c, smooth([[-10, hy + 52], [10, hy + 52], [0, hy + 62]]), '#e88c86', 2.5);                                // nez
  ink(c, 3); c.beginPath(); c.moveTo(0, hy + 62); c.lineTo(0, hy + 70); c.stroke();
  bouche(c, 0, hy + 76, 40, P.talk || 0, P.rire ? 1.4 : (P.sourire != null ? P.sourire : 0.3), '#6a2016');
  // casquette plate en tweed
  const cq = smooth([[-108, hy - 60], [-90, hy - 104], [-40, hy - 128], [20, hy - 130], [80, hy - 112], [112, hy - 72], [100, hy - 52], [0, hy - 64]]);
  F(c, cq, M.casq, 5); chevrons(c, cq, M.casq2, 13); ombre(c, cq, -40, hy - 130, 90, hy - 60, .3); reflet(c, cq, -40, hy - 112, 34, 12, .18); ink(c, 5); c.stroke(cq);
  const visiere = smooth([[-92, hy - 56], [0, hy - 70], [96, hy - 54], [86, hy - 40], [0, hy - 48], [-84, hy - 42]]);
  F(c, visiere, M.casq2, 4); ink(c, 1.4, 'rgba(255,220,190,.5)'); c.setLineDash([4, 3]); c.beginPath(); c.moveTo(-80, hy - 52); c.quadraticCurveTo(0, hy - 62, 84, hy - 50); c.stroke(); c.setLineDash([]);
  ink(c, 2.5, M.casq2); for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(k * 8, hy - 128); c.quadraticCurveTo(k * 26, hy - 100, k * 30, hy - 66); c.stroke(); }
  F(c, ell(4, hy - 132, 16, 9), M.casq, 4);
  c.restore();
  tube(c, sR, hR, -18, 58, M.chemise); F(c, ell(hR[0], hR[1] - 10, 26, 12, Math.atan2(hR[1] - sR[1], hR[0] - sR[0]) + Math.PI / 2), M.chemise, 3);
  main(c, hR[0], hR[1], Math.atan2(hR[1] - sR[1], hR[0] - sR[0]) - Math.PI / 2, 1.05, M.main, false, P.poseR || 'repos', 1);
  c.restore(); c.restore();
}
