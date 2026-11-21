// SCÈNE 02 — Plans 03-04 (salon). Le mouton, un peu penaud : « Un peu obligé… Elle avait été si gentille avec moi. »
// Le renard montre le poste : « C’est exactement le but. Allons voir pourquoi. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.6, .4]; M.sourcil = .8;
  if (la >= 0 && lb < 0) { M.tilt += .06; M.oreille = .4; }
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0) { const k = ease(seg(lb, B[1] * .45, B[1] * .45 + .5)); R.look = [lerp(.9, -1, k), -.1]; R.handL = [lerp(-104, -260, k), lerp(-440, -620, k)]; R.poseL = 'ouverte'; R.sourire = .7; M.look = [-1, -.1]; }
  c.save(); cam(c, t, [[0, 600, 440, 1.3], [B[0], 470, 430, 1.28]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, fromage: 1, t }) });
  c.restore();
}
