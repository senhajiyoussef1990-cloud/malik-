// SCÈNE 01 — salon. 
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), lb = t - B[0];
  M.x = 718; M.look = [-.5, .2]; M.sourire = .8; M.handL = [-150, -620]; M.poseL = 'ouverte'; M.froncer = .5; M.sourcil = .8;
  R.x = 345; R.look = [.9, .2]; R.lid = .5;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.lid = .3; R.sourcil = .8 * k; R.handL = [lerp(-104, -40, k), lerp(-440, -640, k)]; R.poseL = 'pointe'; M.look = [-1, 0]; M.sourire = .3; }
  c.save(); cam(c, t, [[0, 600, 440, 1.38], [B[0], 520, 420, 1.36], [DUREE, 520, 420, 1.4]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, objet: 1, t }) }, (cc) => { if (lb < 0) { const a = mainScene(M, -1); objetCouleur(cc, a[0], a[1] + 110, .55, -.08); } });
  c.restore();
}
