// SCÈNE 01 — Plans 01-02 (salon). Sur la table, trois bouteilles d’eau de source (étiquette à montagnes) ; le mouton serre la sienne : « Je ne bois que de l’eau en bouteille. Celle du robinet, je n’ose pas. »
// Le renard, sa tasse à la main : « Tu as déjà comparé leurs analyses ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), lb = t - B[0];
  M.x = 718; M.handR = [-80, -560]; M.poseR = 'poing'; M.look = [-.3, .4]; M.sourcil = .5;
  R.x = 345; R.look = [.9, .2]; R.lid = .5;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.lid = .3; R.sourcil = .8 * k; R.handL = [lerp(-104, -40, k), lerp(-440, -640, k)]; R.poseL = 'pointe'; M.look = [-1, 0]; }
  c.save(); cam(c, t, [[0, 600, 430, 1.38], [B[0], 520, 410, 1.36], [DUREE, 520, 410, 1.4]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, bouteilles: 3, t }) }, (cc) => { const a = mainScene(M, 1); bouteilleCouleur(cc, a[0] - 6, a[1] + 40, .5, -.12); });
  c.restore();
}
