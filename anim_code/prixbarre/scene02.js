// SCÈNE 02 — Plans 03-04 (salon). Le mouton pose le manteau sur son bras, convaincu : « Bah oui, c’est écrit, et c’est barré. Ils ne peuvent pas mentir, quand même ? »
// Le renard montre le poste : « Allons voir comment naît un prix barré. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.6, 0]; M.handR = [-200, -560]; M.poseR = 'poing';
  if (la >= 0 && lb < 0) { M.handL = [-130, -560]; M.poseL = 'ouverte'; M.sourcil = .7; }
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0) { const k = ease(seg(lb, .1, .6)); R.look = [lerp(.9, -1, k), -.1]; R.handL = [lerp(-104, -260, k), lerp(-440, -620, k)]; R.poseL = 'ouverte'; R.sourire = .7; M.look = [-1, -.1]; }
  c.save(); cam(c, t, [[0, 600, 440, 1.3], [B[0], 470, 430, 1.28]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, sac: 1, t }) }, (cc) => { const a = mainScene(M, 1); manteauCouleur(cc, a[0], a[1] + 150, .55, 0); });
  c.restore();
}
