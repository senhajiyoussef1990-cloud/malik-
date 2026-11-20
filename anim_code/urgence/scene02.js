// SCÈNE 02 — Plans 03-04. Le mouton hésite, tirelire dans une main, catalogue dans l'autre : « Si j'attends, je risque de rater l'offre ! »
// Le renard montre sa montre de poche et un chronomètre jouet : « L'urgence est parfois réelle. Parfois fabriquée. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 660; M.handL = [-190, -520 + Math.sin(t * 3) * 20]; M.handR = [60, -520 - Math.sin(t * 3) * 20]; M.poseL = M.poseR = 'poing'; M.froncer = .9; M.look = [Math.sin(t * 3) * .8, .3]; M.tilt = wob(tq, .9, .06);
  R.x = 410; R.look = [.8, .2];
  if (lb >= 0) { R.handL = [-170, -620]; R.handR = [170, -620]; R.poseL = R.poseR = 'poing'; R.sourcil = .6; R.look = lb < B[1] * .5 ? [-.7, .4] : [.7, .4]; M.look = [-.9, .2]; }
  c.save(); cam(c, t, [[0, 540, 400, 1.35], [DUREE, 540, 400, 1.4]]);
  dessineSalon(c, t, R, M, {}, (cc) => { const a = mainScene(M, -1), b = mainScene(M, 1); catalogue(cc, a[0], a[1] + 40, .4, { rot: -.1 }); tirelire(cc, b[0] + 10, b[1] + 10, .55);
    if (lb >= 0) { const p = mainScene(R, -1), q = mainScene(R, 1); montreGousset(cc, p[0], p[1] - 10, .8, t); chronoJouet(cc, q[0], q[1] - 10, .8, t); } });
  c.restore();
}
