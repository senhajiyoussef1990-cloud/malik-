// SCÈNE 01 — Plans 01-02. Le mouton, catalogue en main : « Plus que cinq minutes ! Il faut acheter maintenant ! »
// Le renard regarde le prix calmement, le doigt sur la page : « Est-ce le produit qui presse… ou le compteur ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  M.x = 650; M.handL = [-200, -560]; M.handR = [-20, -560]; M.poseL = M.poseR = 'poing'; M.froncer = .2; M.sourcil = 1; M.look = [-.6, .3];
  if (la >= 0 && lb < 0) { M.bob += Math.abs(Math.sin(t * 12)) * 5; M.look = [-.9, -.1]; }
  R.x = 420; R.look = [.8, .4]; R.lid = .55;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.handR = [lerp(104, 270, k), lerp(-440, -560, k)]; R.poseR = 'pointe'; R.lean = .05 * k; if (lb > B[1] * .5) { R.look = [1, -.1]; R.sourcil = .8; } }
  c.save(); cam(c, t, [[0, 560, 400, 1.4], [DUREE, 560, 400, 1.45]]);
  dessineSalon(c, t, R, M, {}, (cc) => { const a = mainScene(M, -1), b = mainScene(M, 1); catalogue(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 50, .5, { rot: -.04 }); chronoJouet(cc, 870, 470, .7, t); });
  c.restore();
}
