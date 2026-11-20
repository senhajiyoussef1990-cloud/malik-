// Monde du téléviseur, épisode « La peur et la rumeur » (N&B années 30) : le village, la ruelle et l'entrepôt, la boulangerie.
function briques(c, x0, y0, x1, y1, col) {
  F(c, poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]), col, 0);
  for (let y = y0 + 4, r = 0; y < y1; y += 18, r++) { ink(c, 1.2, 'rgba(0,0,0,.16)'); c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); for (let x = x0 + (r % 2) * 20; x < x1; x += 40) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 18); c.stroke(); } }
}
function paves(c, y0) { c.fillStyle = '#8e8a80'; c.fillRect(0, y0, W, H - y0); for (let y = y0 + 8; y < H; y += 24) for (let x = ((y / 24) % 2) * 22; x < W + 22; x += 44) { const p = ell(x, y, 20, 10); F(c, p, '#a29e94', 1.5); reflet(c, p, x - 6, y - 3, 7, 3, .35, 0); } }
function maison(c, x, w, h, col, k) {
  const top = 520 - h; F(c, poly([[x, 520], [x + w, 520], [x + w, top], [x, top]]), col, 4);
  F(c, poly([[x - 14, top], [x + w + 14, top], [x + w / 2, top - 70]]), GRIS.fonce, 4);
  for (let y = top - 60; y < top; y += 12) { ink(c, 1, 'rgba(255,255,255,.18)'); c.beginPath(); c.moveTo(x + w / 2 - (y - top + 70) * w / 140, y); c.lineTo(x + w / 2 + (y - top + 70) * w / 140, y); c.stroke(); }   // tuiles
  F(c, poly([[x + w * .7, top - 40], [x + w * .7 + 20, top - 40], [x + w * .7 + 20, top - 80], [x + w * .7, top - 80]]), GRIS.moyen, 2);
  for (let r = 0; r < 2; r++) for (let q = 0; q < 2; q++) { const wx = x + 24 + q * (w - 80), wy = top + 30 + r * 100; if (wy > 400) continue; F(c, poly([[wx, wy], [wx + 40, wy], [wx + 40, wy + 60], [wx, wy + 60]]), (k + r + q) % 3 ? GRIS.blanc : '#6a6660', 3); ink(c, 2); c.beginPath(); c.moveTo(wx + 20, wy); c.lineTo(wx + 20, wy + 60); c.stroke();
    for (const sd of [-1, 1]) F(c, poly([[wx + (sd < 0 ? -16 : 40), wy], [wx + (sd < 0 ? 0 : 56), wy], [wx + (sd < 0 ? 0 : 56), wy + 60], [wx + (sd < 0 ? -16 : 40), wy + 60]]), GRIS.fonce, 2); }   // volets
}
// ---------------------------------------------------------------- la place du village
let _placeNB = null;
function fondPlace() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  const ciel = c.createLinearGradient(0, 0, 0, 400); ciel.addColorStop(0, '#d8d6d0'); ciel.addColorStop(1, '#f2f0ea'); c.fillStyle = ciel; c.fillRect(0, 0, W, H);
  // tour de l'horloge
  F(c, poly([[470, 520], [610, 520], [600, 90], [480, 90]]), '#c8c4ba', 4); for (let y = 100; y < 520; y += 20) { ink(c, 1, 'rgba(0,0,0,.14)'); c.beginPath(); c.moveTo(478, y); c.lineTo(604, y); c.stroke(); }
  F(c, poly([[466, 90], [614, 90], [540, -10]]), GRIS.fonce, 4); F(c, poly([[490, 380], [590, 380], [590, 520], [490, 520]]), GRIS.noir, 3);
  F(c, smooth([[490, 380], [540, 340], [590, 380]]), GRIS.noir, 3);
  // maisons de part et d'autre
  maison(c, -20, 200, 330, '#d0ccc2', 0); maison(c, 200, 230, 280, '#bcb8ae', 1); maison(c, 640, 210, 300, '#c8c4ba', 2); maison(c, 880, 220, 340, '#d4d0c6', 3);
  // la boulangerie (à gauche) et la boutique au store (à droite)
  F(c, poly([[220, 520], [420, 520], [420, 410], [220, 410]]), '#5a5650', 3); F(c, poly([[236, 510], [330, 510], [330, 424], [236, 424]]), GRIS.blanc, 2);
  for (let k = 0; k < 4; k++) F(c, ell(256 + k * 20, 500, 9, 6), GRIS.moyen, 1.5); F(c, smooth([[250, 470], [300, 456], [316, 470], [300, 480]]), GRIS.moyen, 2);
  F(c, poly([[230, 380], [410, 380], [410, 404], [230, 404]]), GRIS.blanc, 2.5); c.save(); c.font = 'bold 18px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('BOULANGERIE', 320, 398); c.restore();
  F(c, poly([[340, 510], [404, 510], [404, 424], [340, 424]]), GRIS.fonce, 2.5);
  F(c, poly([[660, 520], [840, 520], [840, 400], [660, 400]]), '#4a4844', 3); c.save(); c.font = 'bold 16px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText('MERCERIE', 750, 392); c.restore();
  // l'entrée de la ruelle (à droite)
  F(c, poly([[1000, 520], [1080, 520], [1080, 330], [1000, 330]]), '#2a2826', 3);
  // pavés + fontaine
  F(c, poly([[0, 520], [W, 520], [W, 540], [0, 540]]), '#bcb8ae', 3); paves(c, 540);
  return cv;
}
function fontaine(c, x, y, t) {
  F(c, ell(x, y, 160, 34), GRIS.fonce, 4); F(c, ell(x, y - 8, 146, 28), '#6a6660', 3); F(c, ell(x, y - 10, 130, 22), GRIS.clair, 2);
  F(c, poly([[x - 16, y - 10], [x + 16, y - 10], [x + 10, y - 120], [x - 10, y - 120]]), GRIS.moyen, 3); F(c, ell(x, y - 120, 56, 12), GRIS.fonce, 3); F(c, ell(x, y - 150, 14, 24), GRIS.moyen, 3);
  ink(c, 2.5, 'rgba(255,255,255,.85)'); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + t; c.beginPath(); c.moveTo(x, y - 170); c.quadraticCurveTo(x + Math.cos(a) * 50, y - 200, x + Math.cos(a) * 56, y - 120 + ((t * 3 + k) % 1) * 4); c.stroke(); }
  for (let k = 0; k < 5; k++) { ink(c, 1.5, 'rgba(255,255,255,.6)'); c.beginPath(); c.ellipse(x - 60 + k * 30, y - 10, 10 + ((t * 20 + k * 7) % 14), 3, 0, 0, 7); c.stroke(); }
}
function horlogeTour(c, t) { F(c, ell(540, 180, 40, 40), GRIS.blanc, 4); ink(c, 3); const m = t * .3; c.beginPath(); c.moveTo(540, 180); c.lineTo(540 + Math.sin(m) * 30, 180 - Math.cos(m) * 30); c.moveTo(540, 180); c.lineTo(540 + Math.sin(m / 12 + 5.8) * 20, 180 - Math.cos(m / 12 + 5.8) * 20); c.stroke(); }
function nuit(c, a) { if (a <= 0) return; c.fillStyle = `rgba(10,10,20,${.55 * a})`; c.fillRect(0, 0, W, H); const g = c.createRadialGradient(880, 110, 10, 880, 110, 140); g.addColorStop(0, `rgba(255,255,255,${.9 * a})`); g.addColorStop(.3, `rgba(255,255,255,${.25 * a})`); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(700, 0, 380, 300); F(c, ell(880, 110, 30, 30), `rgba(250,250,240,${a})`, 0); }
// store : 0 ouvert → 1 baissé ; affiche : le dessin du monstre placardé ; rumeur : texte alarmant sur le mur
function placeNB(c, t, o = {}) {
  if (!_placeNB) _placeNB = fondPlace(); c.drawImage(_placeNB, 0, 0);
  horlogeTour(c, t);
  if (o.store > 0) { const h = 110 * ease(o.store); F(c, poly([[660, 400], [840, 400], [840, 400 + h], [660, 400 + h]]), GRIS.clair, 3); ink(c, 1.4, 'rgba(0,0,0,.3)'); for (let y = 408; y < 400 + h; y += 10) { c.beginPath(); c.moveTo(662, y); c.lineTo(838, y); c.stroke(); } }
  if (o.affiche) { c.save(); c.translate(940, 300); c.rotate(.05); F(c, poly([[-60, -80], [60, -80], [60, 80], [-60, 80]]), GRIS.blanc, 3); dessinMonstre(c, 0, 10, .45, 1); c.font = 'bold 15px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('DANGER !', 0, -58); c.restore(); }
  fontaine(c, 540, 650, t);
  nuit(c, o.nuit || 0);
}
// ---------------------------------------------------------------- la ruelle et l'entrepôt
let _ruelleNB = null;
function fondRuelle() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.fillStyle = '#e4e2dc'; c.fillRect(0, 0, W, H);
  // murs en perspective
  F(c, poly([[0, 0], [380, 220], [380, 560], [0, 810]]), '#b8b4aa', 4); F(c, poly([[W, 0], [700, 220], [700, 560], [W, 810]]), '#aca89e', 4);
  for (let k = 0; k < 14; k++) { const u = k / 14; ink(c, 1.2, 'rgba(0,0,0,.16)'); c.beginPath(); c.moveTo(0, u * 810); c.lineTo(380, 220 + u * 340); c.stroke(); c.beginPath(); c.moveTo(W, u * 810); c.lineTo(700, 220 + u * 340); c.stroke(); }
  // le fond : l'entrepôt et sa porte
  F(c, poly([[380, 220], [700, 220], [700, 560], [380, 560]]), '#c4c0b6', 4); c.save(); c.font = 'bold 22px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('ENTREPÔT', 540, 260); c.restore();
  F(c, poly([[380, 560], [700, 560], [W, 810], [0, 810]]), '#8e8a80', 3);
  for (let k = 0; k < 10; k++) { ink(c, 1.2, 'rgba(0,0,0,.25)'); c.beginPath(); c.moveTo(380 + k * 32, 560); c.lineTo(k * 108, 810); c.stroke(); }
  // tonneaux et caisses
  for (const [x, y, s] of [[160, 760, 1.1], [240, 700, .9]]) { F(c, smooth([[x - 40 * s, y], [x - 46 * s, y - 50 * s], [x - 40 * s, y - 100 * s], [x + 40 * s, y - 100 * s], [x + 46 * s, y - 50 * s], [x + 40 * s, y]]), GRIS.fonce, 3); for (const yy of [.25, .75]) { ink(c, 3, GRIS.noir); c.beginPath(); c.moveTo(x - 45 * s, y - yy * 100 * s); c.lineTo(x + 45 * s, y - yy * 100 * s); c.stroke(); } }
  F(c, poly([[820, 760], [960, 760], [960, 640], [820, 640]]), GRIS.moyen, 3); ink(c, 3); c.beginPath(); c.moveTo(820, 640); c.lineTo(960, 760); c.moveTo(960, 640); c.lineTo(820, 760); c.stroke();
  return cv;
}
// porte : angle d'ouverture (0 fermée), charniere : 0 rouillée → 1 réparée
function ruelleNB(c, t, o = {}) {
  if (!_ruelleNB) _ruelleNB = fondRuelle(); c.drawImage(_ruelleNB, 0, 0);
  const a = o.porte || 0, pw = 120 * Math.cos(a);
  F(c, poly([[480, 560], [600, 560], [600, 330], [480, 330]]), GRIS.noir, 3);                    // l'ouverture
  F(c, poly([[480, 560], [480 + pw, 560 + Math.sin(a) * 20], [480 + pw, 330 - Math.sin(a) * 20], [480, 330]]), '#6a6660', 4);
  for (let k = 1; k < 4; k++) { ink(c, 2, 'rgba(0,0,0,.4)'); c.beginPath(); c.moveTo(480 + pw * k / 4, 335); c.lineTo(480 + pw * k / 4, 555); c.stroke(); }
  for (const y of [360, 520]) { F(c, poly([[470, y - 8], [500, y - 8], [500, y + 8], [470, y + 8]]), o.charniere ? GRIS.noir : '#4a4440', 2); if (!o.charniere) { c.fillStyle = 'rgba(80,60,40,.6)'; c.beginPath(); c.arc(476, y + 6, 4, 0, 7); c.fill(); } }
  nuit(c, o.nuit != null ? o.nuit : 1);
  if (o.lanterne) for (const [lx, ly] of o.lanterne) { const g = c.createRadialGradient(lx, ly, 5, lx, ly, 260); g.addColorStop(0, 'rgba(255,250,220,.55)'); g.addColorStop(1, 'rgba(255,250,220,0)'); c.fillStyle = g; c.fillRect(lx - 260, ly - 260, 520, 520); }
  if (o.nuage) { const nx = 700 + ((t * 40) % 600); c.fillStyle = 'rgba(30,30,40,.7)'; c.beginPath(); c.ellipse(nx, 110, 90, 26, 0, 0, 7); c.ellipse(nx + 50, 96, 60, 22, 0, 0, 7); c.fill(); }
}
function lanterne(c, x, y, on = 1) { ink(c, 3, GRIS.noir); c.beginPath(); c.moveTo(x, y - 40); c.lineTo(x, y - 24); c.stroke(); F(c, poly([[x - 16, y - 24], [x + 16, y - 24], [x + 12, y + 24], [x - 12, y + 24]]), `rgba(255,248,210,${.6 + .4 * on})`, 3); F(c, poly([[x - 20, y - 24], [x + 20, y - 24], [x, y - 40]]), GRIS.noir, 2); F(c, poly([[x - 14, y + 24], [x + 14, y + 24], [x + 14, y + 30], [x - 14, y + 30]]), GRIS.noir, 2); F(c, ell(x, y + 2, 5, 9), '#fff2a0', 0); }
// ---------------------------------------------------------------- le dessin du monstre (u : avancement du crayon)
function dessinMonstre(c, x, y, s, u) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const tete = []; for (let k = 0; k <= 30; k++) { const a = k / 30 * Math.PI * 2; tete.push([Math.cos(a) * 110 * (1 + .15 * Math.sin(a * 5)), -40 + Math.sin(a) * 90]); }
  craieNB(c, tete, clamp(u * 2), 6);
  if (u > .45) { F(c, ell(-40, -70, 18, 22), GRIS.noir, 0); F(c, ell(40, -70, 18, 22), GRIS.noir, 0); }
  const dents = [[-80, 0]]; for (let k = 0; k < 8; k++) dents.push([-70 + k * 20, k % 2 ? 0 : 50]); dents.push([90, 0]);
  craieNB(c, dents, clamp((u - .55) * 2.5), 5);
  craieNB(c, [[-100, -110], [-130, -170], [-70, -125]], clamp((u - .8) * 5), 5); craieNB(c, [[100, -110], [130, -170], [70, -125]], clamp((u - .85) * 6), 5);   // cornes
  c.restore();
}
function craieNB(c, pts, u, w) { if (u <= 0) return; const n = Math.max(2, Math.ceil(pts.length * u)); ink(c, w, GRIS.noir); c.beginPath(); c.moveTo(...pts[0]); for (let i = 1; i < n; i++) c.lineTo(...pts[Math.min(i, pts.length - 1)]); c.stroke(); }
// ---------------------------------------------------------------- personnages
function figurant(t, x, v, o = {}) { const tq = step(t); return Object.assign({ x, y: 760, s: .5, t: tq, v, face: 1, look: [.5, 0], blink: ((t + v * .7) % 3.1) < .1 ? 1 : 0, tilt: wob(tq, .4, .03, v), bob: bnc(tq, v * .3) * 2.5, handL: [-80, -420], handR: [80, -420] }, o); }
function marche(P, t, vit = 9) { P.walk = t * vit; P.bob = Math.abs(Math.sin(t * vit)) * 7; return P; }
function dessine(c, P, f) { c.save(); c.translate(0, -(P.bob || 0)); (f || drawFigurant)(c, P); c.restore(); }
function mainF(P, cote) { const h = cote > 0 ? P.handR : P.handL; return [P.x + h[0] * P.s * (P.face || 1), P.y - (P.bob || 0) + (h[1] + 30) * P.s]; }
function debutFlash(c, t) { if (t < .3) { c.fillStyle = `rgba(255,255,255,${1 - ease(t / .3)})`; c.fillRect(0, 0, W, H); } }
const VEILLEUR = (t, x, o = {}) => figurant(t, x, 3, Object.assign({ chapeau: COIFFE.kepi, s: .5 }, o));
const VOISINE = (t, x, o = {}) => figurant(t, x, 1, Object.assign({ chapeau: COIFFE.foulard, s: .48, tablier: 'blanc' }, o));
const BOULANGER = (t, x, o = {}) => figurant(t, x, 0, Object.assign({ chapeau: COIFFE.toque, tablier: 'blanc', s: .52 }, o));
// le monde N&B avec, par-dessus, le renard et le mouton en couleur (ils entrent dans l'histoire)
function nbEtCouleur(c, t, keys, dessinNB, dessinCouleur) {
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, keys); dessinNB(cc); });
  c.save(); cam(c, t, keys); dessinCouleur(c); c.restore();
  c.fillStyle = `rgba(255,250,235,${.03 + hash(Math.floor(t * 24)) * .05})`; c.fillRect(0, 0, W, H);
}
