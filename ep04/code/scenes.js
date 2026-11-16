// Mise en scène des scènes animées en code. Chaque scène : function(c, t, E)
// E.L = { id: [début, durée, locuteur] } (temps local de la scène), E.m(id, t) = ouverture de bouche 0..1
const SCENES = {};

function parle(E, id, t) { const l = E.L[id]; return l && t >= l[0] && t < l[0] + l[1]; }
function cam(c, t, keys) {           // keys : [[t, cx, cy, zoom], ...] interpolées en douceur
  let k = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (t >= b[0]) { k = b; continue; }
    if (t >= a[0]) { const u = ease((t - a[0]) / (b[0] - a[0])); k = [t, lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u)]; }
    break;
  }
  let [, cx, cy, z] = k; z = Math.max(1, z);
  cx = clamp(cx, W / (2 * z), W - W / (2 * z)); cy = clamp(cy, H / (2 * z), H - H / (2 * z));
  c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-cx, -cy);
}

// ------------------------------------------------------------ SCÈNE 02 : LE DÉFI DU RENARD
SCENES[2] = function (c, t, E) {
  const tq = step(t);
  const a = E.L.s02a, b = E.L.s02b, n = E.L.s02c;
  c.save();
  cam(c, t, [[0, 540, 405, 1], [a[0], 470, 380, 1.18], [b[0], 760, 400, 1.3], [b[0] + b[1] * .6, 760, 400, 1.3], [n[0], 540, 405, 1.05], [n[0] + n[1], 520, 390, 1.15]]);
  boutique(c, t);
  // --- le chapeau : sur l'étagère, attrapé par le renard puis posé sur le comptoir
  const FX = 330, FY = 770, FS = .95;
  const grab0 = 0.15, grab1 = .75, land = 1.3;
  let hx, hy, hs, hb = 0;
  if (t < grab1) { hx = 640; hy = 300; hs = .5; }
  else if (t < land) { const u = ease((t - grab1) / (land - grab1)); hx = lerp(640, 470, u); hy = lerp(300, 520, u) - Math.sin(u * Math.PI) * 120; hs = lerp(.5, .78, u); }
  else { hx = 470; hy = 520; hs = .78; hb = Math.max(0, 1 - (t - land) / .25); }
  // --- le renard (derrière le comptoir)
  const shX = FX + 50 * FS, shY = FY + (-330 + 24) * FS;
  let hand;
  if (t < grab0) hand = [shX + 40, shY + 120];
  else if (t < grab1) hand = [lerp(shX + 40, hx - 40, ease((t - grab0) / (grab1 - grab0))), lerp(shY + 120, hy - 60, ease((t - grab0) / (grab1 - grab0)))];
  else if (t < land) hand = [hx - 40, hy - 90];
  else if (parle(E, 's02a', t)) hand = [hx - 70 + wobble(t, 1.2, 14), hy - 140 + wobble(t, 2.4, 10)];       // « et celui-ci ? » : il présente
  else hand = [hx - 90, hy - 40];
  const fb = bnc(tq, .5);
  boing(c, FX, FY, fb, parle(E, 's02a', t) ? 9 : 4, 1, () => {
    drawRenard(c, { x: FX, y: FY, s: FS, t, face: 1, talk: parle(E, 's02a', t) ? E.m('s02a', t) : 0,
      handR: [(hand[0] - shX) / FS, (hand[1] - shY) / FS], handL: [-40, 150],
      tilt: parle(E, 's02c', t) ? -.08 : wobble(t, .4, .04), lid: parle(E, 's02c', t) ? .62 : .45, brow: parle(E, 's02c', t) ? 1 : 0,
      look: t > b[0] && t < n[0] ? [1, .2] : [.3, 0], blink: (t % 3.1) < .12 ? 1 : 0 });
  });
  comptoir(c, 130, 790, 540);
  const hsq = hb > 0 ? 1 + .18 * hb : 1;
  c.save(); c.translate(hx, hy); c.scale(1 / Math.sqrt(hsq) * 0 + 1 + .12 * hb, 1 - .14 * hb); c.translate(-hx, -hy);
  drawChapeau(c, hx, hy, hs, t); c.restore();
  // --- le mouton (devant, à droite) : rit aux éclats
  const laugh = parle(E, 's02b', t) ? 1 : (t > b[0] + b[1] ? Math.max(0, 1 - (t - b[0] - b[1]) / 1.5) : 0);
  const MX = 860, MY = 790, mb = laugh > 0 ? Math.abs(Math.sin(t * 9)) : bnc(tq, .25);
  boing(c, MX, MY, mb, laugh > 0 ? 22 : 6, 1.3, () => {
    drawMouton(c, { x: MX, y: MY, s: .95, face: -1, t, laugh, talk: parle(E, 's02b', t) ? E.m('s02b', t) : 0,
      lean: laugh * (-.12 + wobble(t, 2.2, .05)), tilt: -laugh * .1,
      handR: laugh > 0 ? [10, 170] : [60, 130], handL: laugh > 0 ? [20, 150] : [-60, 130],
      look: [-.6, 0], blink: (t % 2.7) < .12 ? 1 : 0 });
  });
  // traits de rire
  if (laugh > .3) { ink(c, 6); for (let k = 0; k < 3; k++) { const ang = -2.4 + k * .4, r0 = 120 + 20 * Math.abs(Math.sin(t * 10 + k)); c.beginPath(); c.moveTo(MX - 40 + Math.cos(ang) * 90, MY - 400 + Math.sin(ang) * 90); c.lineTo(MX - 40 + Math.cos(ang) * r0, MY - 400 + Math.sin(ang) * r0); c.stroke(); } }
  c.restore();
  pellicule(c, E.T0 + t, true);
};
