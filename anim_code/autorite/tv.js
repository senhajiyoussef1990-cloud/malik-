// Monde du téléviseur, épisode « L’autorité mise en scène » : l’auditorium, la tribune, le costumier, le diplôme, la technicienne.
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
// ---------------------------------------------------------------- l'auditorium
let _audNB = null;
function fondAuditorium() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.fillStyle = '#3a3834'; c.fillRect(0, 0, W, H);
  for (let k = 0; k < 7; k++) { const x = 40 + k * 160; F(c, poly([[x, 0], [x + 30, 0], [x + 30, 560], [x, 560]]), '#5a5650', 2); }   // colonnes
  F(c, smooth([[0, 0], [1080, 0], [1080, 90], [900, 130], [540, 150], [180, 130], [0, 90]]), GRIS.fonce, 4);              // lambrequin
  for (let k = 0; k < 18; k++) { ink(c, 2, 'rgba(0,0,0,.35)'); c.beginPath(); c.moveTo(k * 62, 0); c.quadraticCurveTo(k * 62 + 20, 70, k * 62, 120); c.stroke(); }
  F(c, poly([[0, 520], [W, 520], [W, 560], [0, 560]]), GRIS.moyen, 4); F(c, poly([[0, 560], [W, 560], [W, 600], [0, 600]]), '#4a4844', 3);   // scène
  for (let x = 0; x < W; x += 60) { ink(c, 1.5, 'rgba(0,0,0,.3)'); c.beginPath(); c.moveTo(x, 520); c.lineTo(x, 560); c.stroke(); }
  // rangées du public, de dos
  c.fillStyle = '#1c1a18'; c.fillRect(0, 600, W, H - 600);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 12; k++) { const x = 30 + k * 92 + (r % 2) * 46, y = 690 + r * 50; F(c, ell(x, y, 30, 34), ['#5a5650', '#6a6660', '#4a4844'][(k + r) % 3], 2); F(c, ell(x, y - 40, 20, 22), '#8a8680', 2); if ((k + r) % 3 === 0) { F(c, ell(x, y - 54, 30, 7), GRIS.noir, 1.5); F(c, poly([[x - 18, y - 56], [x + 18, y - 56], [x + 16, y - 80], [x - 16, y - 80]]), GRIS.noir, 1.5); } }
  return cv;
}
function rideau(c, ouvert) {                                       // grand rideau de scène (0 fermé, 1 ouvert)
  for (const sd of [-1, 1]) { const x0 = 540 + sd * (540 * ease(ouvert)), xe = sd < 0 ? -10 : 1090;
    const p = poly([[xe, 100], [x0, 100], [x0 + sd * 20, 540], [xe, 540]]); F(c, p, '#6a6660', 4); ombre(c, p, Math.min(x0, xe), 0, Math.max(x0, xe), 0, .4);
    ink(c, 2.5, 'rgba(0,0,0,.4)'); for (let k = 1; k < 8; k++) { const x = x0 + (xe - x0) * k / 8; c.beginPath(); c.moveTo(x, 100); c.quadraticCurveTo(x + sd * 10, 320, x, 540); c.stroke(); } }
}
function projecteur2(c, x, a) { if (a <= 0) return; const g = c.createRadialGradient(x, 80, 10, x, 500, 300); g.addColorStop(0, `rgba(255,255,255,${.55 * a})`); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(x - 30, 60); c.lineTo(x + 30, 60); c.lineTo(x + 220, 560); c.lineTo(x - 220, 560); c.fill(); F(c, ell(x, 540, 200, 20), `rgba(255,255,255,${.3 * a})`, 0); }
function diplome(c, x, y, s, a = 1) { if (a <= 0) return; c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s); F(c, poly([[-150, -100], [150, -100], [150, 100], [-150, 100]]), '#d9d4c8', 10); F(c, poly([[-130, -80], [130, -80], [130, 80], [-130, 80]]), GRIS.blanc, 2); c.font = 'italic bold 28px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('Diplôme', 0, -36); c.font = 'italic 15px Georgia'; c.fillText("d'Excellence Supérieure", 0, -10); c.fillText('en Toutes Choses', 0, 12); F(c, ell(80, 50, 22, 22), GRIS.fonce, 2); for (let k = 0; k < 8; k++) { const b = k * Math.PI / 4; F(c, ell(80 + Math.cos(b) * 22, 50 + Math.sin(b) * 22, 5, 5), GRIS.fonce, 0); } ink(c, 1.5); c.beginPath(); c.moveTo(-100, 60); c.quadraticCurveTo(-60, 40, -20, 60); c.stroke(); c.restore(); }
function pupitre(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); F(c, poly([[-120, 0], [120, 0], [100, -200], [-100, -200]]), GRIS.fonce, 5); F(c, poly([[-140, -200], [140, -200], [150, -240], [-150, -240]]), GRIS.moyen, 4); F(c, ell(0, -110, 40, 40), GRIS.moyen, 3); etoile(c, 0, -110, 26); c.restore(); }
function dossiers(c, x, y, n) { for (let k = 0; k < n; k++) F(c, poly([[x - 70 + (k % 2) * 4, y - k * 18], [x + 70 + (k % 2) * 4, y - k * 18], [x + 70 + (k % 2) * 4, y - k * 18 - 16], [x - 70 + (k % 2) * 4, y - k * 18 - 16]]), [GRIS.blanc, GRIS.clair, GRIS.moyen][k % 3], 2); }
function bouteilleMemoire(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); const p = smooth([[-24, 0], [-28, -110], [-14, -140], [-14, -170], [14, -170], [14, -140], [28, -110], [24, 0]]); F(c, p, GRIS.fonce, 3); F(c, poly([[-22, -100], [22, -100], [22, -40], [-22, -40]]), GRIS.blanc, 2); c.font = 'bold 12px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('MÉMOIRE', 0, -72); c.fillText('+', 0, -52); reflet(c, p, -10, -100, 4, 30, .4, 0); c.restore(); }
function fiche(c, x, y, s, titre, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); F(c, poly([[-70, -90], [70, -90], [70, 90], [-70, 90]]), GRIS.blanc, 3); c.font = 'bold 20px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText(titre, 0, -58); ink(c, 1.2, GRIS.clair); for (let r = 0; r < 6; r++) { c.beginPath(); c.moveTo(-56, -30 + r * 22); c.lineTo(56, -30 + r * 22); c.stroke(); } c.restore(); }
// o.rideau, o.spot, o.diplome, o.pupitre, o.dossiers
function auditoriumNB(c, t, o = {}) {
  if (!_audNB) _audNB = fondAuditorium(); c.drawImage(_audNB, 0, 0);
  F(c, poly([[60, 140], [1020, 140], [1020, 520], [60, 520]]), '#8a8680', 3);                       // fond de scène
  if (o.diplome) diplome(c, 760, 280, .9, o.diplome);
  if (o.pupitre) pupitre(c, 540, 560, o.pupitre);
  if (o.dossiers) dossiers(c, 540, 316 + (1 - (o.pupitre || 1)) * 200, o.dossiers);
  if (o.rideau != null) rideau(c, o.rideau);
  projecteur2(c, o.spotX || 540, o.spot || 0);
}
function tableTechnique(c, t, u) {                                  // la technicienne : une mesure reproductible sur une table claire
  c.fillStyle = GRIS.clair; c.fillRect(0, 0, W, H); F(c, poly([[120, 540], [960, 540], [960, 560], [120, 560]]), GRIS.blanc, 4); for (const x of [150, 930]) F(c, poly([[x - 8, 560], [x + 8, 560], [x + 8, 760], [x - 8, 760]]), GRIS.fonce, 2);
  ink(c, 6, GRIS.noir); c.beginPath(); c.moveTo(540, 540); c.lineTo(540, 360); c.stroke(); const b = Math.sin(t * 2) * .08 * (1 - u); c.save(); c.translate(540, 360); c.rotate(b); ink(c, 6, GRIS.noir); c.beginPath(); c.moveTo(-200, 0); c.lineTo(200, 0); c.stroke();   // balance
  for (const sd of [-1, 1]) { ink(c, 2); c.beginPath(); c.moveTo(sd * 190, 0); c.lineTo(sd * 160, 80); c.moveTo(sd * 190, 0); c.lineTo(sd * 220, 80); c.stroke(); F(c, ell(sd * 190, 84, 46, 10), GRIS.moyen, 3); F(c, poly([[sd * 190 - 20, 74], [sd * 190 + 20, 74], [sd * 190 + 20, 50], [sd * 190 - 20, 50]]), GRIS.fonce, 2); }
  c.restore();
  c.font = 'bold 22px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; ['essai 1 : 100 g', 'essai 2 : 100 g', 'essai 3 : 100 g'].forEach((l, k) => { if (u * 3 > k) c.fillText(l, 540, 620 + k * 32); });
}
const ORATEUR = (t, x, o = {}) => { const tq = step(t); return Object.assign({ x, y: 540, s: .46, t: tq, face: 1, look: [.6, 0], blink: (t % 3.1) < .1 ? 1 : 0, tilt: wob(tq, .5, .04), bob: bnc(tq, .5) * 3 }, o); };
function habitBlouse(c, shY) { const b = smooth([[-70, shY + 10], [70, shY + 10], [86, -140], [-86, -140]]); F(c, b, GRIS.blanc, 4); ombre(c, b, -80, 0, 80, 0, .2); F(c, poly([[-18, shY + 8], [18, shY + 8], [0, shY + 80]]), GRIS.fonce, 2); for (const y of [-520, -440, -360, -280]) F(c, ell(0, y, 5, 5), GRIS.moyen, 1.5); F(c, poly([[34, -480], [66, -480], [66, -440], [34, -440]]), GRIS.clair, 2); ink(c, 3, GRIS.noir); c.beginPath(); c.moveTo(44, -490); c.lineTo(44, -462); c.stroke(); }
