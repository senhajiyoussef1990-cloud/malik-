// SCÈNE 01 — Plans 01-02 (salon). Le mouton feuillette un vieux livre « La Guerre des mondes », la couverture rouge avec son tripode : « Tu sais qu'en 1938, une émission de radio a affolé toute l'Amérique ? »
// Le renard, près de la table (tasse, vieux journal « PANIQUE ! » de 1938), plisse les yeux : « Ah, la fameuse panique. Tu es sûr qu'elle a vraiment eu lieu ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.handL = [-170, -470]; M.handR = [30, -470]; M.poseL = M.poseR = 'poing'; M.sourire = .7; M.sourcil = .8; M.look = [-.4, .1];
  R.x = 345; R.look = [.9, .1]; R.lid = .55;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.lid = .4; R.sourcil = .9 * k; R.handL = [lerp(-104, -40, k), lerp(-440, -640, k)]; R.poseL = 'pointe'; R.tilt += .05 * k; M.look = [-1, 0]; }
  c.save(); cam(c, t, [[0, 600, 430, 1.38], [B[0], 520, 410, 1.36], [DUREE, 520, 410, 1.4]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, journal: 1, t }) }, (cc) => { const a = mainScene(M, -1), b = mainScene(M, 1); livreMartiens(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 20, .62, -.05); });
  c.restore();
}
