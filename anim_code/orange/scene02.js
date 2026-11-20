// SCÈNE 02 — Plans 03-04 (salon). Le mouton pose son verre, hausse les épaules : « Depuis toujours, je crois. C'est la tradition. »
// Le renard sourit et se tourne vers le poste : « Les traditions aussi ont une date de naissance. Allons voir. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.7, 0]; M.sourire = .3;
  if (la >= 0 && lb < 0) { const k = ease(seg(la, .2, .6)); M.handL = [lerp(-104, -190, k), lerp(-366, -520, k)]; M.handR = [lerp(104, 190, k), lerp(-366, -520, k)]; M.poseL = M.poseR = 'ouverte'; M.tilt += .08 * k; M.sourcil = .6; }
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0) { const k = ease(seg(lb, .1, .6)); R.look = [lerp(.9, -1, k), -.1]; R.handL = [lerp(-104, -260, k), lerp(-440, -620, k)]; R.poseL = 'ouverte'; R.sourire = .6; M.look = [-1, -.1]; }
  c.save(); cam(c, t, [[0, 600, 440, 1.3], [B[0], 470, 430, 1.28]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { briqueJus(cc, 970, 470, .4, .05); tablePetitDej(cc, { tasse: 1, carafe: .6, corbeille: 1, verre: .9, t }); } });
  c.restore();
}
