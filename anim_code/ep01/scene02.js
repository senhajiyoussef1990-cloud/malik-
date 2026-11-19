// SCÈNE 02 — le mouton pointe aussitôt la boîte du milieu, très sûr de lui. Mouton s02a, renard s02b.
const DUREE = FIN(1.4);
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = local('s02a', t), lb = local('s02b', t);
  if (la >= 0) {                                         // « Celle du milieu ! » : il pointe la boîte du milieu, sûr de lui
    const k = ease(seg(la, 0, .35)); M.handR = [lerp(104, 330, k), lerp(-366, -520, k)]; M.poseR = 'pointe'; M.lean = .08 * k; M.froncer = .9; M.sourire = .7; M.look = [-1, .4];
    if (la > L.s02a[1] * .45) { M.tilt = wob(step(t), 1.3, .06); M.handL = [-60, -560]; M.poseL = 'ouverte'; }   // « Je ne sais pas… elle me paraît mieux. » : haussement
  }
  if (lb >= 0) { M.handR = [104, -366]; M.lean = 0; M.look = [-.6, 0]; M.froncer = .4; R.lid = .66; R.sourcil = .8; R.look = [1, 0]; R.handR = [120, -620]; R.poseR = 'ouverte'; R.tilt = -.05 + wob(step(t), .6, .03); }
  c.save(); cam(c, t, [[0, 540, 405, 1.04], [.4, 650, 420, 1.24], [L.s02b[0] - .2, 420, 390, 1.22], [DUREE, 470, 400, 1.1]]);
  dessineBoutique(c, t, R, M, (cc) => BOITES.forEach(([x, y], i) => boite(cc, x, y, .82, t, i, 0, i === 1 && la >= 0 ? .6 : 0)));
  c.restore();
}
