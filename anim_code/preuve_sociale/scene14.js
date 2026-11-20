// SCÈNE 14 — Plan 24 (salon). « Demander pourquoi, c'est déjà reprendre sa place. » Le renard invite le mouton à faire un pas de côté.
const A = L.s14a, DUREE = A[0] + A[1] + 1.3;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s14a'], t), M = moutonBase(t), la = t - A[0];
  R.x = 420; R.look = [.9, 0];
  if (la >= 0) { const k = ease(seg(la, 0, .5)); R.handR = [lerp(104, 300, k), lerp(-440, -560, k)]; R.poseR = 'ouverte'; R.lean = .05 * k; R.sourcil = .6; R.tilt = wob(tq, .6, .04); }
  const p = ease(seg(la, A[1] * .5, A[1] * .5 + .8));                    // le pas de côté
  M.x = lerp(640, 760, p); M.handL = [-46, -480]; M.handR = [46, -480]; M.poseL = M.poseR = 'poing'; M.look = [-.9, 0];
  if (p > 0 && p < 1) { M.walk = t * 10; M.bob = Math.abs(Math.sin(t * 10)) * 8; M.face = 1; }
  if (p >= 1) { M.sourire = 1; M.froncer = 0; M.look = [-.6, -.2]; M.tilt = -.05; }
  c.save(); cam(c, t, [[0, 560, 400, 1.18], [A[0] + .4, 560, 380, 1.3], [DUREE, 600, 390, 1.24]]);
  dessineSalon(c, t, R, M, { tv: 1, ecran: emission(9, { chapeaux: 9, panneau: 1, vedette: false }) }, (cc) => { const a = mainScene(M, 1), b = mainScene(M, -1); chapeauMode(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 6, .44, 0); });
  // un trait de lumière au sol : la file qu'il quitte
  c.restore();
}
