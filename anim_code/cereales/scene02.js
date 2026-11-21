// SCÈNE 02 — Plans 03-04 (salon). Le mouton hausse les épaules, la cuillère en l'air : « Des médecins, sûrement. Des nutritionnistes ? »
// Le renard tapote la boîte posée sur la table, puis montre le poste : « Regarde plutôt la boîte que tu tiens. Allons voir. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.7, 0]; M.sourire = .3;
  if (la >= 0 && lb < 0) { const k = ease(seg(la, .2, .6)); M.handL = [lerp(-104, -190, k), lerp(-366, -520, k)]; M.handR = [lerp(104, 160, k), lerp(-366, -560, k)]; M.poseL = 'ouverte'; M.poseR = 'poing'; M.tilt += .06 * k; }
  R.x = 345; R.look = [.9, .2];
  if (lb >= 0) { const k = ease(seg(lb, .1, .4)), k2 = ease(seg(lb, B[1] * .5, B[1] * .5 + .4)); R.handR = k2 > 0 ? [104, -440] : [lerp(104, 250, k), lerp(-440, -520, k)]; R.poseR = 'pointe'; if (k2 > 0) { R.handL = [-260, -620]; R.poseL = 'ouverte'; R.look = [-1, 0]; M.look = [-1, -.1]; } }
  c.save(); cam(c, t, [[0, 600, 440, 1.3], [B[0], 520, 430, 1.28], [DUREE, 470, 430, 1.26]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, bol: 1, boite: 1, t }) }, (cc) => { if (la >= 0 && lb < 0) { const h = mainScene(M, 1); cuillere(cc, h[0], h[1] - 10, .5, -.3); } });
  c.restore();
}
