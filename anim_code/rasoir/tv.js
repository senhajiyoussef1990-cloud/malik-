// Monde du téléviseur, épisode « La mauvaise haleine » : Amérique des années 1920 — l’hôpital, l’agence de réclame, le dictionnaire, la noce, les magazines.
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
const LUNETTES = (grosses) => (c, hy) => { const r = grosses ? 22 : 15; for (const sd of [-1, 1]) { ink(c, grosses ? 6 : 3, GRIS.noir); c.beginPath(); c.arc(sd * 18, hy - 10, r, 0, 7); c.stroke(); } ink(c, 3, GRIS.noir); c.beginPath(); c.moveTo(-18 + r, hy - 12); c.lineTo(18 - r, hy - 12); c.stroke(); };
function habitBlouse(c, shY) { const b = smooth([[-70, shY + 10], [70, shY + 10], [86, -140], [-86, -140]]); F(c, b, GRIS.blanc, 4); ombre(c, b, -80, 0, 80, 0, .2); F(c, poly([[-18, shY + 8], [18, shY + 8], [0, shY + 80]]), GRIS.fonce, 2); for (const y of [-520, -440, -360, -280]) F(c, ell(0, y, 5, 5), GRIS.moyen, 1.5); F(c, poly([[34, -480], [66, -480], [66, -440], [34, -440]]), GRIS.clair, 2); ink(c, 3, GRIS.noir); c.beginPath(); c.moveTo(44, -490); c.lineTo(44, -462); c.stroke(); }
// ---------------------------------------------------------------- objets N&B
function oeufNB(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); F(c, smooth([[-40, 4], [-34, -20], [-10, -30], [18, -28], [38, -12], [40, 10], [20, 26], [-10, 28], [-32, 20]]), GRIS.blanc, 2.5); F(c, ell(4, -2, 15, 13), GRIS.moyen, 2.5); c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.ellipse(-1, -7, 5, 3, -.5, 0, 7); c.fill(); c.restore(); }
function trancheNB(c, x, y, s, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); const h = [], b = []; for (let k = 0; k <= 8; k++) { const u = k / 8, xx = -60 + u * 120, w = Math.sin(u * Math.PI * 3) * 6; h.push([xx, -10 + w]); b.unshift([xx, 10 + w]); } F(c, smooth(h.concat(b)), GRIS.fonce, 2.5); ink(c, 3.5, GRIS.clair); c.beginPath(); for (let k = 0; k <= 8; k++) { const u = k / 8, xx = -56 + u * 112, w = Math.sin(u * Math.PI * 3) * 6; k ? c.lineTo(xx, w) : c.moveTo(xx, w); } c.stroke(); c.restore(); }
function assietteNB(c, x, y, s, menu, fumee = 0) {
  c.save(); c.translate(x, y); c.scale(s, s); F(c, ell(0, 0, 120, 44), GRIS.blanc, 3); ink(c, 2.5, GRIS.moyen); c.beginPath(); c.ellipse(0, 0, 108, 38, 0, 0, 7); c.stroke();
  if (menu === 'copieux') { trancheNB(c, -36, -10, .5, -.2); trancheNB(c, -26, 8, .5, -.05); oeufNB(c, 44, -6, .72); oeufNB(c, 30, 14, .62); }
  else { F(c, smooth([[-60, 10], [-56, -16], [0, -26], [56, -16], [60, 10], [0, 18]]), GRIS.clair, 3); ink(c, 1.5, 'rgba(0,0,0,.3)'); for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(k * 20 - 6, -14); c.lineTo(k * 20 + 6, 4); c.stroke(); } }   // un morceau de pain
  if (fumee) for (let k = 0; k < 3; k++) { const u = (fumee * .6 + k * .33) % 1; ink(c, 3, `rgba(255,255,255,${.6 * (1 - u)})`); c.beginPath(); c.moveTo(-20 + k * 24, -30 - u * 70); c.bezierCurveTo(-36 + k * 24, -56 - u * 70, -4 + k * 24, -72 - u * 70, -20 + k * 24, -96 - u * 70); c.stroke(); }
  c.restore();
}
function tasseNB(c, x, y, s, fumee = 0) { c.save(); c.translate(x, y); c.scale(s, s); F(c, ell(0, 6, 40, 10), GRIS.blanc, 2); F(c, smooth([[-26, -36], [26, -36], [22, 0], [-22, 0]]), GRIS.blanc, 3); F(c, ell(0, -36, 26, 6), GRIS.noir, 2); ink(c, 5, GRIS.blanc); c.beginPath(); c.arc(30, -20, 10, -1.4, 1.4); c.stroke(); if (fumee) for (let k = 0; k < 2; k++) { const u = (fumee * .7 + k * .5) % 1; ink(c, 2.5, `rgba(255,255,255,${.7 * (1 - u)})`); c.beginPath(); c.moveTo(-6 + k * 12, -44 - u * 50); c.quadraticCurveTo(-16 + k * 12, -60 - u * 50, -6 + k * 12, -80 - u * 50); c.stroke(); } c.restore(); }
function calendrier(c, x, y, s, annee, mois = 'AVRIL') { c.save(); c.translate(x, y); c.scale(s, s); F(c, poly([[-60, -80], [60, -80], [60, 80], [-60, 80]]), GRIS.blanc, 3); F(c, poly([[-60, -80], [60, -80], [60, -44], [-60, -44]]), GRIS.noir, 2); c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.font = 'bold 18px Georgia'; c.fillText(mois, 0, -56); c.fillStyle = GRIS.noir; c.font = 'bold 50px Georgia'; c.fillText(String(annee), 0, 24); ink(c, 1, 'rgba(0,0,0,.3)'); for (let r = 0; r < 3; r++) { c.beginPath(); c.moveTo(-46, 44 + r * 12); c.lineTo(46, 44 + r * 12); c.stroke(); } F(c, ell(0, -86, 6, 6), GRIS.fonce, 2); c.restore(); }
function telephone(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); F(c, ell(0, 0, 34, 10), GRIS.noir, 2); F(c, poly([[-6, 0], [6, 0], [5, -110], [-5, -110]]), GRIS.noir, 2); F(c, smooth([[-18, -110], [18, -110], [14, -134], [-14, -134]]), GRIS.noir, 2); F(c, poly([[24, -70], [34, -70], [36, -40], [22, -40]]), GRIS.noir, 2); ink(c, 3, GRIS.noir); c.beginPath(); c.moveTo(0, -60); c.quadraticCurveTo(40, -30, 28, -40); c.stroke(); c.restore(); }
function enveloppe(c, x, y, s, rot = 0, oui = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); F(c, poly([[-50, -32], [50, -32], [50, 32], [-50, 32]]), GRIS.blanc, 2.5); ink(c, 2, GRIS.moyen); c.beginPath(); c.moveTo(-50, -32); c.lineTo(0, 6); c.lineTo(50, -32); c.stroke(); F(c, poly([[26, -26], [44, -26], [44, -8], [26, -8]]), GRIS.clair, 1.5); if (oui) { c.save(); c.rotate(-.2); c.globalAlpha = oui; ink(c, 4, GRIS.noir); c.strokeRect(-36, -6, 64, 30); c.font = 'bold 24px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('OUI', -4, 18); c.restore(); } c.restore(); }
// la une : « LES MÉDECINS RECOMMANDENT UN PETIT-DÉJEUNER COPIEUX »
function uneJournal(c, x, y, s, o = {}) {
  c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.scale(s, s);
  F(c, poly([[-200, -270], [200, -270], [200, 270], [-200, 270]]), GRIS.blanc, 4); ombre(c, poly([[-200, -270], [200, -270], [200, 270], [-200, 270]]), -200, -270, 200, 270, .15);
  c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.font = 'bold 40px Georgia'; c.fillText('THE DAILY NEWS', 0, -222); F(c, poly([[-186, -206], [186, -206], [186, -200], [-186, -200]]), GRIS.noir, 0);
  c.font = 'italic 13px Georgia'; c.fillText('New York — édition du matin — 1925', 0, -184);
  const u = o.titre == null ? 1 : o.titre, lignes = ['LES MÉDECINS', 'RECOMMANDENT UN', 'PETIT-DÉJEUNER', 'COPIEUX !']; c.font = 'bold 34px Georgia';
  lignes.forEach((l, k) => { const v = clamp(u * 4 - k); if (v > 0) { c.save(); c.globalAlpha = v; c.fillText(l, 0, -128 + k * 46); c.restore(); } });
  c.font = 'italic bold 18px Georgia'; c.fillText('« 4 500 docteurs sur 5 000 l’affirment »', 0, 70);
  F(c, poly([[-180, 90], [-10, 90], [-10, 240], [-180, 240]]), GRIS.clair, 2); if (o.photo !== false) { assietteNB(c, -95, 180, .62, 'copieux'); }
  ink(c, 1.2, 'rgba(0,0,0,.35)'); for (let r = 0; r < 10; r++) { c.beginPath(); c.moveTo(10, 96 + r * 15); c.lineTo(184, 96 + r * 15); c.stroke(); }
  c.restore();
}
// la carte du pays : des assiettes qui apparaissent de ville en ville
const VILLES = [[260, 300], [380, 420], [520, 330], [640, 460], [760, 300], [840, 420], [330, 560], [600, 580], [900, 250], [460, 200], [720, 560], [200, 440]];
function carteNB(c, t, u) {
  c.fillStyle = GRIS.clair; c.fillRect(0, 0, W, H);
  const pays = smooth([[120, 260], [260, 180], [500, 170], [760, 180], [960, 160], [990, 300], [930, 420], [960, 560], [820, 640], [640, 610], [520, 690], [380, 610], [200, 600], [110, 470]]);
  F(c, pays, GRIS.blanc, 5); ombre(c, pays, 120, 160, 990, 690, .15); ink(c, 1.4, 'rgba(0,0,0,.2)'); c.setLineDash([6, 6]); for (const xx of [300, 500, 700, 860]) { c.beginPath(); c.moveTo(xx, 170); c.lineTo(xx + 30, 660); c.stroke(); } c.setLineDash([]);
  c.font = 'bold 30px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('ÉTATS-UNIS — 1925', 540, 90);
  VILLES.forEach(([x, y], k) => { const v = clamp(u * VILLES.length - k); if (v <= 0) return; const p = v < 1 ? 1 + Math.sin(v * Math.PI) * .4 : 1; F(c, ell(x, y + 16, 8, 3), 'rgba(0,0,0,.3)', 0); assietteNB(c, x, y, .55 * p * Math.min(1, v * 2), 'copieux'); });
}
// le schéma : VENDEUR → BLOUSE → PUBLIC
function schemaNB(c, t, u, cache = 0) {
  c.fillStyle = GRIS.clair; c.fillRect(0, 0, W, H);
  const pos = [[200, 400], [540, 400], [880, 400]], noms = ['LE VENDEUR', 'LE MÉDECIN', 'LE PUBLIC'];
  pos.forEach(([x, y], k) => { const v = ease(clamp(u * 3 - k)); if (v <= 0) return; c.save(); c.globalAlpha = v; F(c, ell(x, y, 120, 120), GRIS.blanc, 5);
    if (k === 0) { trancheNB(c, x, y - 10, .9, -.1); trancheNB(c, x, y + 20, .9, .05); }
    if (k === 1) { const b = smooth([[x - 56, y - 70], [x + 56, y - 70], [x + 70, y + 80], [x - 70, y + 80]]); F(c, b, GRIS.blanc, 4); F(c, poly([[x - 16, y - 70], [x + 16, y - 70], [x, y]]), GRIS.fonce, 2); for (const yy of [y + 10, y + 40]) F(c, ell(x, yy, 5, 5), GRIS.moyen, 1.5); ink(c, 5, GRIS.noir); c.beginPath(); c.moveTo(x - 30, y - 64); c.quadraticCurveTo(x - 40, y + 10, x - 10, y + 20); c.stroke(); F(c, ell(x - 10, y + 24, 9, 9), GRIS.fonce, 2); }
    if (k === 2) for (let q = 0; q < 5; q++) { const px = x - 70 + q * 35, py = y + 20 + (q % 2) * 16; F(c, ell(px, py - 40, 15, 17), GRIS.peau, 2.5); F(c, smooth([[px - 20, py - 18], [px + 20, py - 18], [px + 24, py + 30], [px - 24, py + 30]]), [GRIS.fonce, GRIS.moyen][q % 2], 2.5); }
    c.font = 'bold 28px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText(noms[k], x, y + 170); c.restore(); });
  for (let k = 0; k < 2; k++) { const v = clamp(u * 3 - k - .8); if (v <= 0) continue; const x0 = pos[k][0] + 130, x1 = lerp(x0, pos[k + 1][0] - 130, v); ink(c, 8, GRIS.noir); c.beginPath(); c.moveTo(x0, 400); c.lineTo(x1, 400); c.stroke(); if (v > .9) F(c, poly([[x1, 384], [x1 + 24, 400], [x1, 416]]), GRIS.noir, 0); }
  if (cache > 0) { c.save(); c.globalAlpha = cache; F(c, ell(200, 400, 128, 128), 'rgba(28,26,24,.72)', 0); c.font = 'italic bold 30px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText('caché', 200, 410); c.restore(); }
}
// ---------------------------------------------------------------- la cuisine d'une famille (o.menu : 'leger' | 'copieux' ; o.annee)
let _cuisNB = null;
function fondCuisine() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.fillStyle = '#d8d4ca'; c.fillRect(0, 0, W, 430); for (let x = 0; x < W; x += 36) { c.fillStyle = (x / 36) % 2 ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.12)'; c.fillRect(x, 0, 18, 430); }   // papier peint rayé
  for (let y = 430; y < 640; y += 30) for (let x = ((y - 430) / 30 % 2) * 30; x < W; x += 60) F(c, poly([[x, y], [x + 30, y], [x + 30, y + 30], [x, y + 30]]), (x / 30 + y / 30) % 2 ? GRIS.blanc : GRIS.clair, .8);   // carrelage
  F(c, poly([[0, 424], [W, 424], [W, 436], [0, 436]]), GRIS.fonce, 2);
  c.fillStyle = '#7e7a70'; c.fillRect(0, 640, W, H - 640); for (let y = 650; y < H; y += 26) { ink(c, 1.4, 'rgba(0,0,0,.3)'); c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  // fenêtre avec rideaux bonne femme
  F(c, poly([[620, 90], [860, 90], [860, 380], [620, 380]]), GRIS.blanc, 6); const ciel = c.createLinearGradient(0, 100, 0, 370); ciel.addColorStop(0, '#f8f8f4'); ciel.addColorStop(1, '#c8c6be'); c.fillStyle = ciel; c.fillRect(632, 102, 216, 266);
  for (const [x, h] of [[640, 120], [700, 80], [770, 140], [820, 100]]) F(c, poly([[x, 368], [x + 50, 368], [x + 50, 368 - h], [x, 368 - h]]), GRIS.moyen, 1.5);   // immeubles au loin
  ink(c, 6, GRIS.blanc); c.beginPath(); c.moveTo(740, 100); c.lineTo(740, 370); c.moveTo(630, 235); c.lineTo(850, 235); c.stroke();
  for (const sd of [-1, 1]) { const x = sd < 0 ? 612 : 868; F(c, smooth([[x, 80], [x - sd * 70, 80], [x - sd * 40, 240], [x - sd * 70, 390], [x, 390]]), GRIS.blanc, 3); ink(c, 1.2, 'rgba(0,0,0,.25)'); for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(x - sd * k * 15, 84); c.quadraticCurveTo(x - sd * (k * 10 + 10), 240, x - sd * k * 15, 386); c.stroke(); } }
  F(c, poly([[596, 70], [884, 70], [884, 86], [596, 86]]), GRIS.fonce, 2);
  // cuisinière en fonte, à gauche
  F(c, poly([[30, 640], [300, 640], [300, 420], [30, 420]]), GRIS.noir, 5); F(c, poly([[20, 420], [310, 420], [310, 400], [20, 400]]), GRIS.fonce, 4);
  for (const x of [90, 230]) { F(c, ell(x, 402, 46, 8), GRIS.fonce, 2.5); } F(c, poly([[60, 470], [270, 470], [270, 590], [60, 590]]), GRIS.fonce, 3); F(c, ell(165, 530, 26, 26), GRIS.moyen, 3); ink(c, 3, GRIS.clair); c.beginPath(); c.moveTo(120, 480); c.lineTo(210, 480); c.stroke();
  F(c, poly([[150, 400], [180, 400], [180, 60], [150, 60]]), GRIS.noir, 3);   // tuyau du poêle
  // étagère avec pots
  F(c, poly([[330, 250], [560, 250], [560, 262], [330, 262]]), GRIS.fonce, 3); for (let k = 0; k < 5; k++) F(c, smooth([[350 + k * 44, 250], [346 + k * 44, 212], [384 + k * 44, 212], [380 + k * 44, 250]]), [GRIS.blanc, GRIS.moyen, GRIS.clair][k % 3], 2.5);
  return cv;
}
function chaise(c, x, y, sd) { F(c, poly([[x - 40, y - 150], [x + 40, y - 150], [x + 40, y - 136], [x - 40, y - 136]]), GRIS.fonce, 3); for (const dx of [-36, 36]) { ink(c, 7, GRIS.noir); c.beginPath(); c.moveTo(x + dx, y - 136); c.lineTo(x + dx, y); c.stroke(); } ink(c, 7, GRIS.noir); c.beginPath(); c.moveTo(x - sd * 36, y - 150); c.lineTo(x - sd * 40, y - 330); c.moveTo(x - sd * 36 + 0, y - 260); c.lineTo(x - sd * 36 + sd * 0, y - 260); c.stroke(); F(c, poly([[x - sd * 34, y - 320], [x - sd * 44, y - 320], [x - sd * 44, y - 200], [x - sd * 34, y - 200]]), GRIS.fonce, 2); }
function tableNB(c, x, y, w) {
  const nappe = poly([[x - w, y], [x + w, y], [x + w + 20, y + 120], [x - w - 20, y + 120]]); F(c, nappe, GRIS.blanc, 4);
  c.save(); c.clip(nappe); for (let xx = x - w - 30; xx < x + w + 30; xx += 28) { c.fillStyle = 'rgba(0,0,0,.14)'; c.fillRect(xx, y, 14, 130); } for (let yy = y; yy < y + 130; yy += 28) { c.fillStyle = 'rgba(0,0,0,.1)'; c.fillRect(x - w - 30, yy, 2 * w + 60, 14); } c.restore(); ink(c, 4); c.stroke(nappe);
  for (const dx of [-w + 20, w - 20]) { ink(c, 10, GRIS.noir); c.beginPath(); c.moveTo(x + dx, y + 120); c.lineTo(x + dx, y + 250); c.stroke(); }
}
// o.menu 'leger'|'copieux', o.annee, o.pere/o.mere : objets « figurant » (ou false), o.fumee
function cuisineNB(c, t, o = {}) {
  if (!_cuisNB) _cuisNB = fondCuisine(); c.drawImage(_cuisNB, 0, 0);
  calendrier(c, 960, 200, .9, o.annee || 1925);
  F(c, ell(450, 150, 40, 40), GRIS.blanc, 4); ink(c, 3); const a = t * .2; c.beginPath(); c.moveTo(450, 150); c.lineTo(450 + Math.sin(a) * 26, 150 - Math.cos(a) * 26); c.moveTo(450, 150); c.lineTo(462, 128); c.stroke();   // pendule
  if (o.poele) { F(c, ell(90, 396, 54, 12), GRIS.noir, 3); ink(c, 8, GRIS.noir); c.beginPath(); c.moveTo(140, 396); c.lineTo(220, 380); c.stroke(); if (o.menu === 'copieux') { trancheNB(c, 80, 388, .4); oeufNB(c, 104, 390, .4); } for (let k = 0; k < 3; k++) { const u = (t * .7 + k * .33) % 1; ink(c, 3, `rgba(255,255,255,${.6 * (1 - u)})`); c.beginPath(); c.moveTo(70 + k * 20, 380 - u * 90); c.quadraticCurveTo(56 + k * 20, 340 - u * 90, 70 + k * 20, 300 - u * 90); c.stroke(); } }
  chaise(c, 360, 760, -1); chaise(c, 820, 760, 1);
  if (o.pere) dessine(c, o.pere); if (o.mere) dessine(c, o.mere);
  tableNB(c, 590, 600, 230);
  const fm = o.fumee == null ? t : o.fumee;
  assietteNB(c, 470, 610, .7, o.menu, o.menu === 'copieux' ? fm : 0); assietteNB(c, 710, 610, .7, o.menu, o.menu === 'copieux' ? fm + .5 : 0);
  tasseNB(c, 560, 600, .7, fm); tasseNB(c, 630, 604, .7, fm + .3);
  if (o.menu !== 'copieux') { F(c, smooth([[540, 640], [550, 614], [640, 614], [650, 640]]), GRIS.clair, 3); }   // la corbeille de pain
  else { F(c, poly([[560, 640], [640, 640], [636, 600], [564, 600]]), GRIS.fonce, 2.5); for (let k = 0; k < 3; k++) oeufNB(c, 574 + k * 26, 600, .3); }
  if (o.journal) uneJournal(c, o.journal[0], o.journal[1], o.journal[2], { rot: o.journal[3] || 0, photo: true });
}
// ---------------------------------------------------------------- le bureau de la salaison
let _burNB = null;
function cochonNB(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); F(c, ell(0, 0, 80, 54), GRIS.blanc, 3); F(c, ell(70, -10, 32, 28), GRIS.blanc, 3); F(c, ell(96, -6, 12, 10), GRIS.clair, 2); for (const dy of [-10, -2]) F(c, ell(98, dy, 2.5, 3), GRIS.noir, 0); F(c, ell(70, -22, 4, 4), GRIS.noir, 0); F(c, poly([[56, -34], [68, -54], [76, -32]]), GRIS.clair, 2); for (const dx of [-50, -20, 20, 50]) F(c, poly([[dx - 8, 44], [dx + 8, 44], [dx + 8, 70], [dx - 8, 70]]), GRIS.blanc, 2); ink(c, 3); c.beginPath(); c.moveTo(-80, -6); c.bezierCurveTo(-100, -20, -110, 10, -94, 4); c.stroke(); c.restore(); }
function fondBureau() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.fillStyle = '#cfcac0'; c.fillRect(0, 0, W, 640); F(c, poly([[0, 440], [W, 440], [W, 640], [0, 640]]), GRIS.moyen, 0); for (let x = 0; x < W; x += 90) { const p = poly([[x + 8, 456], [x + 82, 456], [x + 82, 624], [x + 8, 624]]); F(c, p, '#9a968c', 2); }
  F(c, poly([[0, 432], [W, 432], [W, 446], [0, 446]]), GRIS.fonce, 2);
  c.fillStyle = '#6e6a62'; c.fillRect(0, 640, W, H - 640); for (let y = 650; y < H; y += 26) { ink(c, 1.4, 'rgba(0,0,0,.3)'); c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  // fenêtre : l'usine et ses cheminées
  F(c, poly([[60, 80], [330, 80], [330, 380], [60, 380]]), GRIS.fonce, 6); c.fillStyle = '#ecebe6'; c.fillRect(72, 92, 246, 276);
  F(c, poly([[80, 368], [310, 368], [310, 270], [250, 300], [250, 270], [190, 300], [190, 270], [130, 300], [130, 270], [80, 300]]), GRIS.moyen, 2);
  for (const x of [110, 260]) F(c, poly([[x, 300], [x + 22, 300], [x + 18, 160], [x + 4, 160]]), GRIS.fonce, 2);
  ink(c, 6, GRIS.fonce); c.beginPath(); c.moveTo(195, 90); c.lineTo(195, 370); c.moveTo(70, 230); c.lineTo(320, 230); c.stroke();
  // l'enseigne et l'affiche du cochon
  F(c, poly([[400, 60], [760, 60], [760, 130], [400, 130]]), GRIS.noir, 4); c.font = 'bold 34px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText('BACON SUPRÊME', 580, 108);
  F(c, poly([[430, 160], [600, 160], [600, 380], [430, 380]]), GRIS.blanc, 4); cochonNB(c, 505, 270, .7); c.font = 'bold 18px Georgia'; c.fillStyle = GRIS.noir; c.fillText('LE MEILLEUR', 515, 355);
  // la porte à droite
  F(c, poly([[880, 160], [1040, 160], [1040, 640], [880, 640]]), GRIS.fonce, 5); F(c, poly([[900, 190], [1020, 190], [1020, 330], [900, 330]]), GRIS.clair, 3); c.font = 'italic bold 16px Georgia'; c.fillStyle = GRIS.noir; c.fillText('DIRECTION', 960, 268); F(c, ell(1012, 420, 9, 9), GRIS.clair, 2);
  return cv;
}
function tableauVentes(c, x, y, s, u) {                        // le graphique des ventes : plat (u=0) → s'envole (u=1)
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const sd of [-1, 1]) { ink(c, 6, GRIS.noir); c.beginPath(); c.moveTo(sd * 80, 150); c.lineTo(sd * 60, -150); c.stroke(); }
  F(c, poly([[-120, -170], [120, -170], [120, 90], [-120, 90]]), GRIS.blanc, 4); c.font = 'bold 20px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('VENTES', 0, -140);
  ink(c, 3, GRIS.noir); c.beginPath(); c.moveTo(-96, -116); c.lineTo(-96, 60); c.lineTo(100, 60); c.stroke();
  const pts = []; for (let k = 0; k <= 8; k++) { const xx = -90 + k * 23, yy = 20 + Math.sin(k * 1.7) * 6 - (k > 4 ? (k - 4) * 34 * u : 0); pts.push([xx, yy]); }
  ink(c, 5, GRIS.noir); c.beginPath(); pts.forEach(([xx, yy], k) => k ? c.lineTo(xx, yy) : c.moveTo(xx, yy)); c.stroke();
  if (u > .9) F(c, poly([[pts[8][0] - 10, pts[8][1] + 4], [pts[8][0] + 14, pts[8][1] - 14], [pts[8][0] + 2, pts[8][1] + 16]]), GRIS.noir, 0);
  c.restore();
}
function bureauNB(c, t, o = {}) {
  if (!_burNB) _burNB = fondBureau(); c.drawImage(_burNB, 0, 0);
  tableauVentes(c, 740, 360, .9, o.ventes || 0);
  if (o.porte) { c.save(); F(c, poly([[880, 160], [880 + 160 * (1 - o.porte), 160 - 10 * o.porte], [880 + 160 * (1 - o.porte), 650 + 10 * o.porte], [880, 640]]), GRIS.noir, 3); c.restore(); }
  if (o.derriere) o.derriere(c);
  // le bureau
  F(c, poly([[200, 600], [640, 600], [660, 620], [180, 620]]), GRIS.fonce, 4); F(c, poly([[200, 620], [640, 620], [640, 760], [200, 760]]), '#4a4640', 4); for (const y of [650, 700]) { ink(c, 2, GRIS.moyen); c.strokeRect(220, y, 140, 40); F(c, ell(290, y + 20, 6, 4), GRIS.clair, 1); }
  telephone(c, 260, 600, .8); for (let k = 0; k < 4; k++) F(c, poly([[420 + k * 3, 600 - k * 6], [560 + k * 3, 600 - k * 6], [560 + k * 3, 594 - k * 6], [420 + k * 3, 594 - k * 6]]), GRIS.blanc, 1.5);
  F(c, poly([[580, 600], [620, 600], [620, 540], [580, 540]]), GRIS.clair, 2.5); trancheNB(c, 600, 530, .3, -.3);
  if (o.feuille) { c.save(); c.translate(o.feuille[0], o.feuille[1]); c.rotate(-.06); F(c, poly([[-90, -60], [90, -60], [90, 60], [-90, 60]]), GRIS.blanc, 3); c.font = 'bold 22px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('« Mangez du BACON »', 0, -6); if (o.rature) { ink(c, 7, GRIS.noir); const r = clamp(o.rature); c.beginPath(); c.moveTo(-84, -16); c.lineTo(-84 + 170 * r, 6); c.moveTo(-84, 8); c.lineTo(-84 + 170 * r, -20); c.stroke(); } c.font = 'italic 16px Georgia'; c.fillText(o.rature > .9 ? '→ parler de SANTÉ' : '', 0, 38); c.restore(); }
}
// ---------------------------------------------------------------- le cabinet du médecin
let _cabNB = null;
function fondCabinet() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.fillStyle = '#dcd8cf'; c.fillRect(0, 0, W, 640); briques(c, 0, 440, W, 640, '#bdb8ad');
  F(c, poly([[0, 432], [W, 432], [W, 446], [0, 446]]), GRIS.fonce, 2); c.fillStyle = '#76726a'; c.fillRect(0, 640, W, H - 640); for (let y = 650; y < H; y += 26) { ink(c, 1.4, 'rgba(0,0,0,.3)'); c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  // bibliothèque
  F(c, poly([[40, 90], [320, 90], [320, 640], [40, 640]]), GRIS.fonce, 5); for (let r = 0; r < 4; r++) { const y = 130 + r * 120; F(c, poly([[52, y + 90], [308, y + 90], [308, y + 100], [52, y + 100]]), GRIS.noir, 2); for (let k = 0; k < 11; k++) { const h = 60 + hash(r * 11 + k) * 26; F(c, poly([[58 + k * 22, y + 90], [76 + k * 22, y + 90], [76 + k * 22, y + 90 - h], [58 + k * 22, y + 90 - h]]), [GRIS.blanc, GRIS.clair, GRIS.moyen][(r + k) % 3], 1.5); } }
  // diplômes encadrés
  for (const [x, y] of [[470, 150], [640, 150]]) { F(c, poly([[x - 70, y - 50], [x + 70, y - 50], [x + 70, y + 50], [x - 70, y + 50]]), GRIS.fonce, 6); F(c, poly([[x - 58, y - 38], [x + 58, y - 38], [x + 58, y + 38], [x - 58, y + 38]]), GRIS.blanc, 1.5); c.font = 'italic bold 16px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('Doctorat', x, y - 6); ink(c, 1.2); c.beginPath(); c.moveTo(x - 40, y + 14); c.lineTo(x + 40, y + 14); c.stroke(); F(c, ell(x + 34, y + 26, 9, 9), GRIS.moyen, 1.5); }
  // planche d'anatomie et toise
  F(c, poly([[780, 80], [940, 80], [940, 380], [780, 380]]), GRIS.blanc, 4); F(c, ell(860, 130, 26, 30), GRIS.clair, 2.5); F(c, smooth([[820, 170], [900, 170], [910, 300], [810, 300]]), GRIS.clair, 2.5); ink(c, 2, GRIS.noir); for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(830, 190 + k * 24); c.quadraticCurveTo(860, 200 + k * 24, 890, 190 + k * 24); c.stroke(); }
  c.font = 'bold 14px Georgia'; c.fillStyle = GRIS.noir; c.fillText('ANATOMIE', 860, 360);
  return cv;
}
function cabinetNB(c, t, o = {}) {
  if (!_cabNB) _cabNB = fondCabinet(); c.drawImage(_cabNB, 0, 0);
  if (o.derriere) o.derriere(c);
  F(c, poly([[360, 600], [880, 600], [900, 620], [340, 620]]), GRIS.fonce, 4); F(c, poly([[360, 620], [880, 620], [880, 760], [360, 760]]), '#4a4640', 4);   // bureau
  ink(c, 5, GRIS.noir); c.beginPath(); c.moveTo(420, 598); c.bezierCurveTo(440, 560, 500, 560, 520, 596); c.stroke(); F(c, ell(522, 596, 12, 8), GRIS.moyen, 2);   // stéthoscope
  F(c, poly([[560, 600], [600, 600], [600, 560], [560, 560]]), GRIS.noir, 2); ink(c, 3, GRIS.noir); c.beginPath(); c.moveTo(590, 560); c.lineTo(620, 500); c.stroke();   // encrier + plume
  const n = Math.floor(o.lettres || 0); for (let k = 0; k < Math.min(n, 18); k++) enveloppe(c, 720 + (k % 2) * 6, 590 - k * 10, .9, (hash(k) - .5) * .1);
  const m = Math.floor(o.oui || 0); for (let k = 0; k < Math.min(m, 18); k++) enveloppe(c, 820 + (k % 2) * 6, 590 - k * 10, .9, (hash(k + 3) - .5) * .1, 1);
}
// ---------------------------------------------------------------- personnages
const CHARCUTIER = (t, x, o = {}) => figurant(t, x, 0, Object.assign({ s: .54, y: 780, tablier: 'taches', chapeau: (c, hy) => { F(c, ell(0, hy - 58, 60, 9), GRIS.blanc, 3); F(c, poly([[-40, hy - 60], [40, hy - 60], [36, hy - 92], [-36, hy - 92]]), GRIS.blanc, 3); } }, o));
const BERNAYS = (t, x, o = {}) => { const tq = step(t); return Object.assign({ x, y: 780, s: .48, t: tq, face: -1, look: [.6, 0], blink: (t % 3.3) < .1 ? 1 : 0, tilt: wob(tq, .4, .03), bob: bnc(tq, .4) * 2.5, chapeau: true }, o); };
const DOCTEUR = (t, x, o = {}) => figurant(t, x, 3, Object.assign({ s: .5, y: 780, face: -1, habit: habitBlouse, chapeau: LUNETTES(false) }, o));
const MERE = (t, x, o = {}) => figurant(t, x, 1, Object.assign({ s: .48, y: 790, tablier: 'blanc', chapeau: COIFFE.foulard }, o));
const PERE = (t, x, o = {}) => figurant(t, x, 2, Object.assign({ s: .5, y: 790, teteNue: true }, o));
// le fond « années folles » derrière le titre de l'époque
function plaqueEpoque(c, txt, a) { if (a <= 0) return; c.save(); c.globalAlpha = a; F(c, poly([[290, 690], [790, 690], [790, 770], [290, 770]]), GRIS.noir, 4); ink(c, 2, GRIS.blanc); c.strokeRect(300, 700, 480, 60); c.font = 'italic bold 34px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText(txt, 540, 742); c.restore(); }
function etiquette(c, x, y, txt, s = 1, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); F(c, poly([[-46, -20], [40, -20], [52, 0], [40, 20], [-46, 20]]), GRIS.blanc, 2.5); F(c, ell(-34, 0, 4, 4), GRIS.fonce, 1); c.font = 'bold 20px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText(txt, 4, 7); c.restore(); }
function projecteur2(c, x, a) { if (a <= 0) return; const g = c.createRadialGradient(x, 80, 10, x, 500, 300); g.addColorStop(0, `rgba(255,255,255,${.55 * a})`); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(x - 30, 60); c.lineTo(x + 30, 60); c.lineTo(x + 220, 560); c.lineTo(x - 220, 560); c.fill(); F(c, ell(x, 540, 200, 20), `rgba(255,255,255,${.3 * a})`, 0); }
// ================================================================ ÉPISODE HALEINE
function flaconNB(c, x, y, s) { }
// ---------------------------------------------------------------- les rasoirs (noir et blanc)
function rasoirNB(c, x, y, s, o = {}) { c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.scale(s, s); F(c, poly([[-7, 0], [7, 0], [8, -120], [-8, -120]]), o.dame ? GRIS.blanc : GRIS.moyen, 2.5); for (let k = 0; k < 7; k++) { ink(c, 1.4, 'rgba(0,0,0,.4)'); c.beginPath(); c.moveTo(-7, -16 - k * 13); c.lineTo(7, -22 - k * 13); c.stroke(); } F(c, poly([[-38, -120], [38, -120], [34, -140], [-34, -140]]), GRIS.clair, 3); F(c, poly([[-40, -140], [40, -140], [40, -147], [-40, -147]]), GRIS.blanc, 2); if (o.dame) for (let k = 0; k < 3; k++) F(c, ell(0, -30 - k * 30, 5, 5), GRIS.fonce, 1); c.restore(); }
function etuiNB(c, x, y, s, ouvert = 1) { c.save(); c.translate(x, y); c.scale(s, s); F(c, smooth([[-110, 0], [110, 0], [116, -60], [-116, -60]]), GRIS.fonce, 4); for (let k = -4; k <= 4; k++) F(c, ell(k * 24, -30, 4, 4), GRIS.clair, 0); if (ouvert) { F(c, poly([[-104, -60], [104, -60], [96, -60 - 150 * ouvert], [-96, -60 - 150 * ouvert]]), GRIS.blanc, 3); c.save(); c.globalAlpha = ouvert; c.font = 'italic bold 22px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('Pour Madame', 0, -60 - 110 * ouvert); c.restore(); rasoirNB(c, 0, -66, .6, { rot: Math.PI / 2, dame: 1 }); } c.restore(); }
// la vitrine du marchand de rasoirs : seulement pour messieurs
function fondVitrine() { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d'); c.fillStyle = '#cfcbc2'; c.fillRect(0, 0, W, H); briques(c, 0, 0, W, 640); c.fillStyle = '#6e6a62'; c.fillRect(0, 640, W, H - 640);
  F(c, poly([[90, 110], [990, 110], [990, 640], [90, 640]]), '#3a3a38', 8); F(c, poly([[120, 140], [960, 140], [960, 610], [120, 610]]), '#e6e4de', 4);
  F(c, poly([[200, 40], [880, 40], [880, 104], [200, 104]]), GRIS.noir, 4); c.font = 'bold 34px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText('RASOIRS — COUTELLERIE', 540, 85);
  // affiche du barbier : un monsieur moustachu
  F(c, poly([[150, 170], [400, 170], [400, 520], [150, 520]]), GRIS.blanc, 4); c.fillStyle = GRIS.noir; c.font = 'bold 22px Georgia'; c.fillText('POUR MESSIEURS', 275, 210); F(c, ell(275, 330, 70, 86), GRIS.clair, 4); F(c, smooth([[215, 300], [275, 236], [335, 300], [330, 270], [220, 270]]), GRIS.noir, 2); F(c, smooth([[225, 365], [275, 350], [325, 365], [300, 378], [275, 368], [250, 378]]), GRIS.noir, 2); F(c, ell(250, 320, 7, 7), GRIS.noir, 0); F(c, ell(300, 320, 7, 7), GRIS.noir, 0); c.fillStyle = GRIS.noir; c.font = 'italic 18px Georgia'; c.fillText('Une barbe nette,', 275, 460); c.fillText('un homme net.', 275, 486);
  // étagères de rasoirs
  for (let r = 0; r < 3; r++) { F(c, poly([[440, 260 + r * 120], [930, 260 + r * 120], [930, 270 + r * 120], [440, 270 + r * 120]]), GRIS.fonce, 2); for (let k = 0; k < 8; k++) rasoirNB(c, 470 + k * 62, 258 + r * 120, .55); }
  c.fillStyle = GRIS.noir; c.font = 'bold 18px Georgia'; c.fillText('LAMES · BLAIREAUX · CUIRS', 690, 200);
  F(c, poly([[60, 640], [1020, 640], [1020, 660], [60, 660]]), GRIS.fonce, 3); return cv; }
let _vit = null;
function vitrineNB(c, t, o = {}) { if (!_vit) _vit = fondVitrine(); c.drawImage(_vit, 0, 0); if (o.derriere) o.derriere(c); if (o.marche) { const u = ease(clamp(o.marche)); c.save(); c.translate(820, 520); F(c, poly([[-150, -120], [150, -120], [150, 230], [-150, 230]]), GRIS.blanc, 4); c.font = 'bold 22px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('LE MARCHÉ', 0, -84); F(c, ell(0, 50, 100, 100), GRIS.clair, 4); c.beginPath(); c.moveTo(0, 50); c.arc(0, 50, 100, -Math.PI / 2, -Math.PI / 2 + Math.PI * u); c.closePath(); c.fillStyle = GRIS.fonce; c.fill(); ink(c, 4); c.stroke(); c.fillStyle = GRIS.blanc; c.font = 'bold 18px Georgia'; if (u > .5) c.fillText('HOMMES', 46, 56); c.fillStyle = GRIS.noir; if (u > .9) { c.fillText('FEMMES', -46, 56); c.font = 'bold 40px Georgia'; c.fillText('?', -46, 100); } c.restore(); } }
// croquis de mode : la robe découvre les bras, puis les jambes
function silhouetteMode(c, x, y, s, manche, ourlet, o = {}) { c.save(); c.translate(x, y); c.scale(s, s); const bas = lerp(-30, -250, ourlet), col = o.col || GRIS.clair, PEAU = '#f2f0ea';
  for (const d of [-1, 1]) { ink(c, 15, GRIS.noir); c.beginPath(); c.moveTo(d * 16, bas + 10); c.lineTo(d * 20, -14); c.stroke(); ink(c, 10, PEAU); c.stroke(); F(c, smooth([[d * 8, -18], [d * 34, -18], [d * 38, 0], [d * 6, 0]]), GRIS.noir, 0); }
  const robe = smooth([[-36, -500], [36, -500], [28, -400], [84, bas], [-84, bas], [-28, -400]]); F(c, robe, col, 4); c.save(); c.clip(robe); for (let k = -5; k <= 5; k++) { ink(c, 1.4, 'rgba(0,0,0,.25)'); c.beginPath(); c.moveTo(k * 5, -400); c.lineTo(k * 17, bas); c.stroke(); } c.fillStyle = GRIS.noir; c.fillRect(-40, -410, 80, 14); c.restore(); ink(c, 4); c.stroke(robe);
  for (const d of (o.bras ? [-1] : [-1, 1])) { const b = [[d * 36, -490], [d * 72, -390], [d * 62, -290]]; ink(c, 17, GRIS.noir); c.beginPath(); c.moveTo(...b[0]); c.quadraticCurveTo(...b[1], ...b[2]); c.stroke(); ink(c, 11, PEAU); c.stroke(); F(c, ell(b[2][0], b[2][1] + 6, 9, 11), PEAU, 3);
    if (manche > 0) { ink(c, 22, GRIS.noir); c.beginPath(); c.moveTo(...b[0]); const e = [b[0][0] + (b[2][0] - b[0][0]) * manche * .95, b[0][1] + (b[2][1] - b[0][1]) * manche * .95]; c.quadraticCurveTo(b[1][0], lerp(b[0][1], b[1][1], manche), ...e); c.stroke(); ink(c, 16, col); c.stroke(); } else { F(c, smooth([[d * 36, -500], [d * 46, -498], [d * 42, -478], [d * 32, -480]]), col, 2); } }
  ink(c, 12, GRIS.noir); c.beginPath(); c.moveTo(0, -500); c.lineTo(0, -520); c.stroke(); ink(c, 8, PEAU); c.stroke();
  F(c, ell(0, -552, 30, 36), PEAU, 4); F(c, smooth([[-32, -556], [-30, -592], [30, -592], [32, -556], [20, -578], [-20, -578]]), GRIS.noir, 2); F(c, ell(-11, -550, 3.5, 4.5), GRIS.noir, 0); F(c, ell(11, -550, 3.5, 4.5), GRIS.noir, 0); ink(c, 2.5); c.beginPath(); c.arc(0, -534, 9, .3, 2.8); c.stroke(); F(c, ell(-18, -538, 6, 3), 'rgba(0,0,0,.12)', 0); F(c, ell(18, -538, 6, 3), 'rgba(0,0,0,.12)', 0);
  F(c, ell(0, -590, 46, 8), GRIS.fonce, 2); F(c, smooth([[-28, -592], [-22, -620], [22, -620], [28, -592]]), GRIS.fonce, 2); F(c, smooth([[18, -612], [44, -648], [30, -606]]), GRIS.blanc, 1.5);
  if (o.bras) { ink(c, 17, GRIS.noir); c.beginPath(); c.moveTo(36, -490); c.quadraticCurveTo(100, -560, 80, -650); c.stroke(); ink(c, 11, PEAU); c.stroke(); }
  if (o.annee) { c.font = 'bold 34px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText(o.annee, 0, 60); } c.restore(); }
function modeRobes(c, t, u, o = {}) { c.fillStyle = '#ece8de'; c.fillRect(0, 0, W, H); F(c, poly([[60, 30], [1020, 30], [1020, 790], [60, 790]]), '#f7f4ec', 4); c.font = 'italic bold 36px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText(o.titre || 'LA MODE DE PARIS', 540, 90); for (let x = 90; x < 1000; x += 30) { ink(c, 1, 'rgba(0,0,0,.1)'); c.beginPath(); c.moveTo(x, 110); c.lineTo(x, 760); c.stroke(); }
  const L = o.robes || [[1, 0, '1905'], [0, 0, '1915'], [0, .55, '1925']];
  L.forEach(([m, h, a], k) => { const v = ease(clamp(u * L.length - k + .3)); if (v <= 0) return; c.save(); c.globalAlpha = v; silhouetteMode(c, 250 + k * 290, 725, .8, m, h, { annee: a, col: [GRIS.clair, '#c8c4bc', '#b0aca4'][k] }); c.restore(); if (k && v >= 1) { ink(c, 4, GRIS.fonce); c.beginPath(); c.moveTo(250 + k * 290 - 190, 400); c.lineTo(250 + k * 290 - 110, 400); c.lineTo(250 + k * 290 - 128, 386); c.moveTo(250 + k * 290 - 110, 400); c.lineTo(250 + k * 290 - 128, 414); c.stroke(); } }); }
// la vitrine du rasoir pour dames, étui élégant
function vitrineDame(c, t, u) { c.fillStyle = '#d4d0c6'; c.fillRect(0, 0, W, H); for (let x = 0; x < W; x += 60) { c.fillStyle = 'rgba(0,0,0,.04)'; c.fillRect(x, 0, 30, H); } F(c, smooth([[160, 640], [920, 640], [960, 760], [120, 760]]), GRIS.fonce, 5); F(c, poly([[200, 140], [880, 140], [880, 220], [200, 220]]), GRIS.blanc, 4); c.font = 'italic bold 40px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('NOUVEAU ! Pour Madame', 540, 196);
  for (let k = 0; k < 2; k++) { ink(c, 2.5, GRIS.fonce); c.beginPath(); c.moveTo(240 + k * 600, 250); for (let j = 0; j < 10; j++) c.quadraticCurveTo(250 + k * 600 + (j % 2 ? 30 : -30), 270 + j * 34, 240 + k * 600, 284 + j * 34); c.stroke(); }
  F(c, poly([[360, 560], [720, 560], [700, 640], [380, 640]]), GRIS.clair, 4); etuiNB(c, 540, 580, 1.1, ease(clamp(u))); for (let k = 0; k < 6; k++) { const a = t * 2 + k; F(c, ell(540 + Math.cos(a) * 240, 420 + Math.sin(a * 1.3) * 120, 4, 4), GRIS.blanc, 0); } }
// la réclame du magazine : aisselles parfaitement lisses
function reclameAisselles(c, t, u) { c.fillStyle = GRIS.fonce; c.fillRect(0, 0, W, H); F(c, poly([[230, 40], [850, 40], [850, 770], [230, 770]]), GRIS.blanc, 5); c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.font = 'italic bold 32px Georgia'; c.fillText('La robe sans manches', 540, 110); c.font = 'italic bold 32px Georgia'; c.fillText('exige des aisselles lisses.', 540, 152);
  silhouetteMode(c, 540, 700, .85, 0, .3, { col: GRIS.clair, bras: 1 });
  const v = clamp(u); for (let k = 0; k < 4; k++) { const a = t * 3 + k * 1.6, r = 10 + 6 * Math.sin(a); if (v > .3) { ink(c, 3, GRIS.noir); const x = 596 + k * 16, y = 252 + k * 14; c.beginPath(); c.moveTo(x - r, y); c.lineTo(x + r, y); c.moveTo(x, y - r); c.lineTo(x, y + r); c.stroke(); } }
  c.font = 'italic 20px Georgia'; c.fillStyle = GRIS.noir; ['Ce que les autres remarquent…', 'et ne vous diront jamais.'].forEach((l, k) => { if (v * 2 > k) c.fillText(l, 540, 726 + k * 28); }); if (v > .6) etuiNB(c, 760, 600, .5, 1); }
// l'escalier des mots : disgracieux → gênants → honteux
function escalierMots(c, t, u) { c.fillStyle = GRIS.clair; c.fillRect(0, 0, W, H); const L = ['disgracieux', 'gênants', 'HONTEUX']; L.forEach((m, k) => { const v = ease(clamp(u * 3 - k)); if (v <= 0) return; const x = 130 + k * 280, y = 200 + k * 180; F(c, poly([[x, y + 70], [x + 300, y + 70], [x + 300, 800], [x, 800]]), [GRIS.blanc, '#bdb9b0', '#7e7a72'][k], 4); c.save(); c.globalAlpha = v; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.font = `${k == 2 ? 'bold ' : 'italic '}${44 + k * 8}px Georgia`; c.fillText(m, x + 150, y + 40); c.restore(); });
  c.font = 'bold 26px Georgia'; c.textAlign = 'left'; c.fillStyle = GRIS.noir; c.fillText('LES POILS…', 60, 90); }
// le bal : lustre, parquet en damier, couples qui dansent
function fondBal() { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d'); c.fillStyle = '#d6d2c8'; c.fillRect(0, 0, W, 600); for (let x = 40; x < W; x += 200) { F(c, poly([[x, 120], [x + 120, 120], [x + 120, 560], [x, 560]]), '#c2beb4', 3); F(c, smooth([[x, 160], [x + 60, 110], [x + 120, 160]]), '#c2beb4', 3); ink(c, 2, GRIS.fonce); c.beginPath(); c.moveTo(x + 60, 120); c.lineTo(x + 60, 560); c.moveTo(x, 340); c.lineTo(x + 120, 340); c.stroke(); } c.fillStyle = '#e6e2da'; c.fillRect(0, 560, W, 40);
  for (let y = 600; y < H; y += 50) for (let x = ((y - 600) / 50 % 2) * 60; x < W; x += 120) { c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(x, y, 60, 50); }
  ink(c, 3, GRIS.fonce); c.beginPath(); c.moveTo(540, 0); c.lineTo(540, 60); c.stroke(); F(c, smooth([[440, 60], [640, 60], [600, 130], [480, 130]]), GRIS.clair, 3); for (let k = 0; k < 9; k++) { F(c, smooth([[452 + k * 22, 130], [458 + k * 22, 130], [455 + k * 22, 170]]), GRIS.blanc, 1.5); } for (let k = 0; k < 5; k++) F(c, ell(470 + k * 35, 52, 6, 12), GRIS.blanc, 2);
  c.font = 'bold 22px Georgia'; c.textAlign = 'center'; F(c, poly([[60, 30], [300, 30], [300, 90], [60, 90]]), GRIS.noir, 3); c.fillStyle = GRIS.blanc; c.fillText('GRAND BAL', 180, 68); return cv; }
let _bal = null;
function balNB(c, t, o = {}) { if (!_bal) _bal = fondBal(); c.drawImage(_bal, 0, 0); if (o.couples !== 0) for (let k = 0; k < 2; k++) { const a = t * 1.2 + k * 3, x = 300 + k * 480 + Math.sin(a) * 40; const H1 = figurant(t, x - 34, 0, { s: .36, y: 700, face: 1, look: [.6, 0], handR: [60, -560], handL: [-60, -440] }), F1 = figurant(t, x + 34, 1, { s: .34, y: 700, face: -1, look: [-.6, 0], handR: [60, -560] }); dessine(c, H1); dessine(c, F1); } if (o.derriere) o.derriere(c); }
const CLIENTE = (t, x, o = {}) => figurant(t, x, 1, Object.assign({ s: .5, y: 790, chapeau: (c, hy) => { F(c, ell(0, hy - 60, 64, 10), GRIS.fonce, 2); F(c, smooth([[-34, hy - 62], [-28, hy - 92], [28, hy - 92], [34, hy - 62]]), GRIS.fonce, 2); F(c, smooth([[20, hy - 90], [60, hy - 130], [40, hy - 84]]), GRIS.blanc, 1.5); } }, o));
// les jupes raccourcissent, les jambes suivent le même chemin
function jupesNB(c, t, u) { modeRobes(c, t, 1, { titre: 'LA MODE DES ANNÉES FOLLES', robes: [[0, .1, '1920'], [0, .45, '1926'], [0, .7, '1930']] }); const v = clamp(u); if (v > .5) { c.save(); c.globalAlpha = ease(seg(v, .5, .8)); F(c, poly([[700, 120], [1000, 120], [1000, 200], [700, 200]]), GRIS.blanc, 3); c.font = 'italic bold 22px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('…et les jambes', 850, 156); c.fillText('aussi lisses ?', 850, 184); c.restore(); rasoirNB(c, 960, 640, .6, { rot: -.6, dame: 1 }); } }
// le même mot, répété partout
function motRepete(c, t, u) { c.fillStyle = GRIS.fonce; c.fillRect(0, 0, W, H); const P = [[200, 180, -.1], [540, 140, .06], [880, 200, .12], [320, 450, .08], [760, 470, -.08], [540, 680, .02], [140, 650, -.14], [940, 660, .1]]; P.forEach(([x, y, r], k) => { if (clamp(u) * P.length < k) return; c.save(); c.translate(x, y); c.rotate(r); F(c, poly([[-150, -80], [150, -80], [150, 80], [-150, 80]]), k % 2 ? GRIS.blanc : '#e4e0d6', 3); for (let j = 0; j < 4; j++) { ink(c, 2, 'rgba(0,0,0,.25)'); c.beginPath(); c.moveTo(-120, 30 + j * 12); c.lineTo(120, 30 + j * 12); c.stroke(); } c.font = `italic bold ${30 + (k % 3) * 4}px Georgia`; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('disgracieux', 0, -6); c.restore(); }); }
// en une génération : habitude → norme → obligation
function generation(c, t, u) { c.fillStyle = GRIS.clair; c.fillRect(0, 0, W, H); c.font = 'bold 30px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('EN UNE GÉNÉRATION', 540, 80); const L = [['GRAND-MÈRE', 'rien', 1, 0], ['MÈRE', 'habitude', 0, .2], ['FILLE', 'NORME', 0, .5]]; L.forEach(([n, m, manche, h], k) => { const v = ease(clamp(u * 3 - k + .2)); if (v <= 0) return; c.save(); c.globalAlpha = v; silhouetteMode(c, 220 + k * 320, 700, .78 - k * .04, manche, h); c.font = 'bold 24px Georgia'; c.fillStyle = GRIS.noir; c.fillText(n, 220 + k * 320, 760); c.font = 'italic bold 30px Georgia'; c.fillText(m, 220 + k * 320, 150); c.restore(); }); }
// l'obligation que personne n'a votée : l'urne est vide
function urneVide(c, t, u) { c.fillStyle = '#d4d0c6'; c.fillRect(0, 0, W, 640); c.fillStyle = '#7a766e'; c.fillRect(0, 640, W, H - 640); F(c, poly([[300, 60], [780, 60], [780, 140], [300, 140]]), GRIS.noir, 4); c.font = 'bold 30px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText('VOTE : SE RASER ?', 540, 112);
  F(c, poly([[380, 360], [700, 360], [700, 680], [380, 680]]), 'rgba(240,240,236,.6)', 5); F(c, poly([[480, 352], [600, 352], [600, 366], [480, 366]]), GRIS.noir, 2); c.font = 'bold 26px Georgia'; c.fillStyle = GRIS.noir; c.fillText('URNE', 540, 430); c.font = 'bold 60px Georgia'; c.fillText('0', 540, 560); c.font = 'italic 22px Georgia'; c.fillText('bulletin', 540, 600);
  const v = ease(clamp(u)); if (v > 0) { c.save(); c.translate(540, 260); c.rotate(-.08); c.globalAlpha = v; F(c, poly([[-260, -50], [260, -50], [260, 50], [-260, 50]]), GRIS.blanc, 5); c.font = 'bold 44px Georgia'; c.fillStyle = GRIS.noir; c.fillText('OBLIGATOIRE', 0, 16); c.restore(); } }
// chaque matin, le besoin revient
function matinRasoir(c, t, u) { c.fillStyle = '#d8d4cc'; c.fillRect(0, 0, W, H); for (let y = 0; y < 640; y += 50) for (let x = (y / 50 % 2) * 25; x < W; x += 50) F(c, poly([[x, y], [x + 48, y], [x + 48, y + 48], [x, y + 48]]), '#e2ded6', 0); c.fillStyle = '#86827a'; c.fillRect(0, 640, W, H - 640);
  F(c, ell(540, 280, 170, 200), GRIS.blanc, 6); F(c, ell(540, 280, 150, 180), '#c8ccce', 3); F(c, smooth([[320, 560], [760, 560], [720, 640], [360, 640]]), GRIS.blanc, 5); rasoirNB(c, 460, 556, .6, { rot: Math.PI / 2 - .1, dame: 1 }); F(c, smooth([[600, 556], [640, 556], [636, 500], [604, 500]]), GRIS.clair, 3);
  const n = 1 + Math.floor(clamp(u) * 29.99); c.save(); c.translate(880, 260); F(c, poly([[-80, -100], [80, -100], [80, 100], [-80, 100]]), GRIS.blanc, 4); F(c, poly([[-80, -100], [80, -100], [80, -60], [-80, -60]]), GRIS.noir, 2); c.font = 'bold 20px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText('MATIN', 0, -72); c.fillStyle = GRIS.noir; c.font = 'bold 70px Georgia'; c.fillText(String(n), 0, 40); c.restore(); c.font = 'italic bold 30px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('…et ça recommence.', 540, 720); }
// libre : l'une se rase, l'autre non — chacune son choix
function libres(c, t, u) { c.fillStyle = GRIS.clair; c.fillRect(0, 0, W, H); c.fillStyle = '#9a968e'; c.fillRect(0, 640, W, H - 640); dessine(c, figurant(t, 330, 1, { s: .5, y: 780, face: 1, look: [.6, 0], sourire: 1, handR: [80, -560], poseR: 'poing' })); dessine(c, figurant(t, 750, 4, { s: .5, y: 780, face: -1, look: [-.6, 0], sourire: 1 })); rasoirNB(c, 380, 520, .45, { dame: 1 }); const v = ease(clamp(u)); c.save(); c.globalAlpha = v; c.font = 'bold 50px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('LIBRE', 330, 140); c.fillText('LIBRE', 750, 140); c.restore(); }
const PUBLICITAIRE = (t, x, o = {}) => { const tq = step(t); return Object.assign({ x, y: 780, s: .48, t: tq, face: 1, look: [.6, 0], blink: (t % 3.3) < .1 ? 1 : 0, tilt: wob(tq, .4, .03), bob: bnc(tq, .4) * 2.5, handL: [-96, -400], handR: [96, -400] }, o); };
let _agNB = null;
function fondAgence() { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d'); c.fillStyle = '#d8d4ca'; c.fillRect(0, 0, W, 640); for (let x = 0; x < W; x += 54) { c.fillStyle = 'rgba(0,0,0,.05)'; c.fillRect(x, 0, 27, 640); } c.fillStyle = '#76726a'; c.fillRect(0, 640, W, H - 640);
  F(c, poly([[30, 60], [250, 60], [250, 140], [30, 140]]), GRIS.noir, 4); c.font = 'bold 22px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText('AGENCE DE', 140, 94); c.fillText('RÉCLAME', 140, 124);
  F(c, poly([[640, 120], [1000, 120], [1000, 400], [640, 400]]), '#2e2e2c', 7); return cv; }
function agenceNB(c, t, o = {}) { if (!_agNB) _agNB = fondAgence(); c.drawImage(_agNB, 0, 0); c.font = 'bold 24px Georgia'; c.textAlign = 'center'; c.fillStyle = 'rgba(240,240,230,.92)'; const L2 = o.tableau || ['NOUVEAU MARCHÉ ?', '— les messieurs : déjà', '— les dames : rien…', '— à convaincre !']; L2.forEach((l, k) => { if (k < (o.lignes == null ? L2.length : o.lignes)) c.fillText(l, 820, 170 + k * 52); });
  tableauVentes(c, 400, 360, .7, o.ventes || 0); if (o.derriere) o.derriere(c); F(c, poly([[160, 600], [620, 600], [640, 620], [140, 620]]), GRIS.fonce, 4); F(c, poly([[160, 620], [620, 620], [620, 770], [160, 770]]), '#4a4640', 4); rasoirNB(c, 540, 598, .45, { rot: Math.PI / 2 - .2 }); telephone(c, 220, 600, .7); }
// le vieux dictionnaire ouvert : « HALITOSE (n. f.) : mauvaise haleine »
