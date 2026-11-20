// Épisode « Le diamant éternel » — éléments communs (salon en couleur + monde N&B du téléviseur).
var VIVANT_AUTO = true, CAM_COUPES = true;
var CAM_CALME = .3;
var THEME_SALON = { mur: 'ardoise' };
const AUDIO = Object.keys(L).map(id => [id, L[id][0]]);
const FIN = (extra = 1.4) => Math.max(...Object.values(L).map(l => l[0] + l[1])) + extra;
const POS = { renard: [400, 770, .6], mouton: [660, 790, .56] };
function renardBase(t) { const tq = step(t); return { x: POS.renard[0], y: POS.renard[1], s: POS.renard[2], t: tq, lid: .5, look: [.7, 0], blink: (t % 3.4) < .1 ? 1 : 0, tilt: wob(tq, .35, .035), handL: [-104, -440], handR: [104, -440], bob: bnc(tq, .5) * 2.5 }; }
function moutonBase(t) { const tq = step(t); return { x: POS.mouton[0], y: POS.mouton[1], s: POS.mouton[2], t: tq, face: -1, look: [-.7, 0], blink: (t % 2.9) < .1 ? 1 : 0, froncer: .5, sourire: .2, handL: [-104, -366], handR: [104, -366], bob: bnc(tq, .25) * 3 }; }
function voix(P, ids, t) { for (const id of ids) if (parle(id, t)) { const tq = step(t), e = bouchePour(id, L[id][0], t); P.talk = e; P.bob = Math.max(P.bob, bnc(tq, .5) * 11 + e * 6); P.tilt = (P.tilt || 0) + wob(tq, 1.9, .06) + e * .03; P.sourcil = Math.max(P.sourcil || 0, e * .8); } return P; }
// main du personnage en coordonnées de la scène (pour lui faire tenir un objet)
function mainScene(P, cote) { const h = cote > 0 ? P.handR : P.handL, f = P.face || 1; return [P.x + h[0] * P.s * f, P.y - (P.bob || 0) + (h[1] + 40) * P.s]; }
// le salon avec, optionnellement, ce que montre l'écran (dessin N&B miniature)
function dessineSalon(c, t, R, M, o = {}, avant) {
  const rect = salon(c, t, o);
  if (o.ecran) ecranTV(c, rect, t, o.ecran, o.tv || 1);
  if (o.derriere) o.derriere(c);
  if (R) vivantAuto(R, t, 'renard', M ? M.x : null, 0); if (M) vivantAuto(M, t, 'mouton', R ? R.x : null, 1.7);
  if (R) { if (R.souffle != null) dessineVivant(c, R, drawRenard); else { c.save(); c.translate(0, -R.bob); drawRenard(c, R); c.restore(); } }
  if (M) { if (M.souffle != null) dessineVivant(c, M, drawMouton); else { c.save(); c.translate(0, -M.bob); drawMouton(c, M); c.restore(); } }
  if (avant) { avant(c); if (typeof VIVANT_AUTO !== 'undefined') { if (R) tenir(c, R, 'renard'); if (M) tenir(c, M, 'mouton'); } }
}
const _ecr = document.createElement('canvas'); _ecr.width = W; _ecr.height = H; const _ecrc = _ecr.getContext('2d');
function ecranTV(c, rect, t, dessin, on) {                    // l'émission vue dans le poste (N&B, déformée en bombé)
  _ecrc.setTransform(1, 0, 0, 1, 0, 0); _ecrc.clearRect(0, 0, W, H); _ecrc.save(); dessin(_ecrc, t); _ecrc.restore();
  const [cx, cy, w, h] = rect, [tx, ty, ts] = SALON.tv, e = smooth([[-126, -28], [-132, -196], [64, -196], [58, -28]]);
  c.save(); c.translate(tx, ty); c.scale(ts, ts); c.clip(e); c.scale(1 / ts, 1 / ts); c.translate(-tx, -ty);
  c.filter = 'grayscale(1) contrast(1.15) brightness(1.05)'; c.globalAlpha = on; const dh = h + 12, dw = dh * W / H; c.drawImage(_ecr, cx - dw / 2, cy - dh / 2, dw, dh); c.filter = 'none'; c.globalAlpha = 1;
  c.fillStyle = `rgba(255,255,255,${.04 + hash(Math.floor(t * 24)) * .05})`; c.fillRect(cx - w, cy - h, w * 2, h * 2);
  ink(c, 1, 'rgba(0,0,0,.18)'); for (let y = cy - h / 2; y < cy + h / 2; y += 3) { c.beginPath(); c.moveTo(cx - w / 2 - 10, y); c.lineTo(cx + w / 2 + 10, y); c.stroke(); }   // lignes de balayage
  c.fillStyle = 'rgba(255,255,255,.1)'; c.beginPath(); c.ellipse(cx - w * .2, cy - h * .3, w * .3, h * .1, -.3, 0, 7); c.fill();
  c.restore();
}
// plongée dans l'écran (u 0→1) ou sortie (1→0) : de la caméra « de » [cx, cy, z] jusqu'à l'écran plein cadre
const ECRAN = [SALON.tv[0] - 34 * SALON.tv[2], SALON.tv[1] - 112 * SALON.tv[2], 190 * SALON.tv[2], 168 * SALON.tv[2]];
function camEcran(c, u, de) {
  const [sx, sy, sw] = ECRAN, zf = W / sw * 1.3, z = de[2] * Math.pow(zf / de[2], u);
  const v = 1 - (de[2] / z - de[2] / zf) / (1 - de[2] / zf);       // le centre suit la montée du zoom
  c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-lerp(de[0], sx, v), -lerp(de[1], sy, v));
}
function flash(c, a) { if (a > 0) { c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = `rgba(255,255,255,${a})`; c.fillRect(0, 0, W, H); } }
function bulle(c, x, y, txt, a = 1, taille = 22) {               // bulle de pensée / de refrain
  if (a <= 0) return; c.save(); c.globalAlpha = a; c.font = `italic bold ${taille}px Georgia`; const w = c.measureText(txt).width + 40;
  F(c, smooth([[x - w / 2, y - 30], [x, y - 40], [x + w / 2, y - 30], [x + w / 2 + 6, y], [x + w / 2, y + 26], [x, y + 34], [x - w / 2, y + 26], [x - w / 2 - 6, y]]), '#fffaf0', 3);
  for (const [dx, dy, r] of [[-w * .2, 44, 8], [-w * .26, 60, 5]]) F(c, ell(x + dx, y + dy, r, r), '#fffaf0', 2);
  c.fillStyle = '#3a1a0a'; c.textAlign = 'center'; c.fillText(txt, x, y + 8); c.restore();
}
function carnet(c, x, y, s, lignes, ouvert = 1, rot = 0) {          // petit carnet de notes (lignes = [[texte, progression]])
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  if (ouvert < .5) { F(c, poly([[-50, -70], [50, -70], [50, 70], [-50, 70]]), '#7a2a1a', 3); ink(c, 2, '#d9a04a'); c.strokeRect(-40, -60, 80, 120); c.restore(); return; }
  for (const sd of [-1, 1]) { F(c, poly([[0, -70], [sd * 100, -66], [sd * 100, 70], [0, 74]]), '#fbf4e2', 3); ink(c, 1, 'rgba(60,90,160,.4)'); for (let r = 0; r < 7; r++) { c.beginPath(); c.moveTo(sd * 8, -46 + r * 18); c.lineTo(sd * 92, -46 + r * 18); c.stroke(); } }
  ink(c, 2, '#7a2a1a'); c.beginPath(); c.moveTo(0, -70); c.lineTo(0, 74); c.stroke();
  c.font = 'italic bold 20px Georgia'; c.fillStyle = '#1a3a7a'; c.textAlign = 'center';
  lignes.forEach(([txt, u], k) => { if (u > 0) c.fillText(txt.slice(0, Math.ceil(txt.length * Math.min(1, u))), k % 2 ? 50 : -50, -20 + Math.floor(k / 2) * 36); });
  c.restore();
}
function crayon(c, x, y, a) { c.save(); c.translate(x, y); c.rotate(a); F(c, poly([[-4, 0], [4, 0], [4, -60], [-4, -60]]), '#e8b020', 1.5); F(c, poly([[-4, 0], [4, 0], [0, 12]]), '#e8c890', 1.2); F(c, poly([[-4, -60], [4, -60], [4, -68], [-4, -68]]), '#e88080', 1.2); c.restore(); }
function loupe(c, x, y, s, a = -.6) { c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s); ink(c, 10, '#5a2e14'); c.beginPath(); c.moveTo(0, 30); c.lineTo(0, 110); c.stroke(); F(c, ell(0, 0, 34, 34), 'rgba(220,240,255,.35)', 6); ink(c, 6, '#c8a040'); c.beginPath(); c.arc(0, 0, 34, 0, 7); c.stroke(); c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.ellipse(-12, -12, 10, 5, -.7, 0, 7); c.fill(); c.restore(); }

// ---------------------------------------------------------------- le petit-déjeuner (couleur)
function oeuf(c, x, y, s, rot = 0) {                                 // œuf au plat : blanc irrégulier + jaune brillant
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  F(c, smooth([[-46, 4], [-40, -24], [-12, -36], [20, -32], [44, -14], [46, 12], [24, 30], [-10, 32], [-38, 24]]), '#fffaf0', 2.5);
  F(c, ell(4, -2, 17, 15), '#f6b21c', 2.5); c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.ellipse(-2, -8, 6, 3.5, -.5, 0, 7); c.fill();
  c.restore();
}
function tranche(c, x, y, s, rot = 0, cuit = 1) {                  // tranche de bacon ondulée, gras et maigre
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  const haut = [], bas = []; for (let k = 0; k <= 8; k++) { const u = k / 8, xx = -70 + u * 140, w = Math.sin(u * Math.PI * 3) * 7; haut.push([xx, -12 + w]); bas.unshift([xx, 12 + w]); }
  F(c, smooth(haut.concat(bas)), cuit ? '#b4472c' : '#d8707a', 2.5);
  for (const dy of [-4, 5]) { ink(c, 4, cuit ? '#f2c79a' : '#fbe0dc'); c.beginPath(); for (let k = 0; k <= 8; k++) { const u = k / 8, xx = -66 + u * 132, w = Math.sin(u * Math.PI * 3) * 7; k ? c.lineTo(xx, dy + w) : c.moveTo(xx, dy + w); } c.stroke(); }
  c.restore();
}
function assiette(c, x, y, s, o = {}) {                              // assiette : 2 œufs + 3 tranches (o.vide, o.mange 0..1)
  c.save(); c.translate(x, y); c.scale(s, s);
  F(c, ell(0, 0, 150, 56), '#f8f4ea', 3); F(c, ell(0, -2, 112, 40), '#efe9dc', 1.5); ink(c, 3, '#3a7aa8'); c.beginPath(); c.ellipse(0, 0, 138, 50, 0, 0, 7); c.stroke();
  if (!o.vide) { const m = o.mange || 0; if (m < .8) { tranche(c, -40, -14, .55, -.2); tranche(c, -30, 4, .55, -.1); } if (m < .5) tranche(c, -20, 20, .5, .05); oeuf(c, 50, -10, .8, .2); if (m < .3) oeuf(c, 34, 16, .75, -.3); }
  c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.ellipse(-70, -20, 26, 6, -.2, 0, 7); c.fill();
  if (o.fumee) { for (let k = 0; k < 3; k++) { const u = (o.fumee * .6 + k * .33) % 1; ink(c, 4, `rgba(255,255,255,${.5 * (1 - u)})`); c.beginPath(); c.moveTo(-30 + k * 30, -30 - u * 90); c.bezierCurveTo(-50 + k * 30, -60 - u * 90, -10 + k * 30, -80 - u * 90, -30 + k * 30, -110 - u * 90); c.stroke(); } }
  c.restore();
}
function tasse(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); F(c, ell(0, 8, 46, 12), '#f8f4ea', 2.5); const p = smooth([[-30, -40], [30, -40], [26, 0], [-26, 0]]); F(c, p, '#f8f4ea', 3); ink(c, 3, '#3a7aa8'); c.beginPath(); c.moveTo(-28, -28); c.lineTo(28, -28); c.stroke(); F(c, ell(0, -40, 30, 7), '#5a3018', 2); ink(c, 6, '#f8f4ea'); c.beginPath(); c.arc(36, -22, 12, -1.4, 1.4); c.stroke(); ink(c, 2.5); c.beginPath(); c.arc(36, -22, 15, -1.4, 1.4); c.stroke(); c.restore(); }
function fourchette(c, x, y, s, a) { c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s); F(c, poly([[-4, 0], [4, 0], [3, 70], [-3, 70]]), '#cfd2d6', 1.5); F(c, poly([[-12, -40], [12, -40], [10, 0], [-10, 0]]), '#cfd2d6', 1.5); for (const dx of [-8, -3, 3, 8]) F(c, poly([[dx - 1.5, -70], [dx + 1.5, -70], [dx + 1.5, -40], [dx - 1.5, -40]]), '#cfd2d6', 1); c.restore(); }
// la boîte de céréales/bacon du buffet : « RECOMMANDÉ PAR LES MÉDECINS »
function paquetBacon(c, x, y, s, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  F(c, poly([[-60, -90], [60, -90], [60, 90], [-60, 90]]), '#c8382a', 3); F(c, poly([[-52, -40], [52, -40], [52, 40], [-52, 40]]), '#fbf4e2', 2);
  tranche(c, 0, -6, .55, -.1); tranche(c, 0, 14, .55, .05);
  c.font = 'bold 22px Georgia'; c.textAlign = 'center'; c.fillStyle = '#fbf4e2'; c.fillText('BACON', 0, -58);
  F(c, ell(0, 66, 50, 16), '#f2c230', 2); c.font = 'bold 9px Georgia'; c.fillStyle = '#7a1a10'; c.fillText('RECOMMANDÉ PAR', 0, 64); c.fillText('LES MÉDECINS', 0, 74);
  c.restore();
}
// un petit guéridon devant le fauteuil, avec le petit-déjeuner
function gueridon(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); F(c, ell(0, 0, 120, 30), '#8a4a22', 3); F(c, ell(0, -4, 112, 26), '#a85e2c', 1.5); F(c, poly([[-10, 20], [10, 20], [8, 160], [-8, 160]]), '#6a3414', 2.5); F(c, ell(0, 166, 60, 14), '#6a3414', 2.5); c.restore(); }
// la blouse blanche sur son cintre (le renard la montre : on a « emprunté la blouse »)
function blouseCintre(c, x, y, s, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  ink(c, 5, '#7a5a3a'); c.beginPath(); c.moveTo(0, -10); c.lineTo(0, -34); c.arc(10, -34, 10, Math.PI, 0); c.stroke();
  ink(c, 7, '#8a5a2a'); c.beginPath(); c.moveTo(-90, 24); c.lineTo(0, -8); c.lineTo(90, 24); c.stroke();
  const b = smooth([[-92, 22], [-40, 0], [40, 0], [92, 22], [104, 120], [80, 128], [76, 300], [-76, 300], [-80, 128], [-104, 120]]); F(c, b, '#fbfbf7', 3);
  F(c, poly([[-22, 0], [22, 0], [0, 90]]), '#d8dce0', 2); for (const yy of [110, 170, 230]) F(c, ell(0, yy, 5, 5), '#b8bcc0', 1.2);
  F(c, poly([[30, 150], [66, 150], [66, 190], [30, 190]]), '#eef0f2', 2); ink(c, 3, '#2a5aa0'); c.beginPath(); c.moveTo(40, 144); c.lineTo(40, 170); c.stroke();
  F(c, ell(-50, 70, 9, 9), '#c83a2a', 1.5); ink(c, 3, '#c83a2a'); c.beginPath(); c.moveTo(-56, 70); c.lineTo(-44, 70); c.moveTo(-50, 64); c.lineTo(-50, 76); c.stroke();   // petite croix brodée
  c.restore();
}
// la table du petit-déjeuner, entre le renard et le mouton (derrière eux) : bois tourné, nappe blanche brodée
const TABLE = [530, 770];
function tablePetitDej(c, o = {}) {
  const [x, y] = TABLE, top = y - 175;
  F(c, ell(x, y + 2, 120, 14), 'rgba(40,20,10,.25)', 0);                                        // ombre au sol
  for (const dx of [-70, 70]) { const p = smooth([[x + dx - 9, top + 20], [x + dx + 9, top + 20], [x + dx * 1.12 + 7, y], [x + dx * 1.12 - 7, y]]); F(c, p, '#7a3e18', 2.5); }
  const nappe = smooth([[x - 128, top], [x - 60, top - 22], [x + 60, top - 22], [x + 128, top], [x + 134, top + 70], [x + 110, top + 84], [x + 70, top + 76], [x + 30, top + 88], [x - 10, top + 78], [x - 50, top + 90], [x - 90, top + 78], [x - 124, top + 86], [x - 134, top + 70]]);
  F(c, nappe, '#fbf6ea', 2.5);
  c.save(); c.clip(nappe); ink(c, 1.4, 'rgba(160,120,80,.35)'); for (let k = -5; k <= 5; k++) { c.beginPath(); c.moveTo(x + k * 24, top + 8); c.quadraticCurveTo(x + k * 26, top + 50, x + k * 25, top + 92); c.stroke(); } c.restore();   // plis
  ink(c, 2.5, '#c83a2a'); c.setLineDash([5, 5]); c.beginPath(); c.moveTo(x - 126, top + 62); c.quadraticCurveTo(x, top + 84, x + 126, top + 62); c.stroke(); c.setLineDash([]);   // broderie rouge
  F(c, ell(x, top - 4, 118, 20), '#fffaf0', 2);
  if (o.assiette) assiette(c, x - 40, top - 8, .34, { fumee: o.t, mange: o.mange || 0 });
  if (o.ecrin) ecrin(c, x - 40, top - 2, .6, o.ecrin, o.t);
  if (o.fleurs) { for (let k = 0; k < 5; k++) { const a = -1 + k * .5; ink(c, 3, '#4a8a2a'); c.beginPath(); c.moveTo(x - 60, top - 6); c.lineTo(x - 60 + Math.sin(a) * 50, top - 70 - Math.cos(a) * 20); c.stroke(); F(c, ell(x - 60 + Math.sin(a) * 50, top - 74 - Math.cos(a) * 20, 12, 12), ['#e8504a', '#f2c230', '#e888a8'][k % 3], 1.5); F(c, ell(x - 60 + Math.sin(a) * 50, top - 74 - Math.cos(a) * 20, 4, 4), '#fff2b0', 0); } F(c, smooth([[x - 76, top - 4], [x - 44, top - 4], [x - 48, top - 40], [x - 72, top - 40]]), '#8ab0c8', 2); }
  if (o.tasse) tasse(c, x + 62, top - 2, .38);
  if (o.cafetiere) { c.save(); c.translate(x + 100, top - 8); F(c, smooth([[-16, 0], [16, 0], [12, -46], [-12, -46]]), '#c8a040', 2.5); F(c, poly([[-12, -36], [-30, -50], [-26, -40]]), '#c8a040', 2); F(c, ell(0, -50, 8, 5), '#a07820', 2); c.restore(); }
}

// ---------------------------------------------------------------- la bague (couleur)
function diamant(c, x, y, r, t = 0) {                                 // diamant taillé, facettes et éclats
  c.save(); c.translate(x, y);
  F(c, poly([[-r, -r * .3], [-r * .5, -r * .75], [r * .5, -r * .75], [r, -r * .3], [0, r]]), '#dff4ff', 2);
  ink(c, 1.2, 'rgba(90,140,180,.7)'); c.beginPath(); c.moveTo(-r, -r * .3); c.lineTo(r, -r * .3); c.moveTo(-r * .5, -r * .75); c.lineTo(-r * .25, -r * .3); c.lineTo(0, r); c.lineTo(r * .25, -r * .3); c.lineTo(r * .5, -r * .75); c.moveTo(-r * .25, -r * .3); c.lineTo(0, -r * .75); c.lineTo(r * .25, -r * .3); c.stroke();
  c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.moveTo(-r * .4, -r * .6); c.lineTo(-r * .15, -r * .6); c.lineTo(-r * .3, -r * .35); c.fill();
  for (let k = 0; k < 3; k++) { const a = (t * 2 + k * 2.1) % 6.28, v = Math.max(0, Math.sin(t * 5 + k * 2)); if (v > .3) { const ex = Math.cos(a) * r * 1.3, ey = Math.sin(a) * r * 1.1 - r * .2; ink(c, 2, `rgba(255,255,255,${v})`); c.beginPath(); c.moveTo(ex - 8 * v, ey); c.lineTo(ex + 8 * v, ey); c.moveTo(ex, ey - 8 * v); c.lineTo(ex, ey + 8 * v); c.stroke(); } }
  c.restore();
}
function bague(c, x, y, s, t) { c.save(); c.translate(x, y); c.scale(s, s); ink(c, 7, '#e3a42c'); c.beginPath(); c.ellipse(0, 18, 26, 22, 0, 0, 7); c.stroke(); ink(c, 2, '#fff2b0'); c.beginPath(); c.ellipse(0, 18, 26, 22, 0, 3.6, 4.6); c.stroke(); F(c, poly([[-8, -6], [8, -6], [6, 2], [-6, 2]]), '#e3a42c', 1.5); diamant(c, 0, -16, 14, t); c.restore(); }
function ecrin(c, x, y, s, ouvert, t) {                                // l'écrin en velours rouge
  c.save(); c.translate(x, y); c.scale(s, s);
  F(c, poly([[-50, 0], [50, 0], [46, -40], [-46, -40]]), '#a8182a', 2.5); F(c, poly([[-40, -40], [40, -40], [40, -34], [-40, -34]]), '#e3a42c', 1);
  if (ouvert > 0) { const h = 60 * ouvert; F(c, poly([[-46, -40], [46, -40], [44, -40 - h], [-44, -40 - h]]), '#8a1222', 2.5); F(c, poly([[-38, -44], [38, -44], [36, -36 - h], [-36, -36 - h]]), '#f2e4d0', 1.5); F(c, ell(0, -38, 30, 8), '#6a0a18', 1.5); bague(c, 0, -52, .75, t); }
  else F(c, smooth([[-46, -40], [46, -40], [40, -64], [-40, -64]]), '#8a1222', 2.5);
  c.restore();
}
// la revue du buffet : « UN DIAMANT EST ÉTERNEL »
function revueDiamant(c, x, y, s, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); F(c, poly([[-60, -84], [60, -84], [60, 84], [-60, 84]]), '#f6efe0', 3); F(c, poly([[-60, -84], [60, -84], [60, -54], [-60, -54]]), '#1a2a4a', 2); c.font = 'bold 16px Georgia'; c.textAlign = 'center'; c.fillStyle = '#f6efe0'; c.fillText('MARIAGE', 0, -64); diamant(c, 0, 6, 34, 0); c.font = 'italic bold 11px Georgia'; c.fillStyle = '#1a2a4a'; c.fillText('Un diamant', 0, 58); c.fillText('est éternel', 0, 72); c.restore(); }
