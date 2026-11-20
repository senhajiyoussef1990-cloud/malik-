// Monde du téléviseur, épisode « L’urgence artificielle » : la foire, le stand à la casserole, le sablier, les boutiques voisines.
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
function heros(c, R, M) { for (const P of [R, M]) if (P) { c.save(); c.translate(0, -(P.bob || 0)); (P === R ? drawRenard : drawMouton)(c, P); c.restore(); } }
function herosTV(t, rx, mx) { const R = renardBase(t), M = moutonBase(t); R.x = rx; R.y = 800; R.s = .5; M.x = mx; M.y = 810; M.s = .47; R.look = [rx < mx ? .8 : -.8, 0]; M.look = [rx < mx ? -.8 : .8, 0]; return [R, M]; }
// ---------------------------------------------------------------- la foire
let _foireNB = null;
function fondFoire() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  const ciel = c.createLinearGradient(0, 0, 0, 400); ciel.addColorStop(0, '#dcdad4'); ciel.addColorStop(1, '#f4f2ec'); c.fillStyle = ciel; c.fillRect(0, 0, W, H);
  maison(c, -30, 230, 300, '#ccc8be', 0); maison(c, 860, 240, 320, '#c4c0b6', 2);
  for (let k = 0; k < 2; k++) { const x = 300 + k * 300; F(c, poly([[x, 520], [x + 240, 520], [x + 240, 380], [x, 380]]), '#bcb8ae', 3); for (let q = 0; q < 6; q++) F(c, poly([[x - 10 + q * 43, 340], [x + 33 + q * 43, 340], [x + 38 + q * 43, 384], [x - 5 + q * 43, 384]]), q % 2 ? GRIS.blanc : GRIS.fonce, 2); }   // tentes au fond
  F(c, poly([[0, 520], [W, 520], [W, 540], [0, 540]]), '#bcb8ae', 3); paves(c, 540);
  for (const [x0, x1] of [[0, 540], [540, 1080]]) { ink(c, 2, GRIS.noir); c.beginPath(); c.moveTo(x0, 60); c.quadraticCurveTo((x0 + x1) / 2, 130, x1, 60); c.stroke(); for (let k = 1; k < 10; k++) { const u = k / 10, x = x0 + (x1 - x0) * u, y = 60 + 4 * u * (1 - u) * 70; F(c, ell(x, y + 10, 9, 12), k % 2 ? GRIS.blanc : GRIS.clair, 2); } }   // lampions
  return cv;
}
function sablier(c, x, y, s, u, t) {                              // u : part du sable déjà tombée
  c.save(); c.translate(x, y); c.scale(s, s);
  F(c, poly([[-50, -110], [50, -110], [50, -96], [-50, -96]]), GRIS.noir, 3); F(c, poly([[-50, 96], [50, 96], [50, 110], [-50, 110]]), GRIS.noir, 3);
  for (const sd of [-1, 1]) { ink(c, 6, GRIS.noir); c.beginPath(); c.moveTo(sd * 44, -96); c.lineTo(sd * 44, 96); c.stroke(); }
  const verre = new Path2D(); verre.moveTo(-34, -96); verre.quadraticCurveTo(-34, -20, -4, 0); verre.quadraticCurveTo(-34, 20, -34, 96); verre.lineTo(34, 96); verre.quadraticCurveTo(34, 20, 4, 0); verre.quadraticCurveTo(34, -20, 34, -96); verre.closePath();
  c.fillStyle = 'rgba(255,255,255,.55)'; c.fill(verre); ink(c, 3, GRIS.noir); c.stroke(verre);
  c.save(); c.clip(verre); c.fillStyle = '#8a8478'; const hs = 80 * (1 - u); c.fillRect(-40, -hs, 80, hs); const hb = 80 * u; c.beginPath(); c.moveTo(-36, 96); c.quadraticCurveTo(0, 96 - hb * 1.4, 36, 96); c.fill(); if (u < 1) { c.fillRect(-2, 0, 4, 96 - hb * .9); } c.restore();
  c.restore();
}
function casserole(c, x, y, s, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); F(c, poly([[-50, -40], [50, -40], [46, 10], [-46, 10]]), GRIS.clair, 3); F(c, ell(0, -40, 50, 10), GRIS.moyen, 3); reflet(c, poly([[-50, -40], [50, -40], [46, 10], [-46, 10]]), -20, -20, 8, 20, .5, 0); F(c, poly([[50, -34], [130, -44], [132, -32], [50, -24]]), GRIS.noir, 2); c.restore(); }
function etiquette(c, x, y, txt, s = 1, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); F(c, poly([[-46, -20], [40, -20], [52, 0], [40, 20], [-46, 20]]), GRIS.blanc, 2.5); F(c, ell(-34, 0, 4, 4), GRIS.fonce, 1); c.font = 'bold 20px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText(txt, 4, 7); c.restore(); }
// o.sablier (0..1 sable tombé), o.panneau (0 rien, 1 « DERNIÈRE CHANCE »), o.ferme (0..1 stand qui ferme), o.heure (texte de la pendule)
function standNB(c, t, o = {}) {
  if (!_foireNB) _foireNB = fondFoire(); c.drawImage(_foireNB, 0, 0);
  const x0 = 260, x1 = 820;
  F(c, poly([[x0, 300], [x1, 300], [x1 + 30, 380], [x0 - 30, 380]]), GRIS.noir, 4); for (let k = 0; k < 10; k++) F(c, poly([[x0 - 30 + k * 62, 380], [x0 + 32 + k * 62, 380], [x0 + 1 + k * 62, 410]]), k % 2 ? GRIS.blanc : GRIS.fonce, 2);   // toit du stand
  for (const x of [x0, x1]) F(c, poly([[x - 8, 300], [x + 8, 300], [x + 8, 600], [x - 8, 600]]), GRIS.fonce, 2);
  F(c, poly([[x0 - 20, 560], [x1 + 20, 560], [x1 + 20, 580], [x0 - 20, 580]]), GRIS.moyen, 3); F(c, poly([[x0, 580], [x1, 580], [x1, 700], [x0, 700]]), GRIS.fonce, 3);
  for (let k = 0; k < 4; k++) casserole(c, x0 + 60 + k * 50, 470 - k * 4, .45, 0); casserole(c, 540, 556, .9, 0);
  if (o.prix !== false) etiquette(c, 640, 520, '9 F');
  if (o.panneau > 0) { const k = ease(Math.min(1, o.panneau)); c.save(); c.translate(540, 240 - (1 - k) * 200); F(c, poly([[-210, -40], [210, -40], [210, 40], [-210, 40]]), GRIS.blanc, 5); ink(c, 3); c.strokeRect(-200, -32, 400, 64); c.font = 'bold 40px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('DERNIÈRE CHANCE !', 0, 14); for (const sd of [-1, 1]) etoile(c, sd * 240, 0, 16); c.restore(); }
  if (o.sablier != null) sablier(c, 740, 476, .8, o.sablier, t);
  if (o.ferme > 0) { const h = 320 * ease(o.ferme); F(c, poly([[x0, 380], [x1, 380], [x1, 380 + h], [x0, 380 + h]]), GRIS.clair, 3); ink(c, 1.4, 'rgba(0,0,0,.3)'); for (let y = 390; y < 380 + h; y += 14) { c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); } }
  if (o.heure) { F(c, ell(960, 110, 46, 46), GRIS.blanc, 4); ink(c, 3); const a = o.heure * Math.PI / 6; c.beginPath(); c.moveTo(960, 110); c.lineTo(960 + Math.sin(a) * 26, 110 - Math.cos(a) * 26); c.moveTo(960, 110); c.lineTo(960, 76); c.stroke(); }
}
function standFrais(c, t) {                                       // un second stand : une vraie date de fin pour des produits frais
  if (!_foireNB) _foireNB = fondFoire(); c.drawImage(_foireNB, 0, 0);
  F(c, poly([[260, 300], [820, 300], [850, 380], [230, 380]]), GRIS.moyen, 4); for (const x of [260, 820]) F(c, poly([[x - 8, 300], [x + 8, 300], [x + 8, 600], [x - 8, 600]]), GRIS.fonce, 2);
  F(c, poly([[240, 560], [840, 560], [840, 700], [240, 700]]), GRIS.fonce, 3);
  for (let k = 0; k < 6; k++) { F(c, poly([[290 + k * 90, 560], [360 + k * 90, 560], [356 + k * 90, 520], [294 + k * 90, 520]]), GRIS.clair, 2); for (let q = 0; q < 4; q++) F(c, ell(306 + k * 90 + q * 14, 514, 9, 8), [GRIS.blanc, GRIS.moyen][(k + q) % 2], 1.2); }
  c.save(); c.translate(540, 240); F(c, poly([[-230, -50], [230, -50], [230, 50], [-230, 50]]), GRIS.blanc, 4); c.font = 'bold 28px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('FRAISES DU JOUR', 0, -8); c.font = 'italic 22px Georgia'; c.fillText('à consommer avant samedi', 0, 28); c.restore();
}
function tableauPrix(c, t, u) {                                    // les trois étiquettes alignées
  c.fillStyle = GRIS.clair; c.fillRect(0, 0, W, H); F(c, poly([[140, 120], [940, 120], [940, 700], [140, 700]]), GRIS.blanc, 6);
  c.font = 'bold 34px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('LA MÊME CASSEROLE', 540, 190);
  [['Stand « Dernière chance »', '9 F'], ['Quincaillerie du coin', '9 F'], ['Bazar de la gare', '8 F']].forEach(([n, p], k) => { const v = ease(clamp(u * 3 - k)); if (v <= 0) return; c.save(); c.globalAlpha = v; casserole(c, 260, 290 + k * 140, .6); c.font = '26px Georgia'; c.textAlign = 'left'; c.fillText(n, 360, 300 + k * 140); c.font = 'bold 40px Georgia'; c.textAlign = 'right'; c.fillText(p, 880, 304 + k * 140); c.restore(); });
}
function banc(c, x, y) { F(c, poly([[x - 120, y - 60], [x + 120, y - 60], [x + 120, y - 46], [x - 120, y - 46]]), GRIS.fonce, 3); F(c, poly([[x - 120, y - 110], [x + 120, y - 110], [x + 120, y - 96], [x - 120, y - 96]]), GRIS.fonce, 3); for (const sd of [-1, 1]) { ink(c, 6, GRIS.noir); c.beginPath(); c.moveTo(x + sd * 100, y - 110); c.lineTo(x + sd * 100, y); c.stroke(); } }
function listeCourses(c, x, y, s, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); F(c, poly([[-50, -70], [50, -70], [50, 70], [-50, 70]]), GRIS.blanc, 2.5); c.font = 'italic 15px Georgia'; c.fillStyle = GRIS.noir; c.textAlign = 'left'; ['pain', 'lait', 'pommes', 'savon'].forEach((l, k) => c.fillText('– ' + l, -40, -40 + k * 28)); c.restore(); }
const VENDEUR = (t, x, o = {}) => { const tq = step(t); return Object.assign({ x, y: 780, s: .5, t: tq, face: -1, look: [.6, 0], blink: (t % 3.1) < .1 ? 1 : 0, tilt: wob(tq, .5, .04), bob: bnc(tq, .5) * 3 }, o); };
