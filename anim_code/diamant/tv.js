// Monde du téléviseur, épisode « Le diamant éternel » : New York, 1938-1950 — bijouterie, bureau du diamantaire, cinéma, lycée, agence de réclame.
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
  if (o.dessus) o.dessus(c);
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
// ================================================================ ÉPISODE JUS D'ORANGE
function orangeNB(c, x, y, r) { F(c, ell(x, y, r, r * .96), GRIS.moyen, 2); c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.ellipse(x - r * .35, y - r * .35, r * .3, r * .18, -.6, 0, 7); c.fill(); F(c, ell(x, y - r * .9, 2.5, 2), GRIS.noir, 0); }
function verreNB(c, x, y, s, niv = 1) { c.save(); c.translate(x, y); c.scale(s, s); const v = smooth([[-30, -110], [30, -110], [22, 0], [-22, 0]]); c.save(); c.clip(v); c.fillStyle = GRIS.moyen; c.fillRect(-40, -104 * niv, 80, 104 * niv); c.restore(); c.fillStyle = 'rgba(255,255,255,.2)'; c.fill(v); ink(c, 3, GRIS.noir); c.stroke(v); c.fillStyle = 'rgba(255,255,255,.6)'; c.fillRect(-20, -100, 6, 86); c.restore(); }
function arbreOranger(c, x, y, s, t, k = 0, coupe = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (coupe >= 1) { F(c, poly([[-22, 0], [22, 0], [20, -40], [-20, -40]]), GRIS.fonce, 3); F(c, ell(0, -40, 20, 6), GRIS.clair, 2); ink(c, 1, GRIS.fonce); for (const r of [6, 12, 17]) { c.beginPath(); c.ellipse(0, -40, r, r * .3, 0, 0, 7); c.stroke(); } c.restore(); return; }
  c.rotate(coupe * 1.4);
  F(c, smooth([[-16, 0], [16, 0], [12, -120], [-12, -120]]), GRIS.fonce, 3);
  const f = smooth([[-120, -150], [-100, -250], [-30, -300], [50, -296], [120, -240], [126, -160], [70, -110], [-60, -112]]); F(c, f, '#7e7a70', 4); ombre(c, f, -120, -300, 126, -110, .3);
  for (let q = 0; q < 14; q++) orangeNB(c, -96 + hash(q + k * 13) * 196, -270 + hash(q + 5 + k * 7) * 150, 13);
  c.restore();
}
function cagette(c, x, y, s, plein = 1) { c.save(); c.translate(x, y); c.scale(s, s); if (plein) for (let q = 0; q < 7; q++) orangeNB(c, -60 + q * 20, -56 - (q % 2) * 6, 14); F(c, poly([[-80, -56], [80, -56], [80, 0], [-80, 0]]), GRIS.clair, 3); ink(c, 2, GRIS.fonce); for (const yy of [-38, -18]) { c.beginPath(); c.moveTo(-80, yy); c.lineTo(80, yy); c.stroke(); } F(c, poly([[-40, -46], [40, -46], [40, -26], [-40, -26]]), GRIS.blanc, 1.5); c.font = 'bold 12px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('CALIFORNIA', 0, -32); c.restore(); }
let _vergerNB = null;
function fondVerger() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  const ciel = c.createLinearGradient(0, 0, 0, 420); ciel.addColorStop(0, '#e8e6e0'); ciel.addColorStop(1, '#f8f6f0'); c.fillStyle = ciel; c.fillRect(0, 0, W, H);
  F(c, ell(860, 120, 60, 60), GRIS.blanc, 0); for (let k = 0; k < 12; k++) { ink(c, 3, 'rgba(255,255,255,.6)'); const a = k * .52; c.beginPath(); c.moveTo(860 + Math.cos(a) * 76, 120 + Math.sin(a) * 76); c.lineTo(860 + Math.cos(a) * 100, 120 + Math.sin(a) * 100); c.stroke(); }   // soleil de Californie
  F(c, smooth([[0, 420], [180, 330], [380, 380], [600, 310], [820, 370], [1080, 320], [1080, 440], [0, 440]]), GRIS.clair, 2);   // collines
  c.fillStyle = '#b8b4aa'; c.fillRect(0, 440, W, H - 440); for (let r = 0; r < 6; r++) { ink(c, 2, 'rgba(0,0,0,.15)'); c.beginPath(); c.moveTo(0, 470 + r * 60); c.lineTo(W, 450 + r * 64); c.stroke(); }
  for (let k = 0; k < 7; k++) arbreOranger(c, 40 + k * 170, 450, .45, 0, k + 20);    // rangée lointaine
  return cv;
}
// o.coupe : 0..1 l'arbre du premier plan est arraché ; o.cagettes : nombre de cagettes empilées ; o.prix : panneau
function vergerNB(c, t, o = {}) {
  if (!_vergerNB) _vergerNB = fondVerger(); c.drawImage(_vergerNB, 0, 0);
  arbreOranger(c, 200, 740, 1, t, 1); arbreOranger(c, 880, 740, 1.05, t, 2, o.coupe || 0);
  if (o.derriere) o.derriere(c);
  const n = o.cagettes == null ? 9 : o.cagettes; for (let k = 0; k < n; k++) cagette(c, 400 + (k % 3) * 150 + (Math.floor(k / 3) % 2) * 40, 780 - Math.floor(k / 3) * 56, 1);
  for (let k = 0; k < 10; k++) orangeNB(c, 330 + hash(k + 40) * 400, 790 + hash(k + 9) * 10, 13);   // oranges tombées
  if (o.prix != null) { c.save(); c.translate(600, 200); F(c, poly([[-170, -60], [170, -60], [170, 60], [-170, 60]]), GRIS.blanc, 4); c.font = 'bold 26px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('PRIX DE L’ORANGE', 0, -20); const p = Math.round(lerp(10, 1, clamp(o.prix))); c.font = 'bold 48px Georgia'; c.fillText(p + (p > 1 ? ' cents' : ' cent'), 0, 40); if (o.prix > 0) { ink(c, 6, GRIS.noir); c.beginPath(); c.moveTo(130, -30); c.lineTo(150, 30); c.stroke(); F(c, poly([[140, 40], [162, 22], [138, 18]]), GRIS.noir, 0); } c.restore(); }
}
const PRODUCTEUR = (t, x, o = {}) => figurant(t, x, 2, Object.assign({ s: .52, y: 790, chapeau: (c, hy) => { F(c, ell(0, hy - 56, 84, 13), GRIS.clair, 3); F(c, smooth([[-44, hy - 58], [-38, hy - 100], [38, hy - 100], [44, hy - 58]]), GRIS.clair, 3); F(c, poly([[-44, hy - 72], [44, hy - 72], [44, hy - 62], [-44, hy - 62]]), GRIS.noir, 1.5); }, habit: (c, shY) => { for (const sd of [-1, 1]) { ink(c, 12, GRIS.noir); c.beginPath(); c.moveTo(sd * 40, shY - 4); c.lineTo(sd * 34, -404); c.stroke(); } } }, o));
const PUBLICITAIRE = (t, x, o = {}) => { const tq = step(t); return Object.assign({ x, y: 780, s: .48, t: tq, face: -1, look: [.6, 0], blink: (t % 3.3) < .1 ? 1 : 0, tilt: wob(tq, .4, .03), bob: bnc(tq, .4) * 2.5 }, o); };
// ---------------------------------------------------------------- la salle de réunion des producteurs
let _reuNB = null;
function fondReunion() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.fillStyle = '#d4d0c6'; c.fillRect(0, 0, W, 640); for (let x = 0; x < W; x += 120) { F(c, poly([[x + 10, 450], [x + 110, 450], [x + 110, 630], [x + 10, 630]]), '#a8a49a', 2); }
  F(c, poly([[0, 440], [W, 440], [W, 452], [0, 452]]), GRIS.fonce, 2); c.fillStyle = '#6e6a62'; c.fillRect(0, 640, W, H - 640);
  F(c, poly([[300, 60], [780, 60], [780, 130], [300, 130]]), GRIS.noir, 4); c.font = 'bold 28px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText('UNION DES PRODUCTEURS', 540, 106);
  F(c, poly([[60, 160], [260, 160], [260, 400], [60, 400]]), GRIS.blanc, 4); arbreOranger(c, 160, 390, .62, 0, 5); c.font = 'italic bold 16px Georgia'; c.fillStyle = GRIS.noir; c.fillText('Californie', 160, 388);
  F(c, poly([[820, 160], [1020, 160], [1020, 400], [820, 400]]), GRIS.fonce, 5); F(c, poly([[834, 174], [1006, 174], [1006, 386], [834, 386]]), '#ecebe6', 2); ink(c, 5, GRIS.fonce); c.beginPath(); c.moveTo(920, 174); c.lineTo(920, 386); c.moveTo(834, 280); c.lineTo(1006, 280); c.stroke();
  return cv;
}
function reunionNB(c, t, o = {}) {
  if (!_reuNB) _reuNB = fondReunion(); c.drawImage(_reuNB, 0, 0);
  if (o.derriere) o.derriere(c);
  F(c, poly([[140, 610], [940, 610], [980, 650], [100, 650]]), GRIS.fonce, 4); F(c, poly([[120, 650], [960, 650], [960, 670], [120, 670]]), GRIS.noir, 3); for (const x of [150, 930]) F(c, poly([[x - 8, 670], [x + 8, 670], [x + 8, 790], [x - 8, 790]]), GRIS.noir, 2);
  for (let k = 0; k < 3; k++) cagette(c, 380 + k * 160, 610, .7);
}
// ---------------------------------------------------------------- l'agence de réclame
let _ageNB = null;
function fondAgence() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.fillStyle = '#dcd8ce'; c.fillRect(0, 0, W, 640); for (let x = 0; x < W; x += 54) { c.fillStyle = 'rgba(0,0,0,.05)'; c.fillRect(x, 0, 27, 640); }
  c.fillStyle = '#76726a'; c.fillRect(0, 640, W, H - 640); for (let y = 650; y < H; y += 26) { ink(c, 1.4, 'rgba(0,0,0,.3)'); c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  F(c, poly([[30, 60], [250, 60], [250, 140], [30, 140]]), GRIS.noir, 4); c.font = 'bold 22px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText('AGENCE DE', 140, 94); c.fillText('RÉCLAME', 140, 124);
  for (const [x, y, r] of [[90, 260, -.06], [200, 300, .05]]) { c.save(); c.translate(x, y); c.rotate(r); F(c, poly([[-50, -70], [50, -70], [50, 70], [-50, 70]]), GRIS.blanc, 3); F(c, ell(0, -10, 26, 30), GRIS.clair, 2); ink(c, 1.2, 'rgba(0,0,0,.35)'); for (let q = 0; q < 3; q++) { c.beginPath(); c.moveTo(-36, 34 + q * 10); c.lineTo(36, 34 + q * 10); c.stroke(); } c.restore(); }   // anciennes affiches
  return cv;
}
// o.affiche : 0..1 la grande affiche « BUVEZ UNE ORANGE ! » se déroule ; o.chevalet : dessin du verre
function afficheBuvez(c, x, y, s, u = 1, couleur = false) {
  if (u <= 0) return; c.save(); c.translate(x, y); c.scale(s, s); const h = 420 * ease(clamp(u));
  c.save(); c.beginPath(); c.rect(-160, -210, 320, h); c.clip();
  F(c, poly([[-150, -200], [150, -200], [150, 200], [-150, 200]]), couleur ? '#fbf1d8' : GRIS.blanc, 5);
  c.textAlign = 'center'; c.fillStyle = couleur ? '#d8581a' : GRIS.noir; c.font = 'bold 46px Georgia'; c.fillText('BUVEZ', 0, -136); c.font = 'bold 34px Georgia'; c.fillText('UNE ORANGE !', 0, -92);
  if (couleur) { verreJus(c, 0, 120, .9, 1, { rondelle: 1 }); orangeFruit(c, -90, 110, 30); orangeFruit(c, 92, 116, 26); } else { verreNB(c, 0, 130, 1.1); orangeNB(c, -90, 110, 28); orangeNB(c, 92, 116, 24); }
  c.font = 'italic bold 18px Georgia'; c.fillStyle = couleur ? '#2a5a2a' : GRIS.noir; c.fillText('Sunshine Oranges — Californie', 0, 180);
  c.restore(); ink(c, 8, couleur ? '#7a4a1a' : GRIS.noir); c.beginPath(); c.moveTo(-160, -206); c.lineTo(160, -206); c.stroke(); c.restore();
}
function agenceNB(c, t, o = {}) {
  if (!_ageNB) _ageNB = fondAgence(); c.drawImage(_ageNB, 0, 0);
  afficheBuvez(c, 760, 300, .72, o.affiche == null ? 1 : o.affiche);
  if (o.derriere) o.derriere(c);
  F(c, poly([[260, 620], [640, 620], [660, 640], [240, 640]]), GRIS.fonce, 4); F(c, poly([[260, 640], [640, 640], [640, 770], [260, 770]]), '#4a4640', 4);
  for (let k = 0; k < 3; k++) F(c, poly([[300 + k * 90, 620], [370 + k * 90, 620], [370 + k * 90, 610], [300 + k * 90, 610]]), GRIS.blanc, 1.5);
  if (o.presse) presseAgrumes(c, 560, 616, .6, t, 0);
}
// le presse-agrumes en verre : on y écrase une demi-orange (u 0..1), le jus coule
function presseAgrumes(c, x, y, s, t, u) {
  c.save(); c.translate(x, y); c.scale(s, s);
  F(c, ell(0, 0, 90, 18), 'rgba(255,255,255,.5)', 3); F(c, smooth([[-90, 0], [-80, -40], [80, -40], [90, 0]]), 'rgba(230,230,225,.7)', 3); F(c, smooth([[-20, -40], [0, -96], [20, -40]]), 'rgba(240,240,235,.8)', 3);
  ink(c, 1.4, 'rgba(0,0,0,.35)'); for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(k * 6, -42); c.lineTo(k * 2, -90); c.stroke(); }
  F(c, smooth([[90, -20], [120, -26], [110, -10]]), 'rgba(230,230,225,.7)', 2);
  if (u > 0) { const d = lerp(-150, -70, ease(clamp(u))); F(c, smooth([[-48, d], [48, d], [40, d - 40], [0, d - 50], [-40, d - 40]]), GRIS.moyen, 3); F(c, ell(0, d, 48, 10), GRIS.clair, 2); if (u > .5) { c.fillStyle = GRIS.moyen; c.beginPath(); c.ellipse(0, -14, 70 * clamp(u * 2 - 1), 10 * clamp(u * 2 - 1), 0, 0, 7); c.fill(); } }
  c.restore();
}
// trois oranges → un verre
function troisOranges(c, t, u) {
  c.fillStyle = GRIS.clair; c.fillRect(0, 0, W, H); F(c, poly([[100, 120], [980, 120], [980, 700], [100, 700]]), GRIS.blanc, 6);
  c.font = 'bold 36px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('UN VERRE DE JUS =', 540, 200);
  for (let k = 0; k < 3; k++) { const v = clamp(u * 2 - k * .3), x = lerp(250 + k * 140, 760, ease(clamp(v * 1.4 - .4))), y = lerp(430, 470, v), r = 60 * (1 - ease(clamp(v * 1.4 - .4)) * .8); if (r > 6) orangeNB(c, x, y, r); }
  verreNB(c, 780, 590, 1.6, clamp(u * 1.6 - .6)); c.font = 'bold 54px Georgia'; c.fillText(u > .8 ? '3 oranges' : '', 540, 660);
}
// le laboratoire : « VITAMINE C »
function laboNB(c, t, u) {
  c.fillStyle = '#d6d2c8'; c.fillRect(0, 0, W, H); briques(c, 0, 480, W, 640, '#bdb8ad'); c.fillStyle = '#76726a'; c.fillRect(0, 640, W, H - 640);
  F(c, poly([[80, 560], [1000, 560], [1000, 590], [80, 590]]), GRIS.fonce, 4);
  for (let k = 0; k < 6; k++) { const x = 160 + k * 140, p = smooth([[x - 20, 560], [x - 34, 500], [x - 10, 460], [x - 10, 400], [x + 10, 400], [x + 10, 460], [x + 34, 500], [x + 20, 560]]); c.save(); c.clip(p); c.fillStyle = [GRIS.moyen, GRIS.clair, GRIS.fonce][k % 3]; c.fillRect(x - 40, 500 + Math.sin(t * 2 + k) * 6, 80, 80); c.restore(); ink(c, 3); c.stroke(p); for (let q = 0; q < 2; q++) { const b = (t * .6 + q * .5 + k * .17) % 1; c.fillStyle = `rgba(255,255,255,${.7 * (1 - b)})`; c.beginPath(); c.arc(x + Math.sin(b * 9) * 6, 400 - b * 80, 5, 0, 7); c.fill(); } }
  if (u > 0) { const k = ease(clamp(u)); c.save(); c.translate(540, 230); c.scale(.6 + .4 * k, .6 + .4 * k); c.globalAlpha = k; F(c, poly([[-260, -90], [260, -90], [260, 90], [-260, 90]]), GRIS.blanc, 6); c.font = 'bold 74px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('VITAMINE C', 0, 26); for (const sd of [-1, 1]) etoile(c, sd * 300, 0, 26); c.restore(); }
}
// la gare couverte d'affiches
let _gareNB = null;
function fondGare() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.fillStyle = '#cfcbc1'; c.fillRect(0, 0, W, H); ink(c, 8, GRIS.fonce); for (let k = 0; k < 6; k++) { c.beginPath(); c.arc(540, 520, 300 + k * 140, Math.PI, 2 * Math.PI); c.stroke(); }   // verrière
  F(c, poly([[0, 540], [W, 540], [W, 600], [0, 600]]), GRIS.moyen, 3); c.fillStyle = '#7e7a70'; c.fillRect(0, 600, W, H - 600); for (let x = 0; x < W; x += 60) { ink(c, 2, 'rgba(0,0,0,.3)'); c.beginPath(); c.moveTo(x, 600); c.lineTo(x - 80, H); c.stroke(); }
  F(c, ell(540, 120, 54, 54), GRIS.blanc, 5); ink(c, 4); c.beginPath(); c.moveTo(540, 120); c.lineTo(540, 82); c.moveTo(540, 120); c.lineTo(566, 132); c.stroke();
  return cv;
}
function gareNB(c, t, n) { if (!_gareNB) _gareNB = fondGare(); c.drawImage(_gareNB, 0, 0); const P = [[150, 380], [380, 360], [700, 360], [930, 380], [540, 330]]; for (let k = 0; k < P.length; k++) { const v = clamp(n * P.length - k); if (v > 0) { const sk = v < 1 ? 1 + Math.sin(v * Math.PI) * .3 : 1; afficheBuvez(c, P[k][0], P[k][1], .42 * sk, 1); } } }
// le sucre : un verre de jus = le sucre de plusieurs oranges, sans leurs fibres
function sucreNB(c, t, u) {
  c.fillStyle = GRIS.clair; c.fillRect(0, 0, W, H); F(c, poly([[80, 110], [1000, 110], [1000, 710], [80, 710]]), GRIS.blanc, 6);
  c.font = 'bold 30px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('LE FRUIT', 300, 180); c.fillText('LE VERRE DE JUS', 780, 180);
  orangeNB(c, 300, 380, 110); ink(c, 2, GRIS.fonce); for (let k = 0; k < 8; k++) { const a = k * .785; c.beginPath(); c.moveTo(300, 380); c.lineTo(300 + Math.cos(a) * 90, 380 + Math.sin(a) * 90); c.stroke(); }
  c.font = 'italic 24px Georgia'; c.fillText('sucre + fibres', 300, 560);
  verreNB(c, 780, 520, 2.2, 1); const n = Math.floor(clamp(u) * 6); for (let k = 0; k < n; k++) F(c, poly([[700 + (k % 3) * 56, 640 - Math.floor(k / 3) * 40], [744 + (k % 3) * 56, 640 - Math.floor(k / 3) * 40], [744 + (k % 3) * 56, 604 - Math.floor(k / 3) * 40], [700 + (k % 3) * 56, 604 - Math.floor(k / 3) * 40]]), GRIS.blanc, 2.5);
  c.font = 'italic 24px Georgia'; c.fillStyle = GRIS.noir; c.fillText(u > .7 ? 'beaucoup de sucre, peu de fibres' : '', 780, 690);
}
function etiquette(c, x, y, txt, s = 1, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); F(c, poly([[-46, -20], [40, -20], [52, 0], [40, 20], [-46, 20]]), GRIS.blanc, 2.5); F(c, ell(-34, 0, 4, 4), GRIS.fonce, 1); c.font = 'bold 20px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText(txt, 4, 7); c.restore(); }
// ================================================================ ÉPISODE DIAMANT
function diamantNB(c, x, y, r, t = 0) { c.save(); c.translate(x, y); F(c, poly([[-r, -r * .3], [-r * .5, -r * .75], [r * .5, -r * .75], [r, -r * .3], [0, r]]), GRIS.blanc, 2); ink(c, 1.2, 'rgba(0,0,0,.45)'); c.beginPath(); c.moveTo(-r, -r * .3); c.lineTo(r, -r * .3); c.moveTo(-r * .25, -r * .3); c.lineTo(0, r); c.lineTo(r * .25, -r * .3); c.moveTo(-r * .25, -r * .3); c.lineTo(0, -r * .75); c.lineTo(r * .25, -r * .3); c.stroke(); const v = Math.max(0, Math.sin(t * 5 + x)); if (v > .4) { ink(c, 2, `rgba(255,255,255,${v})`); c.beginPath(); c.moveTo(r * .9 - 8, -r * .5); c.lineTo(r * .9 + 8, -r * .5); c.moveTo(r * .9, -r * .5 - 8); c.lineTo(r * .9, -r * .5 + 8); c.stroke(); } c.restore(); }
function bagueNB(c, x, y, s, t) { c.save(); c.translate(x, y); c.scale(s, s); ink(c, 7, GRIS.moyen); c.beginPath(); c.ellipse(0, 18, 26, 22, 0, 0, 7); c.stroke(); diamantNB(c, 0, -16, 14, t); c.restore(); }
// ---------------------------------------------------------------- la bijouterie de New York (o.vide : vitrines vides, o.panneau : texte, o.client)
let _bijNB = null;
function fondBijouterie() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.fillStyle = '#d4d0c6'; c.fillRect(0, 0, W, 640); for (let x = 0; x < W; x += 80) { c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(x, 0, 40, 440); }
  F(c, poly([[0, 440], [W, 440], [W, 640], [0, 640]]), '#8a867c', 2); for (let x = 0; x < W; x += 135) F(c, poly([[x + 10, 456], [x + 125, 456], [x + 125, 626], [x + 10, 626]]), '#9e9a90', 2);
  c.fillStyle = '#6e6a62'; c.fillRect(0, 640, W, H - 640); for (let y = 650; y < H; y += 40) for (let x = ((y / 40) % 2) * 40; x < W; x += 80) { c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(x, y, 40, 40); }   // damier
  F(c, poly([[300, 50], [780, 50], [780, 130], [300, 130]]), GRIS.noir, 4); c.font = 'bold 34px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText('JOAILLERIE', 540, 104); for (const sd of [-1, 1]) diamantNB(c, 540 + sd * 200, 90, 16);
  for (const x of [80, 1000]) { F(c, ell(x, 180, 40, 14), GRIS.blanc, 3); for (let k = 0; k < 6; k++) { ink(c, 1.5, GRIS.fonce); c.beginPath(); c.moveTo(x - 36 + k * 14, 186); c.lineTo(x - 40 + k * 16, 240); c.stroke(); F(c, ell(x - 40 + k * 16, 244, 4, 6), GRIS.blanc, 1); } }   // lustres
  return cv;
}
function vitrine(c, x, y, w, plein, t) { F(c, poly([[x - w, y], [x + w, y], [x + w, y - 140], [x - w, y - 140]]), 'rgba(255,255,255,.35)', 4); F(c, poly([[x - w + 10, y - 20], [x + w - 10, y - 20], [x + w - 10, y - 30], [x - w + 10, y - 30]]), GRIS.fonce, 0); F(c, poly([[x - w, y], [x + w, y], [x + w, y + 130], [x - w, y + 130]]), '#4a4640', 4);
  if (plein) for (let k = 0; k < 4; k++) { F(c, ell(x - w * .7 + k * w * .47, y - 40, 18, 8), GRIS.noir, 1.5); bagueNB(c, x - w * .7 + k * w * .47, y - 56, .55, t + k); }
  c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.moveTo(x - w + 20, y - 130); c.lineTo(x - w + 60, y - 130); c.lineTo(x - w + 20, y - 60); c.fill(); }
function bijouterieNB(c, t, o = {}) {
  if (!_bijNB) _bijNB = fondBijouterie(); c.drawImage(_bijNB, 0, 0);
  if (o.derriere) o.derriere(c);
  vitrine(c, 300, 620, 200, !o.vide, t); vitrine(c, 780, 620, 200, !o.vide, t);
  if (o.panneau) { c.save(); c.translate(540, 260); c.rotate(-.03); F(c, poly([[-190, -50], [190, -50], [190, 50], [-190, 50]]), GRIS.blanc, 4); c.font = 'bold 34px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText(o.panneau, 0, 12); c.restore(); }
  if (o.devant) o.devant(c);
}
// le coffre du diamantaire : un tas de diamants, une carte des mines
function coffreNB(c, t, o = {}) {
  c.fillStyle = '#cfcbc1'; c.fillRect(0, 0, W, H); briques(c, 0, 0, W, 640, '#bdb8ad'); c.fillStyle = '#6e6a62'; c.fillRect(0, 640, W, H - 640);
  F(c, poly([[90, 90], [450, 90], [450, 420], [90, 420]]), GRIS.blanc, 5); c.font = 'bold 22px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('LES MINES', 270, 124);
  F(c, smooth([[210, 150], [330, 150], [380, 230], [340, 330], [300, 400], [250, 340], [190, 240]]), GRIS.clair, 3);
  const n = Math.floor(clamp(o.mines || 0) * 7); for (let k = 0; k < 7; k++) { const x = 230 + hash(k) * 110, y = 180 + hash(k + 4) * 180; F(c, ell(x, y, 7, 7), k < n ? GRIS.noir : GRIS.blanc, 2); }
  if (o.mines > .9) { c.font = 'italic bold 18px Georgia'; c.fillText('presque toutes à lui', 270, 404); }
  F(c, poly([[560, 160], [980, 160], [980, 640], [560, 640]]), GRIS.fonce, 6); F(c, poly([[590, 190], [950, 190], [950, 610], [590, 610]]), GRIS.noir, 3);   // coffre ouvert
  for (let k = 0; k < 3; k++) F(c, poly([[600, 300 + k * 110], [940, 300 + k * 110], [940, 308 + k * 110], [600, 308 + k * 110]]), GRIS.moyen, 1.5);
  for (let k = 0; k < 30; k++) diamantNB(c, 620 + (k % 10) * 32, 290 + Math.floor(k / 10) * 110 - 12, 12, t + k);
  F(c, ell(770, 205, 140, 10), GRIS.fonce, 0); ink(c, 8, GRIS.fonce); c.beginPath(); c.arc(1000, 400, 40, 0, 7); c.stroke();
}
const DIAMANTAIRE = (t, x, o = {}) => figurant(t, x, 0, Object.assign({ s: .52, y: 790, chapeau: (c, hy) => { F(c, ell(0, hy - 58, 66, 10), GRIS.noir, 3); F(c, smooth([[-40, hy - 60], [-38, hy - 130], [38, hy - 130], [40, hy - 60]]), GRIS.noir, 3); F(c, poly([[-40, hy - 76], [40, hy - 76], [40, hy - 66], [-40, hy - 66]]), GRIS.moyen, 1.5); }, habit: (c, shY) => { ink(c, 3, GRIS.blanc); c.beginPath(); c.moveTo(-30, -470); c.quadraticCurveTo(-6, -446, 18, -470); c.stroke(); } }, o));
// le cinéma : grand écran, rangées de spectateurs de dos, faisceau du projecteur
function cinemaNB(c, t, o = {}) {
  c.fillStyle = '#2a2826'; c.fillRect(0, 0, W, H);
  F(c, poly([[160, 60], [920, 60], [920, 480], [160, 480]]), '#e8e6e0', 5); for (const sd of [-1, 1]) F(c, smooth([[540 + sd * 400, 40], [540 + sd * 470, 40], [540 + sd * 460, 520], [540 + sd * 390, 520]]), '#4a4640', 3);
  const g = c.createLinearGradient(540, 800, 540, 60); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(520, 810); c.lineTo(560, 810); c.lineTo(920, 60); c.lineTo(160, 60); c.closePath(); c.fill();
  if (o.film) { c.save(); c.beginPath(); c.rect(165, 65, 750, 410); c.clip(); o.film(c); c.restore(); }
  for (let r = 0; r < 2; r++) for (let k = 0; k < 9; k++) { const x = 40 + k * 125 + r * 60, y = 700 + r * 90; F(c, ell(x, y - 70, 34, 38), '#1a1816', 2); F(c, smooth([[x - 60, y + 60], [x - 50, y - 30], [x + 50, y - 30], [x + 60, y + 60]]), '#1a1816', 2); if ((k + r) % 3 === 0) { F(c, ell(x, y - 106, 50, 8), '#0e0c0a', 1); F(c, smooth([[x - 30, y - 106], [x - 26, y - 140], [x + 26, y - 140], [x + 30, y - 106]]), '#0e0c0a', 1); } }
}
// la scène du film (dans l'écran) : la vedette montre sa bague, l'acteur à genoux
function sceneFilm(c, t, Vd, Ac) { c.fillStyle = GRIS.clair; c.fillRect(0, 0, W, H); for (let k = 0; k < 6; k++) { c.fillStyle = k % 2 ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.05)'; c.fillRect(160 + k * 130, 60, 65, 420); } if (Ac) dessine(c, Ac); if (Vd) dessine(c, Vd); }
const VEDETTE = (t, x, o = {}) => figurant(t, x, 1, Object.assign({ s: .5, y: 790, chapeau: (c, hy) => { for (let k = -3; k <= 3; k++) F(c, ell(k * 15, hy - 66 + Math.abs(k) * 7, 15, 13), GRIS.fonce, 1.5); F(c, ell(44, hy - 62, 10, 6), GRIS.blanc, 1); }, habit: (c, shY) => { for (let k = 0; k < 7; k++) F(c, ell(-30 + k * 10, shY + 18 + Math.sin(k) * 2, 5, 5), GRIS.blanc, 1); } }, o));
// la salle de classe : tableau noir « LA BAGUE DE FIANÇAILLES »
function classeNB(c, t, o = {}) {
  c.fillStyle = '#d4d0c6'; c.fillRect(0, 0, W, 640); c.fillStyle = '#6e6a62'; c.fillRect(0, 640, W, H - 640);
  F(c, poly([[180, 80], [900, 80], [900, 400], [180, 400]]), '#2e2e2c', 8); c.font = 'bold 34px Georgia'; c.textAlign = 'center'; c.fillStyle = 'rgba(240,240,230,.92)'; c.fillText('LA BAGUE DE FIANÇAILLES', 540, 150);
  ink(c, 4, 'rgba(240,240,230,.9)'); c.beginPath(); c.ellipse(540, 290, 60, 50, 0, 0, 7); c.stroke(); c.beginPath(); c.moveTo(510, 230); c.lineTo(540, 200); c.lineTo(570, 230); c.lineTo(540, 260); c.closePath(); c.stroke(); c.font = 'italic 24px Georgia'; c.fillText('= amour véritable', 540, 380);
  if (o.derriere) o.derriere(c);
  for (let r = 0; r < 2; r++) for (let k = 0; k < 4; k++) { const x = 170 + k * 250, y = 660 + r * 110; F(c, poly([[x - 80, y], [x + 80, y], [x + 80, y + 14], [x - 80, y + 14]]), GRIS.fonce, 3); const P = figurant(t, x, (k + r) % 5, { s: .34, y: y + 120, face: 1, look: [0, -.5] }); dessine(c, P); }
}
// la machine à écrire de la rédactrice, la nuit, sous la lampe
function redactionNB(c, t, o = {}) {
  c.fillStyle = '#3a3834'; c.fillRect(0, 0, W, H); const g = c.createRadialGradient(560, 520, 30, 560, 520, 520); g.addColorStop(0, 'rgba(255,255,240,.55)'); g.addColorStop(1, 'rgba(255,255,240,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  F(c, poly([[880, 80], [1040, 80], [1040, 300], [880, 300]]), '#1a1816', 4); for (let k = 0; k < 14; k++) F(c, ell(900 + hash(k) * 130, 100 + hash(k + 3) * 180, 1.5, 1.5), GRIS.blanc, 0); F(c, ell(990, 130, 14, 14), GRIS.blanc, 0);   // fenêtre de nuit
  for (let k = 0; k < 9; k++) { const x = 80 + hash(k) * 300, y = 560 + hash(k + 2) * 160; c.save(); c.translate(x, y); c.rotate(hash(k + 7) * 3); F(c, ell(0, 0, 26, 20), GRIS.blanc, 2); ink(c, 1.4, 'rgba(0,0,0,.3)'); c.beginPath(); c.moveTo(-18, -6); c.lineTo(16, 8); c.stroke(); c.restore(); }   // brouillons froissés
  if (o.derriere) o.derriere(c);
  F(c, poly([[200, 640], [960, 640], [990, 670], [170, 670]]), GRIS.fonce, 4);
  ink(c, 8, GRIS.noir); c.beginPath(); c.moveTo(820, 640); c.lineTo(800, 420); c.lineTo(720, 380); c.stroke(); F(c, smooth([[650, 370], [770, 360], [750, 410], [680, 420]]), GRIS.noir, 3);   // lampe
  const x = 520, y = 640; F(c, poly([[x - 140, y], [x + 140, y], [x + 120, y - 90], [x - 120, y - 90]]), GRIS.noir, 4); for (let r = 0; r < 3; r++) for (let k = 0; k < 9; k++) F(c, ell(x - 96 + k * 24 + r * 6, y - 20 - r * 22, 8, 6), GRIS.clair, 1.5);
  F(c, poly([[x - 150, y - 100], [x + 150, y - 100], [x + 150, y - 120], [x - 150, y - 120]]), GRIS.fonce, 3);
  const n = o.texte == null ? 1 : o.texte; F(c, poly([[x - 100, y - 110], [x + 100, y - 110], [x + 100, y - 300], [x - 100, y - 300]]), GRIS.blanc, 2.5);
  const tx = 'Un diamant est éternel'; c.font = 'bold 18px Courier New'; c.textAlign = 'left'; c.fillStyle = GRIS.noir; c.fillText(tx.slice(0, Math.floor(tx.length * clamp(n))), x - 92, y - 250);
}
function sloganGeant(c, t, u) { c.fillStyle = GRIS.noir; c.fillRect(0, 0, W, H); for (let k = 0; k < 24; k++) { const a = k * Math.PI / 12 + t * .2; c.fillStyle = k % 2 ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,0)'; c.beginPath(); c.moveTo(540, 405); c.arc(540, 405, 900, a, a + Math.PI / 12); c.fill(); }
  const k = ease(clamp(u)); c.save(); c.translate(540, 360); c.scale(.4 + .6 * k, .4 + .6 * k); c.globalAlpha = k; diamantNB(c, 0, -120, 80, t); c.font = 'bold 72px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText('UN DIAMANT', 0, 70); c.fillText('EST ÉTERNEL', 0, 150); c.restore(); }
// l'affiche « deux mois de salaire »
function afficheSalaire(c, t, u) { c.fillStyle = GRIS.clair; c.fillRect(0, 0, W, H); F(c, poly([[220, 60], [860, 60], [860, 760], [220, 760]]), GRIS.blanc, 6); c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.font = 'italic bold 30px Georgia'; c.fillText('Combien vaut votre amour ?', 540, 130);
  bagueNB(c, 540, 260, 2.4, t); for (let k = 0; k < 2; k++) { const v = ease(clamp(u * 2 - k)); if (v > 0) { c.save(); c.globalAlpha = v; calendrier(c, 420 + k * 240, 520, .9, '', ['JANV.', 'FÉVR.'][k]); c.font = 'bold 36px Georgia'; c.fillText('1 mois', 420 + k * 240, 540); c.restore(); } }
  if (u > .7) { c.font = 'bold 44px Georgia'; c.fillText('= 2 MOIS DE SALAIRE', 540, 700); } }
// « RACHAT » : le comptoir de revente, quelques sous seulement
function rachatNB(c, t, u) { bijouterieNB(c, t, { panneau: 'RACHAT D’OR & BIJOUX' }); c.save(); c.translate(540, 520); F(c, poly([[-180, -60], [180, -60], [180, 60], [-180, 60]]), GRIS.blanc, 4); c.font = 'bold 30px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('ACHAT : 1 000 $', 0, -12); const v = clamp(u); c.fillText('REVENTE : ' + Math.round(lerp(1000, 300, ease(v))) + ' $', 0, 34); c.restore(); }
function projecteur2(c, x, a) { if (a <= 0) return; const g = c.createRadialGradient(x, 80, 10, x, 500, 300); g.addColorStop(0, `rgba(255,255,255,${.55 * a})`); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(x - 30, 60); c.lineTo(x + 30, 60); c.lineTo(x + 220, 560); c.lineTo(x - 220, 560); c.fill(); F(c, ell(x, 540, 200, 20), `rgba(255,255,255,${.3 * a})`, 0); }
