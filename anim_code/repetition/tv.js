// Monde du téléviseur, épisode « La répétition » (N&B années 30) : l'imprimerie, le mur d'affiches, la rue, le marché, la boutique.
function afficheNB(c, x, y, s, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); afficheVainqueurs(c, 0, 0, s, false); c.restore(); }
function briques(c, x0, y0, x1, y1, col) {
  F(c, poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]), col, 0);
  for (let y = y0 + 4, r = 0; y < y1; y += 18, r++) { ink(c, 1.2, 'rgba(0,0,0,.18)'); c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); for (let x = x0 + (r % 2) * 20; x < x1; x += 40) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 18); c.stroke(); } }
}
function paves(c, y0) {
  c.fillStyle = '#8e8a80'; c.fillRect(0, y0, W, H - y0);
  for (let y = y0 + 8; y < H; y += 24) for (let x = ((y / 24) % 2) * 22; x < W + 22; x += 44) { const p = ell(x, y, 20, 10); F(c, p, '#a29e94', 1.5); reflet(c, p, x - 6, y - 3, 7, 3, .35, 0); }
}
// ---------------------------------------------------------------- l'imprimerie
let _imprNB = null;
function fondImprimerie() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  briques(c, 0, 0, W, 560, '#b8b4aa');
  for (let k = 0; k < 3; k++) { const x = 120 + k * 330; F(c, poly([[x, 40], [x + 160, 40], [x + 160, 200], [x, 200]]), GRIS.blanc, 5); ink(c, 3); for (let q = 1; q < 4; q++) { c.beginPath(); c.moveTo(x + q * 40, 40); c.lineTo(x + q * 40, 200); c.stroke(); } c.beginPath(); c.moveTo(x, 120); c.lineTo(x + 160, 120); c.stroke(); }   // verrières
  // casses de caractères
  for (let r = 0; r < 4; r++) { F(c, poly([[30, 260 + r * 50], [250, 260 + r * 50], [250, 300 + r * 50], [30, 300 + r * 50]]), GRIS.fonce, 3); for (let q = 0; q < 10; q++) { ink(c, 1.4, GRIS.moyen); c.strokeRect(36 + q * 21.4, 266 + r * 50, 18, 28); c.fillStyle = GRIS.clair; for (let z = 0; z < 3; z++) c.fillRect(40 + q * 21.4 + z * 5, 280 + r * 50, 3, 8); } }
  F(c, poly([[24, 460], [256, 460], [256, 470], [24, 470]]), GRIS.noir, 2); for (const x of [34, 246]) F(c, poly([[x - 5, 470], [x + 5, 470], [x + 5, 560], [x - 5, 560]]), GRIS.noir, 2);
  // fils à sécher avec affiches
  for (const y of [230, 236]) { ink(c, 2, GRIS.noir); c.beginPath(); c.moveTo(300, y); c.quadraticCurveTo(650, y + 30, 1060, y); c.stroke(); }
  for (let k = 0; k < 6; k++) { const x = 340 + k * 120; afficheNB(c, x, 236 + Math.sin(k / 5 * Math.PI) * 26, .45, (hash(k) - .5) * .08); F(c, poly([[x - 4, 232 + Math.sin(k / 5 * Math.PI) * 26], [x + 4, 232 + Math.sin(k / 5 * Math.PI) * 26], [x + 4, 246 + Math.sin(k / 5 * Math.PI) * 26], [x - 4, 246 + Math.sin(k / 5 * Math.PI) * 26]]), GRIS.fonce, 1); }
  // sol en planches
  c.fillStyle = '#7a766c'; c.fillRect(0, 560, W, H - 560); for (let y = 560; y < H; y += 26) { ink(c, 1.5, 'rgba(0,0,0,.35)'); c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  ink(c, 4); c.beginPath(); c.moveTo(0, 560); c.lineTo(W, 560); c.stroke();
  // piles de papier
  for (let k = 0; k < 4; k++) F(c, poly([[60 + k * 8, 720 - k * 14], [200 + k * 8, 720 - k * 14], [200 + k * 8, 734 - k * 14], [60 + k * 8, 734 - k * 14]]), GRIS.blanc, 2);
  return cv;
}
function presse(c, x, y, t, vit, pile) {                         // presse à rouleaux : volant, deux cylindres, feuille qui sort
  const a = t * vit * 4;
  F(c, poly([[x - 170, y], [x + 170, y], [x + 150, y - 40], [x - 150, y - 40]]), GRIS.noir, 4);                // socle
  for (const sd of [-1, 1]) F(c, poly([[x + sd * 150, y - 40], [x + sd * 120, y - 40], [x + sd * 110, y - 300], [x + sd * 140, y - 300]]), GRIS.fonce, 4);   // bâti
  for (const [cy, r] of [[y - 230, 46], [y - 140, 46]]) { F(c, poly([[x - 116, cy - r], [x + 116, cy - r], [x + 116, cy + r], [x - 116, cy + r]]), GRIS.moyen, 3);
    c.save(); c.beginPath(); c.rect(x - 116, cy - r, 232, 2 * r); c.clip(); ink(c, 2, 'rgba(0,0,0,.35)'); for (let k = 0; k < 8; k++) { const yy = cy + Math.sin(a + k * .8) * r; c.beginPath(); c.moveTo(x - 116, yy); c.lineTo(x + 116, yy); c.stroke(); } c.restore();
    reflet(c, poly([[x - 116, cy - r], [x + 116, cy - r], [x + 116, cy + r], [x - 116, cy + r]]), x, cy - r * .5, 100, 6, .4, 0); }
  // volant à rayons
  const vx = x + 220, vy = y - 180; F(c, ell(vx, vy, 92, 92), 'rgba(0,0,0,0)', 9); ink(c, 9, GRIS.noir); c.beginPath(); c.arc(vx, vy, 92, 0, 7); c.stroke();
  ink(c, 6, GRIS.noir); for (let k = 0; k < 6; k++) { const b = a + k * Math.PI / 3; c.beginPath(); c.moveTo(vx, vy); c.lineTo(vx + Math.cos(b) * 90, vy + Math.sin(b) * 90); c.stroke(); } F(c, ell(vx, vy, 16, 16), GRIS.fonce, 3);
  ink(c, 7, GRIS.fonce); c.beginPath(); c.moveTo(vx, vy); c.lineTo(x + 116, y - 140); c.stroke();                 // bielle
  // la feuille qui sort, et la pile qui monte
  const f = (t * vit) % 1; F(c, poly([[x - 90, y - 94 + f * 10], [x + 90, y - 94 + f * 10], [x + 100 + f * 120, y - 60 + f * 40], [x - 80 + f * 120, y - 60 + f * 40]]), GRIS.blanc, 2);
  const px = x + 280, n = Math.floor(pile); F(c, poly([[px - 70, y], [px + 70, y], [px + 70, y - 20], [px - 70, y - 20]]), GRIS.fonce, 3);
  for (let k = 0; k < Math.min(n, 14); k++) { F(c, poly([[px - 66, y - 20 - k * 6], [px + 66, y - 20 - k * 6], [px + 66, y - 26 - k * 6], [px - 66, y - 26 - k * 6]]), GRIS.blanc, 1.5); }
  if (n > 0) afficheNB(c, px, y - 26 - Math.min(n, 14) * 6 - 70, .42, -1.4);
}
function imprimerieNB(c, t, o = {}) {
  if (!_imprNB) _imprNB = fondImprimerie(); c.drawImage(_imprNB, 0, 0);
  presse(c, 640, 600, t, o.vit != null ? o.vit : 1.2, o.pile || 0);
  // table de composition avec le composteur et la grande affiche-modèle
  F(c, poly([[60, 600], [420, 600], [420, 616], [60, 616]]), GRIS.fonce, 3); for (const x of [76, 404]) F(c, poly([[x - 6, 616], [x + 6, 616], [x + 6, 760], [x - 6, 760]]), GRIS.noir, 2);
  afficheNB(c, 190, 470, .62, -.02);
  if (o.lettres != null) { for (let k = 0; k < 10; k++) { const v = clamp(o.lettres * 10 - k); if (v <= 0) continue; F(c, poly([[110 + k * 16, 596 - v * 6], [124 + k * 16, 596 - v * 6], [124 + k * 16, 580 - v * 6], [110 + k * 16, 580 - v * 6]]), GRIS.clair, 1.5); } }
  if (o.contrat > 0) {                                           // le contrat publicitaire posé sur la table
    const k = ease(o.contrat); c.save(); c.translate(lerp(380, 300, k), lerp(500, 588, k)); c.rotate(lerp(.5, -.08, k));
    F(c, poly([[-70, -10], [70, -10], [70, 10], [-70, 10]]), GRIS.blanc, 3); c.restore();
    if (k > .9) { c.save(); c.translate(300, 470); F(c, poly([[-110, -80], [110, -80], [110, 110], [-110, 110]]), GRIS.blanc, 4); c.font = 'bold 22px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('CONTRAT', 0, -46); c.font = '15px Georgia'; c.fillText('de campagne publicitaire', 0, -20);
      ink(c, 1.4, GRIS.moyen); for (let r = 0; r < 5; r++) { c.beginPath(); c.moveTo(-90, 6 + r * 18); c.lineTo(90 - (r % 2) * 30, 6 + r * 18); c.stroke(); } c.font = 'italic 14px Georgia'; c.fillText('Réclame : 10 000 affiches', 0, 100); c.restore(); }
  }
  if (o.lumiere != null && o.lumiere < 1) { c.fillStyle = `rgba(0,0,0,${.85 * (1 - o.lumiere)})`; c.fillRect(0, 0, W, H); }
}
// ---------------------------------------------------------------- le mur de la rue couvert d'affiches
let _murNB = null;
function fondMur() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.fillStyle = '#eceae4'; c.fillRect(0, 0, W, H);
  briques(c, 0, 0, W, 560, '#c4c0b6');
  F(c, poly([[0, 0], [W, 0], [W, 28], [0, 28]]), GRIS.fonce, 3);
  for (const x of [40, 960]) { F(c, poly([[x, 30], [x + 80, 30], [x + 80, 170], [x, 170]]), GRIS.blanc, 4); ink(c, 3); c.beginPath(); c.moveTo(x + 40, 30); c.lineTo(x + 40, 170); c.stroke(); }
  F(c, poly([[0, 560], [W, 560], [W, 600], [0, 600]]), '#bcb8ae', 3); paves(c, 600);
  // réverbère
  ink(c, 9); c.beginPath(); c.moveTo(1010, 700); c.lineTo(1010, 260); c.stroke(); F(c, poly([[990, 260], [1030, 260], [1022, 214], [998, 214]]), GRIS.blanc, 3);
  return cv;
}
const MUR_GRILLE = (() => { const g = []; for (let r = 0; r < 3; r++) for (let q = 0; q < 8; q++) g.push([150 + q * 100 + (r % 2) * 20, 50 + r * 165, (hash(q * 3 + r) - .5) * .06]); return g; })();
function murAffichesNB(c, t, n) {
  if (!_murNB) _murNB = fondMur(); c.drawImage(_murNB, 0, 0);
  const ordre = [9, 10, 8, 11, 1, 2, 17, 18, 0, 3, 16, 19, 12, 7, 4, 13, 20, 6, 5, 14, 21, 15, 22, 23];
  for (let k = 0; k < Math.min(n, 24); k++) { const [x, y, r] = MUR_GRILLE[ordre[k]], u = clamp(n - k); c.save(); c.globalAlpha = 1; c.translate(x, y + (1 - ease(u)) * -20); afficheNB(c, 0, 0, .58 * (0.85 + .15 * ease(u)), r); c.restore(); }
}
function seau(c, x, y) { F(c, poly([[x - 26, y], [x + 26, y], [x + 32, y - 50], [x - 32, y - 50]]), GRIS.moyen, 3); F(c, ell(x, y - 50, 32, 8), GRIS.fonce, 3); ink(c, 3); c.beginPath(); c.arc(x, y - 50, 30, Math.PI, 0); c.stroke(); }
function pinceau(c, x, y, a) { c.save(); c.translate(x, y); c.rotate(a); F(c, poly([[-4, 0], [4, 0], [4, -90], [-4, -90]]), GRIS.fonce, 2); F(c, poly([[-16, -90], [16, -90], [14, -120], [-14, -120]]), GRIS.noir, 2); c.restore(); }
function echelle(c, x, y) { for (const sd of [-1, 1]) { ink(c, 8, GRIS.fonce); c.beginPath(); c.moveTo(x + sd * 30, y); c.lineTo(x + sd * 22, y - 420); c.stroke(); } ink(c, 6, GRIS.fonce); for (let k = 1; k < 9; k++) { c.beginPath(); c.moveTo(x - 30 + k * .9, y - k * 46); c.lineTo(x + 30 - k * .9, y - k * 46); c.stroke(); } }
// ---------------------------------------------------------------- rue : façade, kiosque, haut-parleur du marché
let _rueKNB = null;
function fondRueKiosque() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.fillStyle = '#eeece6'; c.fillRect(0, 0, W, H);
  for (let k = 0; k < 4; k++) { const x = k * 280 - 20; briques(c, x, 0, x + 272, 520, ['#ccc8be', '#bcb8ae', '#d4d0c6', '#c4c0b6'][k]); F(c, poly([[x, 0], [x + 272, 0], [x + 272, 20], [x, 20]]), GRIS.fonce, 2);
    for (let q = 0; q < 2; q++) { const wx = x + 50 + q * 110; F(c, poly([[wx, 50], [wx + 70, 50], [wx + 70, 150], [wx, 150]]), GRIS.blanc, 3); ink(c, 2.5); c.beginPath(); c.moveTo(wx + 35, 50); c.lineTo(wx + 35, 150); c.moveTo(wx, 92); c.lineTo(wx + 70, 92); c.stroke(); for (let f = 0; f < 4; f++) F(c, ell(wx + 10 + f * 17, 148, 7, 7), GRIS.moyen, 1); } }
  // auvents du marché
  for (let k = 0; k < 10; k++) F(c, poly([[560 + k * 52, 300], [612 + k * 52, 300], [618 + k * 52, 344], [566 + k * 52, 344]]), k % 2 ? GRIS.blanc : GRIS.fonce, 2);
  for (let k = 0; k < 6; k++) { F(c, poly([[600 + k * 80, 470], [660 + k * 80, 470], [660 + k * 80, 520], [600 + k * 80, 520]]), GRIS.fonce, 2); for (let q = 0; q < 4; q++) F(c, ell(612 + k * 80 + q * 13, 466, 8, 7), [GRIS.clair, GRIS.moyen, GRIS.blanc][(q + k) % 3], 1.2); }   // étals
  F(c, poly([[0, 520], [W, 520], [W, 560], [0, 560]]), '#bcb8ae', 3); paves(c, 560);
  return cv;
}
function kiosque(c, x, y) {                                        // kiosque à journaux, l'affiche sur le côté
  F(c, poly([[x - 90, y], [x + 90, y], [x + 90, y - 230], [x - 90, y - 230]]), GRIS.moyen, 4);
  F(c, smooth([[x - 120, y - 230], [x, y - 300], [x + 120, y - 230]]), GRIS.noir, 4); F(c, ell(x, y - 304, 10, 10), GRIS.fonce, 2);
  F(c, poly([[x - 80, y - 210], [x + 80, y - 210], [x + 80, y - 120], [x - 80, y - 120]]), '#4a4844', 3);
  for (let k = 0; k < 5; k++) { F(c, poly([[x - 78 + k * 32, y - 116], [x - 50 + k * 32, y - 116], [x - 50 + k * 32, y - 76], [x - 78 + k * 32, y - 76]]), GRIS.blanc, 1.5); ink(c, 1, GRIS.moyen); for (let r = 0; r < 4; r++) { c.beginPath(); c.moveTo(x - 75 + k * 32, y - 108 + r * 8); c.lineTo(x - 53 + k * 32, y - 108 + r * 8); c.stroke(); } }
  c.save(); c.font = 'bold 18px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText('JOURNAUX', x, y - 240); c.restore();
  afficheNB(c, x + 2, y - 72, .34);
}
function hautParleur(c, x, y, t, on) {
  ink(c, 8, GRIS.noir); c.beginPath(); c.moveTo(x, 560); c.lineTo(x, y + 20); c.stroke();
  c.save(); c.translate(x, y); c.rotate(-.35); F(c, poly([[0, -12], [0, 12], [70, 40], [70, -40]]), GRIS.fonce, 4); F(c, ell(70, 0, 10, 40), GRIS.noir, 3); c.restore();
  if (on) for (let k = 0; k < 3; k++) { const r = 40 + ((t * 60 + k * 30) % 90); ink(c, 3, `rgba(0,0,0,${1 - r / 130})`); c.beginPath(); c.arc(x + 40, y - 30, r, -1.2, .2); c.stroke(); }
  if (on) { c.save(); c.font = 'italic bold 20px Georgia'; c.fillStyle = GRIS.noir; c.textAlign = 'center'; c.fillText('« La boisson des vainqueurs ! »', x + 20, y - 70); c.restore(); }
}
function rueKiosqueNB(c, t, o = {}) {
  if (!_rueKNB) _rueKNB = fondRueKiosque(); c.drawImage(_rueKNB, 0, 0);
  afficheNB(c, 150, 230, .9);                                       // l'affiche sur la façade
  kiosque(c, 420, 560);
  hautParleur(c, 860, 300, t, o.hp);
}
// ---------------------------------------------------------------- la boutique de la marchande
let _boutNB = null;
function bouteille(c, x, y, s, k = 0) { c.save(); c.translate(x, y); c.scale(s, s); const p = smooth([[-14, 0], [-16, -70], [-8, -90], [-8, -112], [8, -112], [8, -90], [16, -70], [14, 0]]); F(c, p, k ? GRIS.moyen : GRIS.fonce, 2.5); F(c, poly([[-12, -60], [12, -60], [12, -30], [-12, -30]]), GRIS.blanc, 1.5); reflet(c, p, -6, -60, 3, 20, .4, 0); c.restore(); }
function fondBoutiqueNB() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.fillStyle = '#d4d0c6'; c.fillRect(0, 0, W, H); for (let x = 0; x < W; x += 36) { c.fillStyle = (x / 36) % 2 ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.08)'; c.fillRect(x, 0, 36, 560); }
  for (let r = 0; r < 3; r++) { F(c, poly([[40, 140 + r * 110], [1040, 140 + r * 110], [1040, 152 + r * 110], [40, 152 + r * 110]]), GRIS.fonce, 3); for (let k = 0; k < 22; k++) bouteille(c, 66 + k * 44, 140 + r * 110, .62, (k + r) % 3 === 0); }
  afficheNB(c, 150, 8, .5); afficheNB(c, 930, 8, .5);
  c.fillStyle = '#9a968c'; c.fillRect(0, 560, W, H - 560); for (let y = 560; y < H; y += 40) for (let x = ((y - 560) / 40 % 2) * 40; x < W; x += 80) { c.fillStyle = GRIS.blanc; c.fillRect(x, y, 40, 40); }
  return cv;
}
function comptoirMarchande(c, x0, x1, y) { F(c, poly([[x0 - 10, y], [x1 + 10, y], [x1 + 10, y + 18], [x0 - 10, y + 18]]), GRIS.moyen, 4); F(c, poly([[x0, y + 18], [x1, y + 18], [x1, H + 20], [x0, H + 20]]), GRIS.fonce, 4);
  for (let x = x0 + 20; x < x1 - 60; x += 110) { ink(c, 3, GRIS.moyen); c.strokeRect(x, y + 40, 90, 150); } }
function boutiqueNB(c, t) { if (!_boutNB) _boutNB = fondBoutiqueNB(); c.drawImage(_boutNB, 0, 0); }
// ---------------------------------------------------------------- tableaux pédagogiques
function deuxColonnes(c, t, u) {                                   // « VU SOUVENT » / « VÉRIFIÉ »
  c.fillStyle = GRIS.clair; c.fillRect(0, 0, W, H);
  const ec = ease(u) * 70;
  for (const [sd, titre] of [[-1, 'VU SOUVENT'], [1, 'VÉRIFIÉ']]) {
    const x = 540 + sd * (230 + ec); F(c, poly([[x - 200, 120], [x + 200, 120], [x + 200, 700], [x - 200, 700]]), GRIS.blanc, 5);
    F(c, poly([[x - 200, 120], [x + 200, 120], [x + 200, 200], [x - 200, 200]]), sd < 0 ? GRIS.fonce : GRIS.noir, 4);
    c.save(); c.font = 'bold 38px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText(titre, x, 174); c.restore();
    if (sd < 0) { for (let k = 0; k < 6; k++) afficheNB(c, x - 120 + (k % 3) * 120, 230 + Math.floor(k / 3) * 220, .5, (hash(k) - .5) * .1); }
    else { c.save(); c.font = 'italic 26px Georgia'; c.textAlign = 'left'; c.fillStyle = GRIS.noir; ['• une étude ?', '• des chiffres ?', '• une source ?'].forEach((l, k) => c.fillText(l, x - 160, 280 + k * 70)); c.restore();
      ink(c, 4, GRIS.noir); for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(x + 110, 260 + k * 70); c.lineTo(x + 150, 260 + k * 70); c.stroke(); } }
  }
}
function deuxBoissons(c, t, u) {                                   // deux boissons, composition et prix lisibles
  c.fillStyle = GRIS.clair; c.fillRect(0, 0, W, H); ink(c, 1.4, 'rgba(0,0,0,.08)'); for (let y = 0; y < H; y += 8) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y + 20); c.stroke(); }
  c.save(); c.translate(-ease(u) * 420, 0);
  [[360, 'LA BOISSON DES VAINQUEURS', ['Eau, sucre : 12 g', 'Arôme', 'Bulles'], '3 F'], [960, 'LIMONADE DU QUARTIER', ['Eau, sucre : 6 g', 'Citron pressé', 'Bulles'], '1 F']].forEach(([x, nom, comp, prix], k) => {
    bouteille(c, x - 120, 640, 3.2, k); F(c, poly([[x - 20, 200], [x + 300, 200], [x + 300, 600], [x - 20, 600]]), GRIS.blanc, 4);
    c.font = 'bold 22px Georgia'; c.fillStyle = GRIS.noir; c.textAlign = 'left'; c.fillText(nom, x, 240); c.font = '24px Georgia'; comp.forEach((l, q) => c.fillText('• ' + l, x + 10, 310 + q * 50));
    c.font = 'bold 48px Georgia'; c.fillText('Prix : ' + prix, x + 10, 540);
  });
  c.restore();
}
// ---------------------------------------------------------------- personnages
function figurant(t, x, v, o = {}) { const tq = step(t); return Object.assign({ x, y: 760, s: .5, t: tq, v, face: 1, look: [.5, 0], blink: ((t + v * .7) % 3.1) < .1 ? 1 : 0, tilt: wob(tq, .4, .03, v), bob: bnc(tq, v * .3) * 2.5, handL: [-80, -420], handR: [80, -420] }, o); }
function marche(P, t, vit = 9) { P.walk = t * vit; P.bob = Math.abs(Math.sin(t * vit)) * 7; return P; }
function dessine(c, P, f) { if (P.souffle != null) { dessineVivant(c, P, f || drawFigurant); return; } c.save(); c.translate(0, -(P.bob || 0)); (f || drawFigurant)(c, P); c.restore(); }
function mainF(P, cote) { const h = cote > 0 ? P.handR : P.handL; return [P.x + h[0] * P.s * (P.face || 1), P.y - (P.bob || 0) + (h[1] + 30) * P.s]; }
function debutFlash(c, t) { if (t < .3) { c.fillStyle = `rgba(255,255,255,${1 - ease(t / .3)})`; c.fillRect(0, 0, W, H); } }
