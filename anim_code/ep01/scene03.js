// SCÈNE 03 — le renard ouvre les trois boîtes : mêmes biscuits. Mouton s03a, renard s03b.
const DUREE = FIN(1.4);
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s03b'], t), M = voix(moutonBase(t), ['s03a'], t), la = local('s03a', t), lb = local('s03b', t);
  const ouv = (i) => ease(seg(t, .2 + i * .35, .55 + i * .35));
  if (t < 1.4) { const i = Math.min(2, Math.floor((t - .2) / .35)); R.handR = [lerp(150, 330, Math.max(0, i) / 2), -600]; R.poseR = 'poing'; R.look = [1, .6]; R.lean = .05; }
  if (la >= 0) { M.lean = .1; M.look = [-1, .6]; M.froncer = 0; M.oreille = .25; M.handR = [60, -560]; M.handL = [-60, -560]; M.poseR = M.poseL = 'ouverte'; M.bob += Math.abs(Math.sin(t * 12)) * 6 * (la < .5); }   // « Hein ? Mais… elles sont identiques ! »
  if (lb >= 0) { R.lid = .64; R.sourcil = .7; R.look = [1, 0]; R.handR = [130, -760]; R.poseR = 'pointe'; R.tilt = -.06; M.look = [-.5, 0]; M.froncer = .8; }      // « Et pourtant, tu en préférais déjà une. »
  c.save(); cam(c, t, [[0, 470, 430, 1.18], [1.5, 470, 450, 1.34], [L.s03a[0], 700, 400, 1.24], [L.s03b[0] - .1, 420, 390, 1.22], [DUREE, 480, 405, 1.08]]);
  dessineBoutique(c, t, R, M, (cc) => BOITES.forEach(([x, y], i) => boite(cc, x, y, .82, t, i, ouv(i))));
  c.restore();
}
