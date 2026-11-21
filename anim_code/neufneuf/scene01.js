// SCÈNE 01 — Plans 01-02 (salon). Sur la table, un grille-pain neuf et son étiquette rouge « 9,99 € » ; le mouton, ravi, la montre : « Regarde ce grille-pain : neuf euros quatre-vingt-dix-neuf. Pas même dix euros ! »
// Le renard, l’index levé : « Il manque un centime. Un seul. »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), lb = t - B[0];
  M.x = 718; M.handL = [-170, -520]; M.poseL = 'pointe'; M.look = [-.6, .5]; M.sourire = 1;
  R.x = 345; R.look = [.8, .4]; R.lid = .5;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.lid = .3; R.sourcil = .6 * k; R.handL = [lerp(-104, -40, k), lerp(-440, -680, k)]; R.poseL = 'pointe'; M.look = [-1, 0]; M.handL = [-80, -420]; }
  c.save(); cam(c, t, [[0, 600, 450, 1.38], [B[0], 520, 420, 1.36], [DUREE, 520, 420, 1.4]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, grillepain: 1, t }) });
  c.restore();
}
