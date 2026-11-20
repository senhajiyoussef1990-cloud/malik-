// Épisode « La preuve sociale » — éléments communs (salon en couleur + monde N&B du téléviseur).
const AUDIO = Object.keys(L).map(id => [id, L[id][0]]);
const FIN = (extra = 1.4) => Math.max(...Object.values(L).map(l => l[0] + l[1])) + extra;
const POS = { renard: [400, 770, .6], mouton: [660, 790, .56] };
function renardBase(t) { const tq = step(t); return { x: POS.renard[0], y: POS.renard[1], s: POS.renard[2], t: tq, lid: .5, look: [.7, 0], blink: (t % 3.4) < .1 ? 1 : 0, tilt: wob(tq, .35, .035), handL: [-104, -440], handR: [104, -440], bob: bnc(tq, .5) * 2.5 }; }
function moutonBase(t) { const tq = step(t); return { x: POS.mouton[0], y: POS.mouton[1], s: POS.mouton[2], t: tq, face: -1, look: [-.7, 0], blink: (t % 2.9) < .1 ? 1 : 0, froncer: .5, sourire: .2, handL: [-104, -366], handR: [104, -366], bob: bnc(tq, .25) * 3 }; }
function voix(P, ids, t) { for (const id of ids) if (parle(id, t)) { const tq = step(t), e = bouchePour(id, L[id][0], t); P.talk = e; P.bob = Math.max(P.bob, bnc(tq, .5) * 11 + e * 6); P.tilt = (P.tilt || 0) + wob(tq, 1.9, .06) + e * .03; P.sourcil = Math.max(P.sourcil || 0, e * .8); } return P; }
// main du personnage en coordonnées de la scène (pour lui faire tenir un objet)
function mainScene(P, cote) { const h = cote > 0 ? P.handR : P.handL, f = P.face || 1; return [P.x + h[0] * P.s * f, P.y - (P.bob || 0) + (h[1] + 40) * P.s]; }
const CHAP_TETE = (rot = -.05) => (c, hy) => chapeauMode(c, 0, hy - 62, 1.05, rot);
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
// ce que montre le poste pendant les plans du salon (la file devant la chapellerie)
function emission(n, o = {}) { return (cc, t) => { chapellerieNB(cc, t, o); if (o.marchand !== false) { const V = marchandBase(t, 760); V.face = -1; dessine(cc, V, drawVendeur); } file(cc, t, n, o); }; }
