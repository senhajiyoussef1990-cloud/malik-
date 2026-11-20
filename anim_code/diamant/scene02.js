// SCÈNE 02 — Plans 03-04 (salon). Le mouton pose l'écrin, compte sur ses doigts : « Ben… par la tradition. Et elle doit coûter deux mois de salaire. »
// Le renard se tourne vers le poste : « Deux mois ? Voyons qui a fixé ce prix-là. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.7, 0]; M.sourire = .2;
  if (la >= 0 && lb < 0) { M.handL = [-60, -600]; M.poseL = la > A[1] * .5 ? 'ouverte' : 'pointe'; M.sourcil = .7; M.tilt += .05; }
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0) { const k = ease(seg(lb, .1, .6)); R.look = [lerp(.9, -1, k), -.1]; R.handL = [lerp(-104, -260, k), lerp(-440, -620, k)]; R.poseL = 'ouverte'; R.sourcil = .6; M.look = [-1, -.1]; }
  c.save(); cam(c, t, [[0, 600, 440, 1.3], [B[0], 470, 430, 1.28]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { revueDiamant(cc, 965, 470, .45, .05); tablePetitDej(cc, { tasse: 1, fleurs: 1, ecrin: 1, t }); } });
  c.restore();
}
