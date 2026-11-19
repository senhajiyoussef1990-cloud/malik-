// SCÈNE 13 — retour à la boutique : on sort de l'écran ; le mouton, choqué, se pointe du doigt. Mouton s13a, renard s13b.
const DUREE = FIN(1.4);
const TV = [470, 560, .95];
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s13b'], t), M = voix(moutonBase(t), ['s13a'], t), la = local('s13a', t), lb = local('s13b', t);
  M.look = [-1, .1]; R.look = [.9, .1];
  if (la >= 0) { const k = ease(seg(la, 0, .4)); M.handR = [lerp(104, 30, k), lerp(-366, -560, k)]; M.poseR = 'pointe'; M.froncer = 0; M.oreille = .2; M.look = [-.3, 0]; M.lean = -.04; M.bob += Math.abs(Math.sin(t * 14)) * 5 * (la < .4); }   // il se pointe du doigt
  if (lb >= 0) { R.lid = .62; R.sourcil = .5; R.handR = [160, -640]; R.poseR = 'ouverte'; R.tilt = wob(step(t), .7, .05); M.handR = [104, -366]; M.look = [-.8, 0]; M.froncer = .7; M.sourire = -.2; }
  const sx = TV[0] - 20 * TV[2], sy = TV[1] - 78 * TV[2], zf = W / (150 * TV[2]) * 1.05, z = 1 - ease(seg(t, 0, 1.4));
  c.save();
  cam(c, t, [[0, sx, sy, 1.2], [1.4, 560, 440, 1.2], [L.s13a[0] + .2, 720, 400, 1.22], [L.s13b[0] - .2, 420, 390, 1.2], [DUREE, 520, 405, 1.06]]);
  if (z > 0) { c.translate(sx, sy); const zz = Math.pow(zf / 1.2, z); c.scale(zz, zz); c.translate(-sx, -sy); }
  dessineBoutique(c, t, R, M, (cc) => televiseur(cc, TV[0], TV[1], TV[2], 1, t));
  c.restore();
  if (t < .3) { c.fillStyle = `rgba(255,255,255,${1 - ease(t / .3)})`; c.fillRect(0, 0, W, H); }
}
