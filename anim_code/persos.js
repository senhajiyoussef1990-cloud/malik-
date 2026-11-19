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
// membre souple (manche / jambe) : courbe de A à B passant près d'un coude décalé de « bend »
function tube(c, A, B, bend, w, col, edge = INK) {
  const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1;
  const C = [mx - dy / L * bend, my + dx / L * bend];
  c.lineCap = 'round'; c.strokeStyle = edge; c.lineWidth = w + 8;
  c.beginPath(); c.moveTo(...A); c.quadraticCurveTo(...C, ...B); c.stroke();
  c.strokeStyle = col; c.lineWidth = w; c.stroke();
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
function main(c, x, y, ang, s, col, griffes = false) {
  c.save(); c.translate(x, y); c.rotate(ang); c.scale(s, s);
  F(c, smooth([[-14, -20], [16, -22], [30, -6], [34, 16], [24, 34], [4, 40], [-14, 30], [-22, 8]]), col, 4);
  ink(c, 3); [[-6, 30, -2, 44], [6, 32, 10, 46], [18, 28, 22, 40]].forEach(([a, b, cc, d]) => { c.beginPath(); c.moveTo(a, b); c.quadraticCurveTo((a + cc) / 2 + 3, (b + d) / 2, cc, d); c.stroke(); });
  if (griffes) { c.fillStyle = '#3a1a0c'; [[-1, 46], [11, 48], [23, 42]].forEach(([a, b]) => { c.beginPath(); c.ellipse(a, b, 3, 4, 0, 0, 7); c.fill(); }); }
  F(c, smooth([[-20, -6], [-30, 8], [-22, 22], [-12, 12]]), col, 3);                  // pouce
  c.restore();
}
function chaussure(c, x, y, dir, col, s = 1) {
  c.save(); c.translate(x, y); c.scale(dir * s, s);
  const p = smooth([[-34, 0], [-30, -30], [6, -36], [40, -24], [58, -8], [54, 6], [-30, 8]]);
  F(c, p, col, 5); F(c, poly([[-34, 2], [56, 2], [54, 12], [-32, 12]]), '#5a2a10', 3);
  c.fillStyle = 'rgba(255,240,220,.45)'; c.beginPath(); c.ellipse(22, -24, 14, 5, -.2, 0, 7); c.fill();
  ink(c, 2.5); for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(-6 + k * 9, -30); c.lineTo(2 + k * 9, -22); c.stroke(); }
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
    const hip = [sd * 30, hipY], foot = [sd * 36 + ph * 60, -42 - Math.max(0, ph) * 22];
    tube(c, hip, foot, sd * 4 - ph * 10, 58, R.cost);
    chaussure(c, foot[0] + sd * 4, foot[1] + 40, sd > 0 ? 1 : -1, R.chaus, 1.15);
  }
  c.save(); c.translate(0, hipY); c.rotate(P.lean || 0); c.translate(0, -hipY);
  // bras arrière
  const hL = P.handL || [-104, -440], hR = P.handR || [104, -440];
  const sL = [-84, shY + 20], sR = [84, shY + 20];
  tube(c, sL, hL, 14, 40, R.cost); F(c, ell(hL[0], hL[1] - 6, 22, 10, Math.atan2(hL[1] - sL[1], hL[0] - sL[0]) + Math.PI / 2), R.chemise, 3);
  main(c, hL[0], hL[1] + 4, Math.atan2(hL[1] - sL[1], hL[0] - sL[0]) - Math.PI / 2, 1.1, R.main, true);
  // veste
  const veste = smooth([[-88, shY], [-50, shY - 14], [50, shY - 14], [88, shY], [74, -560], [84, -390], [0, -376], [-84, -390], [-74, -560]]);
  F(c, veste, R.cost, 5); rayures(c, veste, R.ray, 16);
  ink(c, 5); c.stroke(veste);
  // gilet + chemise + cravate
  F(c, poly([[-46, shY - 6], [46, shY - 6], [52, -420], [0, -400], [-52, -420]]), '#4d1f10', 4);
  rayures(c, poly([[-46, shY - 6], [46, shY - 6], [52, -420], [0, -400], [-52, -420]]), '#6a321c', 14);
  F(c, poly([[-30, shY - 14], [30, shY - 14], [0, shY + 70]]), R.chemise, 4);
  F(c, poly([[-12, shY - 4], [12, shY - 4], [18, shY + 90], [0, shY + 116], [-18, shY + 90]]), R.cravate, 3);
  F(c, poly([[-12, shY - 4], [12, shY - 4], [6, shY + 10], [-6, shY + 10]]), '#d44f0a', 2);
  for (const sd of [-1, 1]) F(c, poly([[sd * 28, shY - 14], [sd * 56, shY - 4], [sd * 30, -560], [sd * 14, shY + 80]]), '#4a1d0e', 4);   // revers
  [-640, -600, -560, -520].forEach(y => F(c, ell(0, y, 6, 6), '#3a1608', 2));
  F(c, poly([[46, shY + 64], [72, shY + 58], [68, shY + 74], [48, shY + 76]]), R.chemise, 2);            // pochette
  ink(c, 4, R.or); c.beginPath(); c.moveTo(-40, -560); c.quadraticCurveTo(-10, -520, 4, -548); c.quadraticCurveTo(24, -520, 46, -560); c.stroke();
  // tête
  const hy = -862;
  c.save(); c.translate(0, neckY); c.rotate(P.tilt || 0); c.scale(.86, .86); c.translate(0, -neckY);
  F(c, poly([[-26, neckY + 10], [26, neckY + 10], [20, neckY - 40], [-20, neckY - 40]]), R.fur2, 3);
  for (const sd of [-1, 1]) {                                                                              // oreilles
    const o = poly([[sd * 34, hy - 50], [sd * 80, hy - 160 + (P.oreille || 0) * sd * 6], [sd * 104, hy - 40]]);
    F(c, o, R.fur, 5); F(c, poly([[sd * 46, hy - 54], [sd * 80, hy - 140], [sd * 92, hy - 52]]), R.inner, 0);
    c.save(); c.clip(o); c.fillStyle = R.tip; c.fillRect(-300, hy - 200, 600, 70); c.restore(); ink(c, 5); c.stroke(o);
  }
  const tete = smooth([[0, hy - 66], [60, hy - 58], [92, hy - 20], [116, hy + 8], [92, hy + 22], [100, hy + 40], [64, hy + 56], [30, hy + 84], [0, hy + 92],
                       [-30, hy + 84], [-64, hy + 56], [-100, hy + 40], [-92, hy + 22], [-116, hy + 8], [-92, hy - 20], [-60, hy - 58]]);
  F(c, tete, R.fur, 5);
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
  main(c, hR[0], hR[1] + 4, Math.atan2(hR[1] - sR[1], hR[0] - sR[0]) - Math.PI / 2, 1.1, R.main, true);
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
  main(c, hL[0], hL[1], Math.atan2(hL[1] - sL[1], hL[0] - sL[0]) - Math.PI / 2, 1.05, M.main);
  // pantalon haut (taille)
  F(c, poly([[-94, -450], [94, -450], [100, -330], [-100, -330]]), M.pant, 5);
  chevrons(c, poly([[-94, -450], [94, -450], [100, -330], [-100, -330]]), M.pant2, 12);
  // chemise + gilet tricoté
  F(c, smooth([[-92, shY], [92, shY], [96, -460], [-96, -460]]), M.chemise, 5);
  const gilet = poly([[-80, shY + 4], [-24, shY + 4], [0, shY + 70], [24, shY + 4], [80, shY + 4], [88, -400], [0, -380], [-88, -400]]);
  F(c, gilet, M.gilet, 5); chevrons(c, gilet, M.gilet2, 12); ink(c, 5); c.stroke(gilet);
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
  ink(c, 2.5, M.laine2); for (const [x, y] of laine) { c.beginPath(); c.arc(x + 4, y + 2, 12, 0.3, 2.4); c.stroke(); }
  const vis = smooth([[-58, hy - 40], [0, hy - 54], [58, hy - 40], [66, hy + 8], [52, hy + 62], [22, hy + 88], [0, hy + 92], [-22, hy + 88], [-52, hy + 62], [-66, hy + 8]]);
  F(c, vis, M.visage, 5);
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
  F(c, cq, M.casq, 5); chevrons(c, cq, M.casq2, 13); ink(c, 5); c.stroke(cq);
  const visiere = smooth([[-92, hy - 56], [0, hy - 70], [96, hy - 54], [86, hy - 40], [0, hy - 48], [-84, hy - 42]]);
  F(c, visiere, M.casq2, 4);
  ink(c, 2.5, M.casq2); for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(k * 8, hy - 128); c.quadraticCurveTo(k * 26, hy - 100, k * 30, hy - 66); c.stroke(); }
  F(c, ell(4, hy - 132, 16, 9), M.casq, 4);
  c.restore();
  tube(c, sR, hR, -18, 58, M.chemise); F(c, ell(hR[0], hR[1] - 10, 26, 12, Math.atan2(hR[1] - sR[1], hR[0] - sR[0]) + Math.PI / 2), M.chemise, 3);
  main(c, hR[0], hR[1], Math.atan2(hR[1] - sR[1], hR[0] - sR[0]) - Math.PI / 2, 1.05, M.main);
  c.restore(); c.restore();
}
