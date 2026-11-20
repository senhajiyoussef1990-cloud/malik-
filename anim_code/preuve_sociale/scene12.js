// SCÈNE 12 — Plan 22 (salon). « Et si je regardais ce qu'il vaut vraiment ? » Le mouton retourne le chapeau et inspecte l'intérieur.
const A = L.s12a, DUREE = A[0] + A[1] + 1.4;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = renardBase(t), M = voix(moutonBase(t), ['s12a'], t), la = t - A[0];
  R.x = 400; R.look = [.9, .2]; R.lid = .55;
  M.x = 660; M.handL = [-46, -480]; M.handR = [46, -480]; M.poseL = M.poseR = 'poing'; M.look = [-.5, .4]; M.froncer = .4;
  const r = ease(seg(la, .1, .9));                                       // il retourne le chapeau
  if (la >= 0) { M.handL = [-60, lerp(-480, -560, r)]; M.handR = [60, lerp(-480, -560, r)]; M.lean = .07 * r; M.look = [0, 1]; M.froncer = .9; M.sourcil = 1; M.tilt = wob(tq, .7, .06) * r; M.oreille = .2 * r; }
  if (la > A[1] + .2) { R.sourire = 1; R.sourcil = .8; R.look = [1, .1]; R.handR = [150, -560]; R.poseR = 'ouverte'; }   // le renard approuve
  c.save(); cam(c, t, [[0, 560, 400, 1.15], [A[0] + .3, 640, 400, 1.55], [DUREE, 620, 410, 1.5]]);
  dessineSalon(c, t, R, M, { tv: 1, ecran: emission(9, { chapeaux: 9, panneau: 1, vedette: false }) }, (cc) => {
    const a = mainScene(M, 1), b = mainScene(M, -1), x = (a[0] + b[0]) / 2, y = (a[1] + b[1]) / 2 + 6;
    cc.save(); cc.translate(x, y - 14 * r); cc.rotate(Math.PI * r); chapeauMode(cc, 0, -14 + 40 * r, .44, 0); cc.restore();
    if (r > .9) { F(cc, ell(x, y - 6, 36, 9), '#3a1a3a', 3); ink(cc, 1.4, '#e0c070'); cc.setLineDash([3, 3]); cc.beginPath(); cc.ellipse(x, y - 6, 30, 6, 0, 0, 7); cc.stroke(); cc.setLineDash([]); }   // l'intérieur : la doublure
  });
  c.restore();
}
