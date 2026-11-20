// Monde du téléviseur, épisode « La récompense imprévisible » : la fête foraine, la machine à surprises, le manège.
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
let _fete = null;
function fondFete() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  const ciel = c.createLinearGradient(0, 0, 0, 500); ciel.addColorStop(0, '#2a2826'); ciel.addColorStop(1, '#5a5650'); c.fillStyle = ciel; c.fillRect(0, 0, W, H);
  for (let k = 0; k < 40; k++) { c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.arc(hash(k) * W, hash(k + 9) * 260, 1 + hash(k + 3) * 1.5, 0, 7); c.fill(); }
  // grande roue au fond
  const gx = 860, gy = 220; ink(c, 3, '#9a968c'); c.beginPath(); c.arc(gx, gy, 170, 0, 7); c.stroke(); for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx + Math.cos(a) * 170, gy + Math.sin(a) * 170); c.stroke(); F(c, poly([[gx + Math.cos(a) * 170 - 12, gy + Math.sin(a) * 170], [gx + Math.cos(a) * 170 + 12, gy + Math.sin(a) * 170], [gx + Math.cos(a) * 170 + 10, gy + Math.sin(a) * 170 + 20], [gx + Math.cos(a) * 170 - 10, gy + Math.sin(a) * 170 + 20]]), '#8a8680', 1.5); }
  for (const sd of [-1, 1]) { ink(c, 6, '#7a766c'); c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx + sd * 110, 520); c.stroke(); }
  // baraques
  for (let k = 0; k < 4; k++) { const x = -20 + k * 280; F(c, poly([[x, 520], [x + 240, 520], [x + 240, 380], [x, 380]]), ['#6a6660', '#5a5650', '#7a766c', '#6a6660'][k], 3); for (let q = 0; q < 6; q++) F(c, poly([[x - 10 + q * 43, 350], [x + 33 + q * 43, 350], [x + 38 + q * 43, 384], [x - 5 + q * 43, 384]]), q % 2 ? GRIS.blanc : GRIS.fonce, 2); c.save(); c.font = 'bold 18px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText(['TIR', 'CONFISERIE', 'PÊCHE', 'LOTERIE'][k], x + 120, 340); c.restore(); }
  F(c, poly([[0, 520], [W, 520], [W, H], [0, H]]), '#7a766c', 3); for (let k = 0; k < 30; k++) { c.fillStyle = 'rgba(0,0,0,.15)'; c.beginPath(); c.ellipse(hash(k) * W, 560 + hash(k + 5) * 240, 30, 6, 0, 0, 7); c.fill(); }   // sol de terre battue
  return cv;
}
function lampions(c, t) { for (const [x0, x1] of [[0, 540], [540, 1080]]) { ink(c, 2, GRIS.noir); c.beginPath(); c.moveTo(x0, 40); c.quadraticCurveTo((x0 + x1) / 2, 110, x1, 40); c.stroke(); for (let k = 1; k < 10; k++) { const u = k / 10, x = x0 + (x1 - x0) * u, y = 40 + 4 * u * (1 - u) * 70, on = (Math.floor(t * 3) + k) % 2; F(c, ell(x, y + 12, 10, 13), on ? '#fffbe8' : GRIS.clair, 2); if (on) { const g = c.createRadialGradient(x, y + 12, 2, x, y + 12, 30); g.addColorStop(0, 'rgba(255,255,240,.5)'); g.addColorStop(1, 'rgba(255,255,240,0)'); c.fillStyle = g; c.fillRect(x - 30, y - 18, 60, 60); } } } }
function manege(c, x, y, s, t) {
  c.save(); c.translate(x, y); c.scale(s, s);
  F(c, smooth([[-200, -260], [0, -340], [200, -260]]), GRIS.blanc, 4); for (let k = 0; k < 8; k++) F(c, poly([[-200 + k * 50, -260], [-150 + k * 50, -260], [-175 + k * 50, -230]]), k % 2 ? GRIS.fonce : GRIS.blanc, 2);
  ink(c, 8, GRIS.noir); c.beginPath(); c.moveTo(0, -330); c.lineTo(0, -10); c.stroke(); F(c, ell(0, 0, 210, 30), GRIS.moyen, 4);
  for (let k = 0; k < 4; k++) { const a = t * 1.2 + k * Math.PI / 2, px = Math.sin(a) * 170, z = Math.cos(a), py = -100 + Math.sin(t * 3 + k) * 20; if (z < -.2) continue; ink(c, 3, GRIS.noir); c.beginPath(); c.moveTo(px, -250); c.lineTo(px, py); c.stroke(); c.save(); c.translate(px, py); c.scale(.8 + z * .2, .8 + z * .2); F(c, smooth([[-50, 0], [-40, -30], [30, -34], [56, -60], [64, -40], [46, -10], [40, 30], [-40, 30]]), GRIS.blanc, 3); F(c, ell(56, -50, 6, 4), GRIS.noir, 0); c.restore(); }
  c.restore();
}
// la machine à surprises : o.tiroir (0 fermé → 1 ouvert), o.contenu ('vide'|'bille'|'ticket'|'or'), o.clignote, o.jeton (0..1 descente du jeton)
function machine(c, x, y, s, t, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const corps = smooth([[-120, 0], [-130, -300], [-100, -380], [100, -380], [130, -300], [120, 0]]); F(c, corps, GRIS.fonce, 5); ombre(c, corps, -130, 0, 130, 0, .35);
  F(c, smooth([[-90, -300], [-90, -360], [90, -360], [90, -300]]), GRIS.noir, 3); c.font = 'bold 24px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText('SURPRISE !', 0, -322);
  for (let k = 0; k < 12; k++) { const a = Math.PI + k / 11 * Math.PI, on = o.clignote ? (Math.floor(t * 6) + k) % 2 : 0; F(c, ell(Math.cos(a) * 100, -380 + Math.sin(a) * -30 - 6, 7, 7), on ? '#ffffff' : '#6a6660', 1.5); }
  F(c, ell(0, -210, 70, 70), '#3a3834', 4); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4 + (o.tourne || 0); F(c, poly([[0, -210], [Math.cos(a) * 66, -210 + Math.sin(a) * 66], [Math.cos(a + .785) * 66, -210 + Math.sin(a + .785) * 66]]), k % 2 ? GRIS.clair : GRIS.moyen, 1.5); } F(c, poly([[-8, -286], [8, -286], [0, -270]]), GRIS.blanc, 2);   // roue de la chance
  F(c, poly([[-30, -120], [30, -120], [30, -110], [-30, -110]]), GRIS.noir, 2);                                     // fente à jetons
  if (o.jeton > 0 && o.jeton < 1) F(c, ell(0, lerp(-200, -116, o.jeton), 14, 14), GRIS.blanc, 2);
  const ti = ease(o.tiroir || 0); F(c, poly([[-80, -80], [80, -80], [80, -30], [-80, -30]]), '#2a2826', 3);
  c.save(); c.translate(0, ti * 30); F(c, poly([[-84, -84 + ti * 50], [84, -84 + ti * 50], [84, -26 + ti * 50], [-84, -26 + ti * 50]]), GRIS.moyen, 3); F(c, ell(0, -55 + ti * 50, 10, 6), GRIS.fonce, 1.5);
  if (ti > .5) { const ct = o.contenu || 'vide'; if (ct === 'bille') { F(c, ell(0, -94 + ti * 50, 14, 14), GRIS.blanc, 2); c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.arc(-4, -98 + ti * 50, 4, 0, 7); c.fill(); for (let k = 0; k < 6; k++) { const a = k * 1.05 + t * 2; ink(c, 2, 'rgba(255,255,255,.8)'); c.beginPath(); c.moveTo(Math.cos(a) * 20, -94 + ti * 50 + Math.sin(a) * 20); c.lineTo(Math.cos(a) * 30, -94 + ti * 50 + Math.sin(a) * 30); c.stroke(); } }
    else if (ct === 'ticket' || ct === 'or') { F(c, poly([[-30, -100 + ti * 50], [30, -100 + ti * 50], [30, -84 + ti * 50], [-30, -84 + ti * 50]]), ct === 'or' ? '#e8e4d0' : GRIS.blanc, 2); if (ct === 'or') { etoile(c, 0, -110 + ti * 50, 10); } } }
  c.restore();
  F(c, poly([[-130, 0], [130, 0], [130, 20], [-130, 20]]), GRIS.noir, 3);
  c.restore();
}
function jetons(c, x, y, n) { for (let k = 0; k < n; k++) F(c, ell(x + (k % 5) * 6, y - k * 6, 18, 6), k % 2 ? GRIS.blanc : GRIS.clair, 1.5); }
function feteNB(c, t, o = {}) { if (!_fete) _fete = fondFete(); c.drawImage(_fete, 0, 0); lampions(c, t); if (o.manege) manege(c, o.manege, 560, .9, t); }
function tableauEssais(c, t, u) { c.fillStyle = GRIS.clair; c.fillRect(0, 0, W, H); F(c, poly([[100, 160], [980, 160], [980, 640], [100, 640]]), '#2a302c', 6); c.font = 'bold 30px Georgia'; c.textAlign = 'center'; c.fillStyle = '#f4f0e4'; c.fillText('LES ESSAIS', 540, 220);
  ['vide', 'surprise', 'vide', 'surprise ?', 'vide', '?'].forEach((r, k) => { if (u * 6 < k) return; const x = 190 + k * 140; F(c, ell(x, 400, 50, 50), r.startsWith('surprise') ? '#f4f0e4' : 'rgba(0,0,0,0)', 4); ink(c, 4, '#f4f0e4'); c.beginPath(); c.arc(x, 400, 50, 0, 7); c.stroke(); c.font = 'italic 20px Georgia'; c.fillStyle = r.startsWith('surprise') ? '#2a302c' : '#f4f0e4'; c.fillText(r === '?' ? '?' : (k + 1) + 'ᵉ', x, 408); c.fillStyle = '#f4f0e4'; c.fillText(r, x, 490); }); }
function coupeMachine(c, t) {                                     // le mécanisme en coupe : une roue au hasard, des cases vides et une seule case pleine
  c.fillStyle = GRIS.clair; c.fillRect(0, 0, W, H); F(c, poly([[240, 80], [840, 80], [840, 740], [240, 740]]), GRIS.blanc, 6); ink(c, 2, 'rgba(0,0,0,.2)'); for (let y = 90; y < 740; y += 30) { c.beginPath(); c.moveTo(250, y); c.lineTo(830, y); c.stroke(); }
  const a = t * 2.4; c.save(); c.translate(540, 360); c.rotate(a); for (let k = 0; k < 10; k++) { const b = k * Math.PI / 5; F(c, poly([[0, 0], [Math.cos(b) * 200, Math.sin(b) * 200], [Math.cos(b + .628) * 200, Math.sin(b + .628) * 200]]), k === 3 ? GRIS.noir : (k % 2 ? GRIS.clair : GRIS.moyen), 2); } F(c, ell(0, 0, 26, 26), GRIS.fonce, 3); c.restore();
  F(c, poly([[528, 140], [552, 140], [540, 170]]), GRIS.noir, 2); c.font = 'italic 22px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('9 cases vides · 1 case surprise', 540, 640); c.fillText('… tirée au hasard', 540, 680);
}
const JOUEUR = (t, x, o = {}) => figurant(t, x, 3, Object.assign({ s: .5, y: 790, chapeau: COIFFE.casquette, face: 1, look: [.8, -.1] }, o));
