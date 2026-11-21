// SCÈNE 02 — Plans 03-04 (salon). Le mouton, la bouteille contre lui : « Non… mais l’eau en bouteille, c’est forcément plus pur, non ? »
// Le renard sourit et montre le poste : « Forcément ? Allons voir comment ce forcément est né. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.6, 0]; M.handR = [-80, -560]; M.poseR = 'poing';
  if (la >= 0 && lb < 0) { M.handL = [-120, -560]; M.poseL = 'ouverte'; M.sourcil = .8; }
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0) { const k = ease(seg(lb, B[1] * .4, B[1] * .4 + .5)); R.look = [lerp(.9, -1, k), -.1]; R.handL = [lerp(-104, -260, k), lerp(-440, -620, k)]; R.poseL = 'ouverte'; R.sourire = .7; M.look = [-1, -.1]; }
  c.save(); cam(c, t, [[0, 600, 440, 1.3], [B[0], 470, 430, 1.28]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, bouteilles: 3, t }) }, (cc) => { const a = mainScene(M, 1); bouteilleCouleur(cc, a[0] - 6, a[1] + 40, .5, -.12); });
  c.restore();
}
