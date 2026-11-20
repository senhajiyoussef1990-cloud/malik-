// Épisode « La peur et la rumeur » — éléments communs (salon en couleur + monde N&B du téléviseur).
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
  if (R) { c.save(); c.translate(0, -R.bob); drawRenard(c, R); c.restore(); }
  if (M) { c.save(); c.translate(0, -M.bob); drawMouton(c, M); c.restore(); }
  if (avant) avant(c);
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
// la radio du buffet qui joue la réclame : ondes + notes de musique
const RADIO = [895, 470];
function radioJoue(c, t, vol) {
  if (vol <= 0) return; const [x, y] = RADIO;
  for (let k = 0; k < 3; k++) { const r = 20 + ((t * 50 + k * 25) % 75); ink(c, 3, `rgba(255,230,150,${vol * (1 - r / 100)})`); c.beginPath(); c.arc(x, y, r, -2.4, -.7); c.stroke(); }
  for (let k = 0; k < 4; k++) { const u = (t * .5 + k * .25) % 1, nx = x - 30 - u * 120 + Math.sin(u * 9 + k) * 12, ny = y - 40 - u * 140; c.save(); c.globalAlpha = vol * (1 - u); note(c, nx, ny, k % 2); c.restore(); }
}
function note(c, x, y, double) { F(c, ell(x, y, 9, 7, -.4), '#3a1a0a', 2); ink(c, 3, '#3a1a0a'); c.beginPath(); c.moveTo(x + 8, y - 2); c.lineTo(x + 8, y - 34); c.stroke(); if (double) { F(c, ell(x + 22, y - 6, 9, 7, -.4), '#3a1a0a', 2); c.beginPath(); c.moveTo(x + 30, y - 8); c.lineTo(x + 30, y - 40); c.lineTo(x + 8, y - 34); c.stroke(); } else { c.beginPath(); c.moveTo(x + 8, y - 34); c.quadraticCurveTo(x + 22, y - 24, x + 18, y - 12); c.stroke(); } }
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

// le journal : une alarmante (gros titre + illustration sombre) ; verso : le petit paragraphe explicatif
function journal(c, x, y, s, o = {}) {
  c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.scale(s * (Math.cos((o.tourne || 0) * Math.PI) || .01), s);
  const v = o.verso || (o.tourne || 0) > .5;
  F(c, poly([[-110, -150], [110, -150], [110, 150], [-110, 150]]), '#f4efe0', 3); ink(c, 1, 'rgba(0,0,0,.15)'); c.beginPath(); c.moveTo(0, -150); c.lineTo(0, 150); c.stroke();
  c.save(); if (o.tourne > .5) c.scale(-1, 1);
  if (!v) {
    c.font = 'bold 13px Georgia'; c.textAlign = 'center'; c.fillStyle = '#2a2a2a'; c.fillText('LE PETIT ÉCHO', 0, -132);
    F(c, poly([[-100, -124], [100, -124], [100, -122], [-100, -122]]), '#2a2a2a', 0);
    c.font = 'bold 28px Georgia'; c.fillStyle = '#a8181a'; c.fillText(o.titre || 'ALERTE !', 0, -92); c.font = 'bold 15px Georgia'; c.fillStyle = '#1a1a1a'; c.fillText(o.sous || 'Un danger rôde en ville', 0, -70);
    F(c, poly([[-96, -60], [96, -60], [96, 50], [-96, 50]]), '#3a3632', 2);                    // l'illustration dramatique : une ombre géante
    F(c, smooth([[-60, 50], [-50, -10], [-30, -40], [0, -50], [30, -40], [50, -10], [60, 50]]), '#0a0808', 0); F(c, ell(-14, -24, 6, 4), '#e8d8a0', 0); F(c, ell(14, -24, 6, 4), '#e8d8a0', 0);
    ink(c, 1.2, 'rgba(40,40,40,.5)'); for (let r = 0; r < 6; r++) for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(sd > 0 ? 6 : -100, 64 + r * 14); c.lineTo(sd > 0 ? 100 : -6, 64 + r * 14); c.stroke(); }
  } else {
    c.font = 'italic 11px Georgia'; c.textAlign = 'left'; c.fillStyle = '#2a2a2a';
    ink(c, 1.2, 'rgba(40,40,40,.35)'); for (let r = 0; r < 16; r++) { c.beginPath(); c.moveTo(-96, -130 + r * 14); c.lineTo(96, -130 + r * 14); c.stroke(); }
    F(c, poly([[-80, 70], [80, 70], [80, 130], [-80, 130]]), '#fffbe8', 1.5); ['Un bruit a été entendu près', "de l'entrepôt. Aucun dégât,", 'personne n’a rien vu. (p. 12)'].forEach((l, k) => c.fillText(l, -74, 88 + k * 15));
  }
  c.restore(); c.restore();
}
function loupe(c, x, y, s, a = -.6) { c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s); ink(c, 10, '#5a2e14'); c.beginPath(); c.moveTo(0, 30); c.lineTo(0, 110); c.stroke(); F(c, ell(0, 0, 34, 34), 'rgba(220,240,255,.35)', 6); ink(c, 6, '#c8a040'); c.beginPath(); c.arc(0, 0, 34, 0, 7); c.stroke(); c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.ellipse(-12, -12, 10, 5, -.7, 0, 7); c.fill(); c.restore(); }
