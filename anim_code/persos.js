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
  const hipY = -470, shY = -712, neckY = -752;
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
  const sL = [-82, shY + 30], sR = [82, shY + 30];
  main(c, hL[0], hL[1] - 8, Math.atan2(hL[1] - sL[1], hL[0] - sL[0]) - Math.PI / 2, 1.1, R.main, true, P.poseL || 'repos', -1);
  tube(c, sL, hL, 14, 40, R.cost); F(c, ell(hL[0], hL[1] - 6, 22, 10, Math.atan2(hL[1] - sL[1], hL[0] - sL[0]) + Math.PI / 2), R.chemise, 3);
  // veste
  const veste = smooth([[-90, shY + 14], [-58, shY - 8], [-30, shY - 18], [30, shY - 18], [58, shY - 8], [90, shY + 14], [76, -560], [84, -390], [0, -376], [-84, -390], [-76, -560]]);
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
  const hy = -848;
  c.save(); c.translate(0, neckY); c.rotate(P.tilt || 0); c.scale(.86, .86); c.translate(0, -neckY);
  const cou = smooth([[-36, neckY + 34], [36, neckY + 34], [32, neckY - 60], [-32, neckY - 60]]); F(c, cou, R.fur, 4); F(c, smooth([[-22, neckY + 34], [22, neckY + 34], [16, neckY - 44], [-16, neckY - 44]]), R.creme, 0); ombre(c, cou, -20, 0, 26, 0, .3);
  ink(c, 2, R.fur2); for (let k = -1; k <= 1; k++) { c.beginPath(); c.moveTo(k * 10, neckY - 10); c.lineTo(k * 10 + 3, neckY + 6); c.stroke(); }
  // ---- oreilles : grandes, bord brun foncé, touffe crème
  for (const sd of [-1, 1]) {
    const tipY = hy - 168 + (P.oreille || 0) * sd * 6;
    const o = smooth([[sd * 18, hy - 50], [sd * 36, hy - 112], [sd * 62, tipY], [sd * 82, hy - 100], [sd * 86, hy - 40]]);
    F(c, o, R.fur, 5);
    c.save(); c.clip(o);
    const gt = c.createLinearGradient(0, tipY, 0, hy - 96); gt.addColorStop(0, R.tip); gt.addColorStop(1, 'rgba(138,52,18,0)');
    c.fillStyle = gt; c.fillRect(-300, tipY - 10, 600, 90);
    ink(c, 10, R.tip); c.beginPath(); c.moveTo(sd * 62, tipY); c.quadraticCurveTo(sd * 84, hy - 104, sd * 86, hy - 40); c.stroke();
    c.restore(); ink(c, 5); c.stroke(o);
    const inn = smooth([[sd * 34, hy - 56], [sd * 46, hy - 110], [sd * 60, hy - 140], [sd * 72, hy - 100], [sd * 72, hy - 54]]);
    F(c, inn, R.inner, 0); ombre(c, inn, sd * 34, hy - 130, sd * 74, hy - 60, .35);
    ink(c, 2, '#fff4e4'); for (let k = 0; k < 6; k++) { const bx = sd * (40 + k * 5); c.beginPath(); c.moveTo(bx, hy - 58); c.quadraticCurveTo(bx + sd * 5, hy - 80 - k * 3, bx + sd * 2, hy - 96 - k * 3); c.stroke(); }
  }
  // ---- crâne rond + joues ébouriffées
  // tête en losange : deux triangles qui s'élargissent jusqu'aux joues, quelques petits poils sur les côtés
  const tete = new Path2D();
  tete.moveTo(0, hy - 90);
  tete.quadraticCurveTo(52, hy - 88, 70, hy - 52);                     // haut du crâne
  tete.lineTo(100, hy + 22);                                            // pente vers la pointe de la joue
  tete.lineTo(92, hy + 28); tete.lineTo(104, hy + 36); tete.lineTo(90, hy + 42); tete.lineTo(97, hy + 50); tete.lineTo(82, hy + 54);   // petits poils
  tete.quadraticCurveTo(52, hy + 88, 0, hy + 104);                      // vers le menton
  tete.quadraticCurveTo(-52, hy + 88, -82, hy + 54);
  tete.lineTo(-97, hy + 50); tete.lineTo(-90, hy + 42); tete.lineTo(-104, hy + 36); tete.lineTo(-92, hy + 28); tete.lineTo(-100, hy + 22);
  tete.lineTo(-70, hy - 52);
  tete.quadraticCurveTo(-52, hy - 88, 0, hy - 90); tete.closePath();
  F(c, tete, R.fur, 5);
  c.save(); c.clip(tete);
  const gr = c.createRadialGradient(-10, hy - 40, 20, 0, hy, 150); gr.addColorStop(0, 'rgba(255,200,140,.28)'); gr.addColorStop(.55, 'rgba(255,200,140,0)'); gr.addColorStop(1, 'rgba(90,25,5,.38)');
  c.fillStyle = gr; c.fillRect(-200, hy - 200, 400, 400);                                                     // volume : front éclairé, côtés dans l'ombre
  // bas du visage crème, avec l'arête orange du museau au milieu
  const creme = smooth([[-96, hy + 40], [-70, hy + 30], [-46, hy + 32], [-30, hy + 44], [-24, hy + 60], [0, hy + 66], [24, hy + 60], [30, hy + 44], [46, hy + 32], [70, hy + 30], [96, hy + 40],
                        [74, hy + 66], [44, hy + 88], [0, hy + 106], [-44, hy + 88], [-74, hy + 66]]);
  F(c, creme, R.creme, 0); ombre(c, creme, 0, hy + 30, 0, hy + 112, .2);
  F(c, smooth([[-14, hy - 18], [14, hy - 18], [22, hy + 20], [26, hy + 46], [0, hy + 58], [-26, hy + 46], [-22, hy + 20]]), R.fur, 0);          // arête du museau, large jusqu'à la truffe
  c.fillStyle = 'rgba(255,215,160,.35)'; c.beginPath(); c.ellipse(0, hy + 4, 6, 18, 0, 0, 7); c.fill();                       // reflet sur l'arête
  c.restore();
  ink(c, 5); c.stroke(tete);
  ink(c, 2.6, R.fur2);                                                                                        // mèches de fourrure
  for (let k = -4; k <= 4; k++) { c.beginPath(); c.moveTo(k * 9, hy - 90); c.quadraticCurveTo(k * 11 + 3, hy - 78, k * 8, hy - 66); c.stroke(); }
  for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) { const y0 = hy + 24 + k * 9; c.beginPath(); c.moveTo(sd * (70 - k * 3), y0); c.lineTo(sd * (84 - k * 3), y0 + 4); c.stroke(); }
  ink(c, 2, 'rgba(255,240,215,.7)'); for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(sd * (60 + k * 7), hy + 44 + k * 7); c.lineTo(sd * (74 + k * 7), hy + 50 + k * 7); c.stroke(); }
  // ---- yeux mi-clos à grosses paupières, sourcils épais
  const lk = P.look || [0, 0], lid = P.lid != null ? P.lid : .5, bl = P.blink ? 1 : 0;
  for (const sd of [-1, 1]) {
    const ex = sd * 40, ey = hy - 4;
    c.save(); c.translate(ex, ey); c.rotate(-sd * .14); c.translate(-ex, -ey);
    F(c, smooth([[ex - 30, ey - 8], [ex - 10, ey - 24], [ex + 14, ey - 24], [ex + 32, ey - 6], [ex + 26, ey + 8], [ex - 24, ey + 8]]), '#e65a14', 0);   // paupière (volume)
    if (bl || (P.wink && sd > 0)) { ink(c, 5); c.beginPath(); c.moveTo(ex - 24, ey + 1); c.quadraticCurveTo(ex, ey + 10, ex + 24, ey - 1); c.stroke(); }
    else {
      const oe = smooth([[ex - 24, ey + 1], [ex - 12, ey - 12], [ex + 10, ey - 13], [ex + 24, ey - 1], [ex + 12, ey + 11], [ex - 12, ey + 11]]);
      F(c, oe, '#fff8ea', 3); c.save(); c.clip(oe);
      F(c, ell(ex + 3 + lk[0] * 7, ey + 2 + lk[1] * 3, 11, 11), '#8a5a1e', 0); F(c, ell(ex + 3 + lk[0] * 7, ey + 2 + lk[1] * 3, 5.5, 6.5), '#1a0c06', 0);
      c.fillStyle = '#fff'; c.beginPath(); c.arc(ex + lk[0] * 7, ey - 2, 2.6, 0, 7); c.fill();
      c.fillStyle = '#e65a14'; c.fillRect(ex - 30, ey - 16, 60, 26 * lid); c.restore();
      ink(c, 5); c.beginPath(); c.moveTo(ex - 24, ey - 13 + 24 * lid); c.quadraticCurveTo(ex, ey - 17 + 24 * lid, ex + 24, ey - 12 + 24 * lid); c.stroke();   // bord de paupière
      ink(c, 2.2); c.beginPath(); c.moveTo(ex - 20, ey + 12); c.quadraticCurveTo(ex, ey + 16, ex + 20, ey + 11); c.stroke();                               // pli sous l'œil
    }
    const br = P.sourcil || 0;
    F(c, smooth([[ex - 34, ey - 22], [ex - 8, ey - 40 - br * 8], [ex + 24, ey - 38 - br * 6], [ex + 36, ey - 26], [ex + 20, ey - 30 - br * 6], [ex - 8, ey - 32 - br * 8]]), '#5a2410', 2);
    c.restore();
  }
  // ---- grosse truffe brillante, sourire large d'une joue à l'autre
  const tr = smooth([[-24, hy + 40], [0, hy + 34], [24, hy + 40], [20, hy + 56], [0, hy + 64], [-20, hy + 56]]);
  F(c, tr, '#2a120a', 3); reflet(c, tr, -8, hy + 42, 9, 4, .55, -.2);
  ink(c, 3.5); c.beginPath(); c.moveTo(0, hy + 64); c.lineTo(0, hy + 72); c.stroke();
  const ouv = P.talk || 0;
  if (ouv < 0.06) {
    ink(c, 4.5); c.beginPath(); c.moveTo(-44, hy + 64); c.quadraticCurveTo(-22, hy + 82, 0, hy + 76); c.quadraticCurveTo(26, hy + 82, 48, hy + 60); c.stroke();
    ink(c, 3.2); c.beginPath(); c.moveTo(44, hy + 57); c.quadraticCurveTo(52, hy + 58, 54, hy + 64); c.stroke();
  } else {
    const h = 14 + ouv * 38;
    const bo = new Path2D(); bo.moveTo(-40, hy + 64); bo.quadraticCurveTo(0, hy + 80, 44, hy + 60); bo.quadraticCurveTo(26, hy + 78 + h, 0, hy + 80 + h); bo.quadraticCurveTo(-26, hy + 80 + h, -40, hy + 64); bo.closePath();
    F(c, bo, '#5a1a12', 4); c.save(); c.clip(bo); c.fillStyle = '#d0605a'; c.beginPath(); c.ellipse(3, hy + 82 + h, 20, h * .5, 0, 0, 7); c.fill();
    c.fillStyle = '#fff8ee'; c.beginPath(); c.moveTo(-36, hy + 64); c.quadraticCurveTo(0, hy + 80, 40, hy + 62); c.lineTo(36, hy + 71); c.quadraticCurveTo(0, hy + 88, -32, hy + 72); c.fill(); c.restore();
  }
  c.fillStyle = 'rgba(120,50,20,.55)'; [[-30, hy + 58], [-36, hy + 66], [-26, hy + 68], [30, hy + 58], [36, hy + 66], [26, hy + 68]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 1.8, 0, 7); c.fill(); });   // points des moustaches
  c.restore();
  // bras avant
  main(c, hR[0], hR[1] - 8, Math.atan2(hR[1] - sR[1], hR[0] - sR[0]) - Math.PI / 2, 1.1, R.main, true, P.poseR || 'repos', 1);
  tube(c, sR, hR, -14, 40, R.cost); F(c, ell(hR[0], hR[1] - 6, 22, 10, Math.atan2(hR[1] - sR[1], hR[0] - sR[0]) + Math.PI / 2), R.chemise, 3);
  for (let k = 1; k <= 2; k++) F(c, ell(lerp(hR[0], sR[0], .1 * k), lerp(hR[1], sR[1], .1 * k), 4, 4), '#3a1608', 1.5);
  c.restore(); c.restore();
}

// ============================================================ LE MOUTON
const MOUTON = { casq: '#b8471c', casq2: '#8e3412', laine: '#f4ddb8', laine2: '#dcbc8f', visage: '#f7d0a4', oreille: '#f2c39c', oreilleIn: '#eea08f',
  gilet: '#b4491a', gilet2: '#8a3410', chemise: '#f6e5cc', pant: '#c35a1f', pant2: '#97401a', noeud: '#a8231c', main: '#f4c79a', chaus: '#a04a1c', bouton: '#d0823c' };
function drawMouton(c, P) {
  const M = MOUTON, t = P.t || 0, s = P.s || 1;
  c.save(); c.translate(P.x, P.y); c.scale(s * (P.face || 1), s);
  const hipY = -440, shY = -636, neckY = -660, hy = -756;
  // ---- jambes fines, espacées, revers, chaussettes, chaussures collées aux chaussettes
  for (const sd of [-1, 1]) {
    const ph = P.walk ? Math.sin(P.walk + (sd > 0 ? Math.PI : 0)) : 0;
    const hip = [sd * 40, hipY], ank = [sd * 50 + ph * 50, -88 - Math.max(0, ph) * 18];
    tube(c, hip, ank, sd * 3 - ph * 8, 76, M.pant, INK, false);
    c.save(); c.translate(sd * 8, 0); c.strokeStyle = 'rgba(40,14,4,.2)'; c.lineWidth = 16; c.lineCap = 'round'; c.beginPath(); c.moveTo(...hip); c.lineTo(...ank); c.stroke(); c.restore();
    const cuff = smooth([[ank[0] - 42, ank[1] - 10], [ank[0] + 42, ank[1] - 10], [ank[0] + 42, ank[1] + 40], [ank[0] - 42, ank[1] + 40]]);
    F(c, cuff, M.pant, 5); chevrons(c, cuff, M.pant2, 11); ombre(c, cuff, ank[0] - 40, 0, ank[0] + 40, 0, .25); ink(c, 5); c.stroke(cuff);
    ink(c, 2, 'rgba(60,20,6,.5)'); c.beginPath(); c.moveTo(ank[0] - 40, ank[1] + 4); c.lineTo(ank[0] + 40, ank[1] + 4); c.stroke();
    const so = poly([[ank[0] - 24, ank[1] + 38], [ank[0] + 24, ank[1] + 38], [ank[0] + 24, ank[1] + 52], [ank[0] - 24, ank[1] + 52]]);
    F(c, so, '#ead2ad', 3); ink(c, 1.4, 'rgba(120,80,40,.5)'); for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(ank[0] + k * 8, ank[1] + 40); c.lineTo(ank[0] + k * 8, ank[1] + 50); c.stroke(); }
    c.save(); c.translate(ank[0] + sd * 6, ank[1] + 88); c.rotate(sd * .08); chaussure(c, 0, 0, sd > 0 ? 1 : -1, M.chaus, 1.18); c.restore();   // le dessus de la chaussure touche la chaussette
  }
  c.save(); c.translate(0, hipY); c.rotate(P.lean || 0); c.translate(0, -hipY);
  const hL = P.handL || [-104, -366], hR = P.handR || [104, -366];
  const sL = [-80, shY + 22], sR = [80, shY + 22];
  // ---- manches bouffantes (arrière)
  { const a = Math.atan2(hL[1] - sL[1], hL[0] - sL[0]), E = [hL[0] - Math.cos(a) * 30, hL[1] - Math.sin(a) * 30];
    main(c, E[0] + Math.cos(a) * 2, E[1] + Math.sin(a) * 2, a - Math.PI / 2, .98, M.main, false, P.poseL || 'repos', -1);   // la main sort de la manche
    tube(c, sL, E, 16, 54, M.chemise);
    const cf = ell(E[0], E[1], 27, 13, a + Math.PI / 2); F(c, cf, M.chemise, 4); ombre(c, cf, E[0] - 20, E[1], E[0] + 20, E[1], .25); }
  // ---- haut du pantalon, chemise, gilet tricoté
  const ht = poly([[-80, -470], [80, -470], [84, -410], [-84, -410]]); F(c, ht, M.pant, 5); chevrons(c, ht, M.pant2, 11);
  const ch = smooth([[-82, shY], [-40, shY - 14], [40, shY - 14], [82, shY], [78, -470], [-78, -470]]); F(c, ch, M.chemise, 5); ombre(c, ch, -40, shY, 80, -470, .2);
  const gilet = poly([[-72, shY + 2], [-22, shY + 2], [0, shY + 66], [22, shY + 2], [72, shY + 2], [78, -450], [40, -440], [0, -422], [-40, -440], [-78, -450]]);
  F(c, gilet, M.gilet, 5); chevrons(c, gilet, M.gilet2, 11); ombre(c, gilet, -40, shY, 80, -430, .32); reflet(c, gilet, -40, shY + 60, 18, 56, .1, .1); ink(c, 5); c.stroke(gilet);
  for (const sd of [-1, 1]) {
    F(c, poly([[sd * 22, shY + 2], [sd * 40, shY + 2], [sd * 8, shY + 86], [sd * 2, shY + 70]]), M.gilet2, 3);                // revers du gilet
    F(c, poly([[sd * 30, -500], [sd * 64, -502], [sd * 64, -490], [sd * 30, -488]]), M.gilet2, 2.5);                          // poches passepoilées
  }
  [-560, -524, -488].forEach(y => { F(c, ell(0, y, 8, 8), M.bouton, 3); c.fillStyle = 'rgba(255,240,210,.6)'; c.beginPath(); c.arc(-2, y - 2, 2.6, 0, 7); c.fill(); });
  ink(c, 1.4, 'rgba(255,220,190,.45)'); c.setLineDash([4, 3]); c.beginPath(); c.moveTo(-74, -452); c.lineTo(-40, -444); c.lineTo(0, -428); c.lineTo(40, -444); c.lineTo(74, -452); c.stroke(); c.setLineDash([]);
  // ---- cou, col, nœud papillon
  F(c, poly([[-16, neckY + 24], [16, neckY + 24], [14, neckY - 26], [-14, neckY - 26]]), M.visage, 3);
  for (const sd of [-1, 1]) F(c, poly([[sd * 4, shY - 12], [sd * 34, shY - 16], [sd * 22, shY + 14]]), M.chemise, 2.5);
  const ny = neckY + 18;
  F(c, smooth([[0, ny], [-34, ny - 16], [-38, ny + 16]]), M.noeud, 4); F(c, smooth([[0, ny], [34, ny - 16], [38, ny + 16]]), M.noeud, 4); F(c, ell(0, ny, 8, 9), '#8a1a14', 3);
  ink(c, 1.6, 'rgba(60,0,0,.5)'); for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(sd * 10, ny - 6); c.lineTo(sd * 28, ny - 10); c.stroke(); c.beginPath(); c.moveTo(sd * 10, ny + 6); c.lineTo(sd * 30, ny + 10); c.stroke(); }
  // ---- tête
  c.save(); c.translate(0, neckY); c.rotate(P.tilt || 0); c.translate(0, -neckY);
  for (const sd of [-1, 1]) {                                                                               // longues oreilles bien visibles
    const ao = (P.oreille || 0) * sd;
    c.save(); c.translate(sd * 58, hy - 10); c.rotate(sd * (0.18 + ao));
    const o = smooth([[0, -14], [sd * 44, -26], [sd * 96, -16], [sd * 112, 0], [sd * 86, 16], [sd * 40, 18], [0, 14]]);
    F(c, o, M.oreille, 4); F(c, smooth([[sd * 14, -6], [sd * 50, -14], [sd * 92, -6], [sd * 72, 8], [sd * 34, 8]]), M.oreilleIn, 0);
    ombre(c, o, 0, -20, 0, 20, .25); c.restore();
  }
  const vis = smooth([[-46, hy - 50], [0, hy - 58], [46, hy - 50], [60, hy - 14], [62, hy + 26], [44, hy + 64], [18, hy + 84], [0, hy + 87], [-18, hy + 84], [-44, hy + 64], [-62, hy + 26], [-60, hy - 14]]);
  F(c, vis, M.visage, 5); ombre(c, vis, -30, hy - 30, 60, hy + 80, .22); reflet(c, vis, -20, hy - 26, 16, 10, .2);
  c.fillStyle = 'rgba(240,140,120,.22)'; for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * 40, hy + 40, 12, 7, 0, 0, 7); c.fill(); }
  // laine : frange sur le front et côtés jusqu'aux joues — pas de laine au menton
  const laine = [[-70, hy + 34], [-74, hy + 10], [-74, hy - 16], [-66, hy - 40], [-50, hy - 58], [-28, hy - 64], [-6, hy - 66], [16, hy - 66], [38, hy - 62], [58, hy - 50], [70, hy - 28], [76, hy - 2], [74, hy + 24], [68, hy + 44]];
  for (const [x, y] of laine) F(c, ell(x, y, 20, 18), M.laine2, 3.5);
  for (const [x, y] of laine) F(c, ell(x - 1, y - 2, 16, 14), M.laine, 0);
  for (const [x, y] of laine) { c.fillStyle = 'rgba(255,255,250,.55)'; c.beginPath(); c.ellipse(x - 6, y - 6, 6, 4, -.5, 0, 7); c.fill(); }
  ink(c, 2, M.laine2); for (const [x, y] of laine) { c.beginPath(); c.arc(x + 2, y + 1, 8, 0.3, 2.6); c.stroke(); }
  F(c, smooth([[-50, hy - 44], [0, hy - 52], [50, hy - 44], [44, hy - 30], [0, hy - 38], [-44, hy - 30]]), M.visage, 0);   // le front passe sous la frange
  const lk = P.look || [0, 0];
  for (const sd of [-1, 1]) {
    const ex = sd * 26, ey = hy + 4;
    if (P.blink || P.rire) { ink(c, 5); c.beginPath(); c.moveTo(ex - 18, ey + 2); c.quadraticCurveTo(ex, ey - 12, ex + 18, ey + 2); c.stroke(); }
    else {
      F(c, ell(ex, ey, 19, 22), '#fffaf0', 3.5);
      F(c, ell(ex + lk[0] * 6, ey + 3 + lk[1] * 5, 11, 12), '#8a4416', 0); F(c, ell(ex + lk[0] * 6, ey + 3 + lk[1] * 5, 5.5, 6.5), '#1a0a04', 0);
      c.fillStyle = '#fff'; c.beginPath(); c.arc(ex + lk[0] * 6 - 4, ey - 2, 3.4, 0, 7); c.fill();
      ink(c, 2, 'rgba(90,40,14,.55)'); c.beginPath(); c.moveTo(ex - 16, ey + 18); c.quadraticCurveTo(ex, ey + 24, ex + 16, ey + 18); c.stroke();
    }
    const fr = P.froncer != null ? P.froncer : .6;                                                            // sourcils épais, froncés vers le centre
    F(c, smooth([[ex - sd * 22, ey - 30 - (1 - fr) * 4], [ex, ey - 36 - (1 - fr) * 6], [ex + sd * 20, ey - 30 + fr * 8], [ex + sd * 16, ey - 24 + fr * 8], [ex, ey - 30 - (1 - fr) * 6], [ex - sd * 20, ey - 25]]), '#4a2410', 2);
  }
  F(c, smooth([[-9, hy + 44], [9, hy + 44], [0, hy + 54]]), '#e88c86', 2.5);                                    // petit nez
  ink(c, 3); c.beginPath(); c.moveTo(0, hy + 54); c.lineTo(0, hy + 60); c.stroke();
  if ((P.talk || 0) < .06 && !P.rire) { ink(c, 3.5); c.beginPath(); c.moveTo(-10, hy + 64); c.quadraticCurveTo(-4, hy + 60, 0, hy + 61); c.quadraticCurveTo(4, hy + 60, 10, hy + 64); c.stroke(); }
  else bouche(c, 0, hy + 64, 34, Math.max(P.talk || 0, P.rire ? .8 : 0), P.rire ? 1.4 : (P.sourire != null ? P.sourire : .3), '#6a2016');
  // ---- grande casquette plate en tweed, plus large que la tête
  const cq = smooth([[-118, hy - 76], [-104, hy - 122], [-60, hy - 150], [0, hy - 158], [64, hy - 150], [108, hy - 120], [120, hy - 80], [104, hy - 62], [0, hy - 70], [-104, hy - 62]]);
  F(c, cq, M.casq, 5); chevrons(c, cq, M.casq2, 12); ombre(c, cq, -50, hy - 150, 100, hy - 66, .32); reflet(c, cq, -46, hy - 128, 38, 12, .18); ink(c, 5); c.stroke(cq);
  ink(c, 2.4, M.casq2); for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(k * 6, hy - 156); c.quadraticCurveTo(k * 28, hy - 124, k * 36, hy - 74); c.stroke(); }
  const vi = smooth([[-96, hy - 62], [0, hy - 76], [100, hy - 60], [90, hy - 44], [0, hy - 54], [-88, hy - 46]]);
  F(c, vi, M.casq2, 4); chevrons(c, vi, '#6a2408', 10); ink(c, 4); c.stroke(vi);
  ink(c, 1.4, 'rgba(255,220,190,.5)'); c.setLineDash([4, 3]); c.beginPath(); c.moveTo(-84, hy - 56); c.quadraticCurveTo(0, hy - 68, 88, hy - 54); c.stroke(); c.setLineDash([]);
  F(c, ell(2, hy - 160, 16, 9), M.casq, 4);
  c.restore();
  // ---- manche avant
  { const a = Math.atan2(hR[1] - sR[1], hR[0] - sR[0]), E = [hR[0] - Math.cos(a) * 30, hR[1] - Math.sin(a) * 30];
    main(c, E[0] + Math.cos(a) * 2, E[1] + Math.sin(a) * 2, a - Math.PI / 2, .98, M.main, false, P.poseR || 'repos', 1);   // la main sort de la manche
    tube(c, sR, E, -16, 54, M.chemise);
    const cf = ell(E[0], E[1], 27, 13, a + Math.PI / 2); F(c, cf, M.chemise, 4); ombre(c, cf, E[0] - 20, E[1], E[0] + 20, E[1], .25); }
  c.restore(); c.restore();
}
