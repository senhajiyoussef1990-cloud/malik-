// Monde du téléviseur, épisode « La chambre d’écho » : la vallée, les montagnes, le pont, la factrice.
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
function dessine(c, P, f) { if (typeof VIVANT_AUTO !== 'undefined' && P.souffle == null && P.t != null) vivant(P, P.t, { phase: (P.x || 0) * .013 + (P.v || 0), parle: [], ecoute: [] }); if (P.souffle != null) { dessineVivant(c, P, f || drawFigurant); return; } c.save(); c.translate(0, -(P.bob || 0)); (f || drawFigurant)(c, P); c.restore(); }
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
function heros(c, R, M) { const t = (R || M).t; if (R) vivantAuto(R, t, 'renard', M ? M.x : null, 0); if (M) vivantAuto(M, t, 'mouton', R ? R.x : null, 1.7); for (const P of [R, M]) if (P) { if (P.souffle != null) dessineVivant(c, P, P === R ? drawRenard : drawMouton); else { c.save(); c.translate(0, -(P.bob || 0)); (P === R ? drawRenard : drawMouton)(c, P); c.restore(); } } }
function herosTV(t, rx, mx) { const R = renardBase(t), M = moutonBase(t); R.x = rx; R.y = 800; R.s = .5; M.x = mx; M.y = 810; M.s = .47; R.look = [rx < mx ? .8 : -.8, 0]; M.look = [rx < mx ? -.8 : .8, 0]; return [R, M]; }
let _vallee = null;
function fondVallee() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  const ciel = c.createLinearGradient(0, 0, 0, 400); ciel.addColorStop(0, '#d4d2cc'); ciel.addColorStop(1, '#f2f0ea'); c.fillStyle = ciel; c.fillRect(0, 0, W, H);
  // montagnes tout autour
  for (const [pts, col] of [[[[0, 420], [0, 120], [120, 60], [240, 160], [320, 110], [420, 260], [420, 420]], '#9a968c'], [[[660, 420], [700, 220], [800, 90], [900, 150], [980, 60], [1080, 130], [1080, 420]], '#a8a49a'], [[[300, 420], [420, 200], [540, 150], [660, 210], [780, 420]], '#b8b4aa']]) {
    F(c, smooth(pts), col, 4); ink(c, 1.5, 'rgba(0,0,0,.18)'); for (let k = 0; k < 6; k++) { const [x, y] = pts[1 + k % (pts.length - 2)]; c.beginPath(); c.moveTo(x, y + 10); c.lineTo(x - 30, y + 80); c.moveTo(x, y + 10); c.lineTo(x + 30, y + 90); c.stroke(); }
    for (const [x, y] of pts.slice(1, -1)) if (y < 160) F(c, poly([[x - 26, y + 30], [x, y], [x + 26, y + 30], [x + 10, y + 24], [x, y + 34], [x - 10, y + 24]]), GRIS.blanc, 1.5); }   // neige
  // la rivière, le pont, les maisons
  F(c, poly([[0, 470], [W, 470], [W, H], [0, H]]), '#c4c0b6', 3);
  F(c, poly([[840, 470], [890, 470], [930, 540], [990, 640], [1080, 720], [1080, 810], [1010, 810], [950, 690], [880, 580], [820, 500]]), '#8e8a80', 2);   // la rivière
  for (let k = 0; k < 8; k++) { ink(c, 1.5, 'rgba(255,255,255,.5)'); c.beginPath(); c.moveTo(860 + k * 24, 490 + k * 40); c.lineTo(884 + k * 24, 498 + k * 40); c.stroke(); }
  maison(c, 60, 140, 200, '#d0ccc2', 0); maison(c, 220, 130, 180, '#bcb8ae', 1); maison(c, 560, 150, 210, '#c8c4ba', 2);
  F(c, poly([[0, 520], [780, 520], [780, 540], [0, 540]]), '#a8a49a', 0); c.save(); c.beginPath(); c.rect(0, 540, 800, 270); c.clip(); paves(c, 540); c.restore();
  return cv;
}
function pont(c, ouvert, t) {                                      // le pont en arche sur la rivière (barrière si fermé)
  const y0 = 600, by = (x) => y0 - 40 * Math.sin((x - 800) / 240 * Math.PI);
  F(c, smooth([[800, y0 + 50], [800, y0], [920, y0 - 40], [1040, y0], [1040, y0 + 50], [1000, y0 + 50], [920, y0 + 10], [840, y0 + 50]]), '#b8b4aa', 4);   // l'arche en pierre
  for (let k = 0; k < 6; k++) { ink(c, 1.2, 'rgba(0,0,0,.25)'); c.beginPath(); c.moveTo(810 + k * 40, by(810 + k * 40) + 6); c.lineTo(810 + k * 40, by(810 + k * 40) + 40); c.stroke(); }
  ink(c, 4, GRIS.noir); c.beginPath(); for (let x = 800; x <= 1040; x += 10) { const y = by(x) - 40; if (x === 800) c.moveTo(x, y); else c.lineTo(x, y); } c.stroke();   // rambarde
  for (let x = 810; x <= 1030; x += 24) { ink(c, 3, GRIS.noir); c.beginPath(); c.moveTo(x, by(x)); c.lineTo(x, by(x) - 40); c.stroke(); }
  if (!ouvert) { F(c, poly([[790, 540], [830, 540], [830, 556], [790, 556]]), GRIS.blanc, 2); c.save(); c.beginPath(); c.rect(790, 540, 40, 16); c.clip(); c.fillStyle = GRIS.noir; for (let q = 0; q < 5; q++) c.fillRect(790 + q * 12, 540, 6, 16); c.restore(); c.save(); c.font = 'bold 14px Georgia'; c.fillStyle = GRIS.noir; c.fillText('FERMÉ', 780, 534); c.restore(); }
}
function echo(c, x, y, cx, cy, u, txt) {                         // une onde qui part de (x,y), touche la montagne (cx,cy) et revient déformée
  if (u <= 0) return; const k = Math.min(1, u * 2), v = clamp(u * 2 - 1);
  for (let q = 0; q < 3; q++) { const r = 30 + q * 24; ink(c, 3, `rgba(0,0,0,${.5 * (1 - q * .25)})`); c.beginPath(); c.arc(lerp(x, cx, k), lerp(y, cy, k), r * (1 - k * .4), 0, 7); c.stroke(); }
  if (v > 0) { c.save(); c.font = `italic bold ${Math.round(28 - v * 8)}px Georgia`; c.fillStyle = `rgba(20,20,20,${1 - v * .4})`; c.textAlign = 'center'; c.fillText(txt, lerp(cx, x, v * .6), lerp(cy, y, v * .6) - 20 + Math.sin(v * 9) * 6); c.restore(); }
}
function valleeNB(c, t, o = {}) { if (!_vallee) _vallee = fondVallee(); c.drawImage(_vallee, 0, 0); pont(c, o.ouvert, t); }
const ECHOS = [[160, 110, 'fermé… fermé !'], [800, 100, 'le pont… fermé…'], [520, 160, '…est fermé !']];
const CRIEUR = (t, x, o = {}) => figurant(t, x, 0, Object.assign({ s: .48, y: 790, face: 1, chapeau: COIFFE.casquette, look: [.4, -.5] }, o));
const FACTRICE = (t, x, o = {}) => figurant(t, x, 1, Object.assign({ s: .44, y: 790, face: -1, chapeau: COIFFE.kepi, look: [.7, 0], habit: (c2, shY) => { F(c2, smooth([[50, shY + 40], [96, -420], [70, -380], [40, -480]]), GRIS.fonce, 3); F(c2, poly([[56, -430], [110, -430], [110, -370], [56, -370]]), GRIS.moyen, 3); } }, o));   // sacoche
function photoPont(c, x, y, s, date) { c.save(); c.translate(x, y); c.scale(s, s); F(c, poly([[-70, -56], [70, -56], [70, 70], [-70, 70]]), GRIS.blanc, 3); F(c, poly([[-60, -46], [60, -46], [60, 46], [-60, 46]]), GRIS.clair, 2); F(c, smooth([[-50, 30], [-20, 10], [20, 10], [50, 30], [50, 40], [-50, 40]]), GRIS.fonce, 2); F(c, ell(-6, 4, 6, 10), GRIS.noir, 1); c.font = 'italic 13px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText(date, 0, 62); c.restore(); }
