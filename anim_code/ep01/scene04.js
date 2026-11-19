// SCÈNE 04 — le renard allume le vieux téléviseur sur le comptoir ; on plonge dans l'écran. Renard s04a, s04b.
const DUREE = FIN(2.2);
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s04a', 's04b'], t), M = moutonBase(t), lb = local('s04b', t);
  const tOn = L.s04b[0] + .4, on = clamp((t - tOn) / .5), zoomD = DUREE - 1.6, z = ease(seg(t, zoomD, DUREE - .1));
  if (parle('s04a', t)) { R.handR = [150, -720]; R.poseR = 'ouverte'; R.sourcil = .6; R.tilt = wob(step(t), .8, .05); R.look = [1, .2]; }
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.handR = [lerp(104, 330, k), lerp(-440, -600, k)]; R.poseR = 'pointe'; R.look = [1, .4]; R.lean = .05 * k; }   // il tourne le bouton
  M.look = t > tOn ? [-1, .1] : [-.7, 0]; if (t > tOn) { M.lean = .06; M.froncer = .2; }
  const TV = [470, 560, .95];
  c.save();
  const sx = TV[0] - 20 * TV[2], sy = TV[1] - 78 * TV[2], zf = W / (150 * TV[2]) * 1.05;
  cam(c, t, [[0, 540, 405, 1.05], [L.s04a[0] + .3, 430, 390, 1.18], [tOn - .3, 560, 440, 1.2], [zoomD, 560, 440, 1.2], [DUREE, sx, sy, zf]]);
  if (z > 0) { c.translate(sx, sy); const zz = Math.pow(zf / 1.2, z); c.scale(zz, zz); c.translate(-sx, -sy); }
  dessineBoutique(c, t, R, M, (cc) => televiseur(cc, TV[0], TV[1], TV[2], on, t));
  c.restore();
  if (t > DUREE - .35) { c.fillStyle = `rgba(255,255,255,${ease(seg(t, DUREE - .35, DUREE))})`; c.fillRect(0, 0, W, H); }
}
