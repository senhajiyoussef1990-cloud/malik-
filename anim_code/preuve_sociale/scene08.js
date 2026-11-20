// SCÈNE 08 — Plan 13 (salon). « Une file n'est pas une preuve de qualité. » Le renard montre l'écran : la file cache la vitrine.
const A = L.s08a, DUREE = A[0] + A[1] + 1.2;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s08a'], t), M = moutonBase(t), la = t - A[0];
  R.x = 400; R.look = [-.8, .2];
  if (la >= 0) { const k = ease(seg(la, 0, .4)); R.handL = [lerp(-104, -260, k), lerp(-440, -600, k)]; R.poseL = 'pointe'; R.sourcil = .7; R.look = [.8, -.1]; R.tilt = -.05;
    if (la > A[1] * .5) { R.handR = [130, -820 + wob(tq, 3, 10)]; R.poseR = 'pointe'; R.handR[0] += Math.sin(t * 14) * 12; R.lid = .6; } }   // l'index qui fait « non »
  M.x = 660; M.handL = [-46, -480]; M.handR = [46, -480]; M.poseL = M.poseR = 'poing'; M.look = [-1, .2]; M.froncer = .6;
  if (la > A[1] * .5) { M.look = [-.8, -.1]; M.froncer = .2; M.oreille = .15; }
  c.save(); cam(c, t, [[0, 320, 420, 1.3], [A[0] + A[1] * .5, 420, 380, 1.35], [DUREE, 440, 390, 1.3]]);
  dessineSalon(c, t, R, M, { tv: 1, ecran: emission(11, { regarde: true }) }, (cc) => { const a = mainScene(M, 1), b = mainScene(M, -1); chapeauMode(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 6, .44, 0); });
  c.restore();
}
