// Monde du téléviseur, épisode « Le pouvoir du cadrage » (N&B années 30) : la place et sa fontaine inaugurée, les photographes, la rédaction.
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
function craieNB(c, pts, u, w) { if (u <= 0) return; const n = Math.max(2, Math.ceil(pts.length * u)); ink(c, w, GRIS.noir); c.beginPath(); c.moveTo(...pts[0]); for (let i = 1; i < n; i++) c.lineTo(...pts[Math.min(i, pts.length - 1)]); c.stroke(); }
// ---------------------------------------------------------------- personnages
function figurant(t, x, v, o = {}) { const tq = step(t); return Object.assign({ x, y: 760, s: .5, t: tq, v, face: 1, look: [.5, 0], blink: ((t + v * .7) % 3.1) < .1 ? 1 : 0, tilt: wob(tq, .4, .03, v), bob: bnc(tq, v * .3) * 2.5, handL: [-80, -420], handR: [80, -420] }, o); }
function marche(P, t, vit = 9) { P.walk = t * vit; P.bob = Math.abs(Math.sin(t * vit)) * 7; return P; }
function dessine(c, P, f) { if (P.souffle != null) { dessineVivant(c, P, f || drawFigurant); return; } c.save(); c.translate(0, -(P.bob || 0)); (f || drawFigurant)(c, P); c.restore(); }
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
// ---------------------------------------------------------------- la place en fête (arbre, guirlandes, enfants, flaque, travaux)
function arbre(c, x, y, s, t) {
  c.save(); c.translate(x, y); c.scale(s, s);
  F(c, smooth([[-26, 0], [-20, -120], [-34, -200], [-10, -190], [0, -230], [14, -190], [36, -206], [22, -120], [28, 0]]), GRIS.fonce, 4);
  for (const [dx, dy, r] of [[0, -320, 120], [-110, -260, 90], [110, -260, 90], [-60, -400, 90], [70, -400, 90], [0, -460, 70]]) { F(c, ell(dx + Math.sin(t + dx) * 3, dy, r, r * .8), GRIS.moyen, 4); ink(c, 2, 'rgba(0,0,0,.25)'); for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(dx - r * .4 + k * r * .2, dy + 10, 14, 3.4, 6); c.stroke(); } }
  c.restore();
}
function guirlande(c, x0, y0, x1, y1, t) {
  ink(c, 2, GRIS.noir); c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2, Math.max(y0, y1) + 60, x1, y1); c.stroke();
  for (let k = 1; k < 14; k++) { const u = k / 14, x = (1 - u) * (1 - u) * x0 + 2 * u * (1 - u) * (x0 + x1) / 2 + u * u * x1, y = (1 - u) * (1 - u) * y0 + 2 * u * (1 - u) * (Math.max(y0, y1) + 60) + u * u * y1; c.save(); c.translate(x, y); c.rotate(Math.sin(t * 3 + k) * .1); F(c, poly([[-9, 0], [9, 0], [0, 20]]), k % 2 ? GRIS.blanc : GRIS.fonce, 1.5); c.restore(); }
}
function flaque(c, x, y, t) { F(c, ell(x, y, 90, 18), '#6a6660', 2); c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.ellipse(x - 30, y - 4, 26, 4, 0, 0, 7); c.fill(); for (let k = 0; k < 2; k++) { const r = (t * 30 + k * 20) % 40; ink(c, 1.5, `rgba(255,255,255,${1 - r / 40})`); c.beginPath(); c.ellipse(x + 20, y, r, r * .2, 0, 0, 7); c.stroke(); } }
function travaux(c, x, y) { for (let k = 0; k < 3; k++) { const bx = x + k * 70; F(c, poly([[bx, y - 60], [bx + 64, y - 60], [bx + 64, y - 44], [bx, y - 44]]), GRIS.blanc, 2); c.save(); c.beginPath(); c.rect(bx, y - 60, 64, 16); c.clip(); c.fillStyle = GRIS.noir; for (let q = -2; q < 8; q++) { c.beginPath(); c.moveTo(bx + q * 14, y - 60); c.lineTo(bx + q * 14 + 8, y - 60); c.lineTo(bx + q * 14 - 8, y - 44); c.lineTo(bx + q * 14 - 16, y - 44); c.fill(); } c.restore(); for (const sd of [4, 60]) { ink(c, 4, GRIS.noir); c.beginPath(); c.moveTo(bx + sd, y - 44); c.lineTo(bx + sd, y); c.stroke(); } }
  for (let k = 0; k < 5; k++) F(c, ell(x + 30 + k * 30, y + 4, 14, 6), GRIS.moyen, 1.5); c.save(); c.font = 'bold 13px Georgia'; c.fillStyle = GRIS.noir; c.fillText('TRAVAUX', x + 70, y - 70); c.restore(); }
function enfant(t, x, k, o = {}) { const tq = step(t); return Object.assign({ x, y: 720, s: .32, t: tq, v: k, face: k % 2 ? -1 : 1, look: [.5, 0], rire: (Math.floor(t * 4) + k) % 3 ? 1 : 0, sourire: 1.4, bob: Math.abs(Math.sin(t * 7 + k)) * 14, handL: [-120, -640 - Math.sin(t * 7 + k) * 60], handR: [120, -600 + Math.sin(t * 7 + k) * 60], poseL: 'ouverte', poseR: 'ouverte', chapeau: k % 3 === 0 ? COIFFE.casquette : null }, o); }
const FOULE_FETE = [[120, 2], [190, 4], [860, 5], [940, 6], [1010, 3]];
// o.enfants, o.flaque, o.travaux, o.foule : quoi montrer ; o.ruban : le ruban de l'inauguration (0 tendu → 1 coupé)
function placeFeteNB(c, t, o = {}) {
  if (!_placeNB) _placeNB = fondPlace(); c.drawImage(_placeNB, 0, 0);
  horlogeTour(c, t);
  guirlande(c, 0, 250, 470, 270, t); guirlande(c, 610, 270, 1080, 250, t);
  arbre(c, 120, 560, .9, t);
  if (o.travaux !== false) travaux(c, 690, 600);
  fontaine(c, 540, 650, t);
  if (o.ruban != null) { const r = ease(o.ruban); ink(c, 5, GRIS.blanc); c.beginPath(); c.moveTo(380, 600); c.lineTo(540 - r * 60, 600 + r * 50); c.moveTo(700, 600); c.lineTo(540 + r * 60, 600 + r * 50); c.stroke(); if (r < .1) F(c, ell(540, 600, 22, 16), GRIS.blanc, 2); }
  if (o.foule !== false) for (const [x, v] of FOULE_FETE) dessine(c, figurant(t, x, v, { s: .42, y: 800, face: x < 540 ? 1 : -1, look: [.6, -.1], sourire: 1, chapeau: [COIFFE.casquette, COIFFE.foulard][v % 2] }));
  if (o.enfants !== false) for (let k = 0; k < 3; k++) dessine(c, enfant(t, 390 + k * 55, k));
  if (o.flaque !== false) flaque(c, 850, 772, t);
}
// la vue fixe de la place (pour les photos imprimées) et les cadrages
let _vuePlace = null;
function vuePlace() { if (!_vuePlace) { _vuePlace = document.createElement('canvas'); _vuePlace.width = W; _vuePlace.height = H; const c = _vuePlace.getContext('2d'); placeFeteNB(c, 1.3, {}); c.filter = 'grayscale(1)'; } return _vuePlace; }
const CADRES = { fete: [330, 520, 300, 225], flaque: [720, 640, 260, 195], large: [0, 0, 1080, 810] };
function photo(c, x, y, w, kind, rot = 0, bord = 1) {                  // une photo imprimée de la place, cadrée selon « kind »
  const [sx, sy, sw, sh] = CADRES[kind], h = w * sh / sw;
  c.save(); c.translate(x, y); c.rotate(rot);
  if (bord) F(c, poly([[-w / 2 - 10, -h / 2 - 10], [w / 2 + 10, -h / 2 - 10], [w / 2 + 10, h / 2 + 22], [-w / 2 - 10, h / 2 + 22]]), '#f6f4ee', 2);
  c.save(); c.filter = 'grayscale(1) contrast(1.1)'; c.drawImage(vuePlace(), sx, sy, sw, sh, -w / 2, -h / 2, w, h); c.restore(); ink(c, 2, '#2a2a2a'); c.strokeRect(-w / 2, -h / 2, w, h);
  c.restore();
}
function viseur(c, rect, a = 1) {                                     // ce que voit l'objectif : tout le reste s'assombrit
  if (a <= 0) return; const [x, y, w, h] = rect; c.save(); c.fillStyle = `rgba(0,0,0,${.62 * a})`; c.beginPath(); c.rect(0, 0, W, H); c.rect(x + w, y, -w, h); c.fill('evenodd');
  ink(c, 4, `rgba(255,255,255,${a})`); const L2 = 30; for (const [px, py, dx, dy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) { c.beginPath(); c.moveTo(px + dx * L2, py); c.lineTo(px, py); c.lineTo(px, py + dy * L2); c.stroke(); }
  F(c, ell(x + w / 2, y + h / 2, 6, 6), `rgba(255,255,255,${a * .7})`, 0); c.restore();
}
function appareil(c, x, y, s, a = 0) {                               // appareil photo à soufflet sur trépied
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const dx of [-40, 0, 40]) { ink(c, 5, GRIS.noir); c.beginPath(); c.moveTo(0, 0); c.lineTo(dx, 230); c.stroke(); }
  c.rotate(a); F(c, poly([[-40, -60], [10, -60], [10, 20], [-40, 20]]), GRIS.noir, 3);
  for (let k = 0; k < 4; k++) F(c, poly([[10 + k * 12, -52 + k * 4], [22 + k * 12, -50 + k * 4], [22 + k * 12, 12 - k * 4], [10 + k * 12, 14 - k * 4]]), k % 2 ? GRIS.fonce : GRIS.moyen, 1.5);
  F(c, ell(64, -20, 12, 18), GRIS.fonce, 3); F(c, ell(66, -20, 6, 10), GRIS.blanc, 1);
  c.restore();
}
const PHOTOGRAPHE = (t, x, k, o = {}) => figurant(t, x, [3, 2, 0][k % 3], Object.assign({ s: .48, chapeau: COIFFE.casquette, handL: [-60, -620], handR: [60, -620], poseL: 'poing', poseR: 'poing', look: [.8, 0] }, o));
// ---------------------------------------------------------------- la rédaction et les tableaux
function redaction(c, t) {
  c.fillStyle = '#c4c0b6'; c.fillRect(0, 0, W, H); for (let x = 0; x < W; x += 90) { ink(c, 1.4, 'rgba(0,0,0,.1)'); c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 480); c.stroke(); }
  F(c, poly([[60, 60], [380, 60], [380, 260], [60, 260]]), GRIS.blanc, 4); c.save(); c.font = 'bold 26px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('RÉDACTION', 220, 110); c.restore(); ink(c, 1.4, GRIS.moyen); for (let r = 0; r < 5; r++) { c.beginPath(); c.moveTo(90, 140 + r * 22); c.lineTo(350, 140 + r * 22); c.stroke(); }
  F(c, ell(860, 120, 50, 50), GRIS.blanc, 4); ink(c, 3); c.beginPath(); c.moveTo(860, 120); c.lineTo(860, 86); c.moveTo(860, 120); c.lineTo(884, 130); c.stroke();
  F(c, poly([[0, 480], [W, 480], [W, H], [0, H]]), '#7a766c', 4);                                       // la grande table
  for (let k = 0; k < 6; k++) F(c, poly([[60 + k * 170, 500 + (k % 2) * 10], [190 + k * 170, 500 + (k % 2) * 10], [190 + k * 170, 520 + (k % 2) * 10], [60 + k * 170, 520 + (k % 2) * 10]]), GRIS.blanc, 1.5);
}
function maquette(c, x, y, s, titre, kind, u = 1) {                     // la page en préparation : titre + photo
  c.save(); c.translate(x, y); c.scale(s, s); F(c, poly([[-150, -200], [150, -200], [150, 200], [-150, 200]]), '#f6f4ee', 3);
  c.font = 'bold 13px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('LA GAZETTE DU VILLAGE', 0, -176);
  if (u > 0) { c.font = `bold ${titre.length > 10 ? 30 : 40}px Georgia`; c.fillText(titre.slice(0, Math.ceil(titre.length * Math.min(1, u))), 0, -128); }
  photo(c, 0, -10, 240, kind, 0, 0); ink(c, 1.2, GRIS.moyen); for (let r = 0; r < 4; r++) for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(sd > 0 ? 8 : -130, 110 + r * 18); c.lineTo(sd > 0 ? 130 : -8, 110 + r * 18); c.stroke(); }
  c.restore();
}
function planPlace(c, x, y, s, u) {                                     // plan simple : fontaine, travaux, flaque, trois appareils et leurs angles
  c.save(); c.translate(x, y); c.scale(s, s); F(c, poly([[-260, -170], [260, -170], [260, 170], [-260, 170]]), '#f2efe4', 4);
  ink(c, 1, 'rgba(0,0,0,.12)'); for (let k = -250; k < 260; k += 25) { c.beginPath(); c.moveTo(k, -170); c.lineTo(k, 170); c.stroke(); }
  F(c, ell(0, 0, 50, 50), GRIS.clair, 3); c.font = 'bold 14px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('fontaine', 0, 5);
  F(c, poly([[70, -40], [150, -40], [150, -10], [70, -10]]), GRIS.blanc, 2); c.fillText('travaux', 110, -18); F(c, ell(170, 90, 40, 12), GRIS.moyen, 2); c.fillText('flaque', 170, 120);
  for (let k = 0; k < 3; k++) { c.fillText('enfants', -90, 10 + k * 0); }
  const cams = [[-200, 120, -.8, 'n°1'], [220, -130, 2.1, 'n°2'], [0, -150, 1.57, 'n°3']];
  cams.forEach(([cx, cy, a, nom], k) => { const v = clamp(u * 3 - k); if (v <= 0) return; F(c, poly([[cx - 14, cy - 10], [cx + 14, cy - 10], [cx + 14, cy + 10], [cx - 14, cy + 10]]), GRIS.noir, 2); c.fillText(nom, cx, cy - 16);
    const ouv = k === 2 ? 1.1 : .35; ink(c, 2, `rgba(0,0,0,${.7 * v})`); c.setLineDash([6, 5]); c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a - ouv) * 260 * v, cy + Math.sin(a - ouv) * 260 * v); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a + ouv) * 260 * v, cy + Math.sin(a + ouv) * 260 * v); c.stroke(); c.setLineDash([]); });
  c.restore();
}
function carnetCouts(c, x, y, s, u) {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const sd of [-1, 1]) { F(c, poly([[0, -180], [sd * 240, -170], [sd * 240, 170], [0, 180]]), '#f4f0e2', 4); ink(c, 1, 'rgba(0,0,0,.15)'); for (let r = 0; r < 12; r++) { c.beginPath(); c.moveTo(sd * 10, -140 + r * 26); c.lineTo(sd * 230, -140 + r * 26); c.stroke(); } }
  c.font = 'bold 20px Georgia'; c.fillStyle = GRIS.noir; c.textAlign = 'center'; c.fillText('COMPTES DE LA COMMUNE', 0, -196);
  const lignes = [['Fontaine neuve', '1 200 F'], ['Tuyau à réparer', '80 F'], ['Pavés du trottoir', '45 F'], ['Visiteurs ce jour', '312']];
  c.font = '20px Georgia'; lignes.forEach(([a, b], k) => { if (u * 4 < k) return; c.textAlign = 'left'; c.fillText(a, -220, -110 + k * 52); c.textAlign = 'right'; c.fillText(b, 220, -110 + k * 52); });
  c.restore();
}
function cadreTrait(c, rect, a = 1, txt) {                             // juste le contour d'un cadrage (pointillés)
  if (a <= 0) return; const [x, y, w, h] = rect; ink(c, 4, `rgba(255,255,255,${a})`); c.setLineDash([12, 8]); c.strokeRect(x, y, w, h); c.setLineDash([]);
  if (txt) { c.save(); c.globalAlpha = a; c.font = 'bold 24px Georgia'; c.fillStyle = GRIS.blanc; c.strokeStyle = GRIS.noir; c.lineWidth = 4; c.strokeText(txt, x + 10, y - 12); c.fillText(txt, x + 10, y - 12); c.restore(); }
}
