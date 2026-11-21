// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton, résolu : « La prochaine fois, je décide de la taille avant de lire les prix. » ; s15b : le renard : « Excellente idée. Décide avant de comparer. »
// s15c : au carnet : « De quoi ai-je besoin, et quelle option est là pour rien ? » ; s15d : « Voilà. Un bon choix commence avant le menu. » — le mouton picore son pop-corn ; clin d’œil du renard.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.look = [-.6, 0]; M.sourcil = .4; M.sourire = .5;
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { R.handR = [200, -660]; R.poseR = 'pointe'; R.sourire = .8; M.look = [-.9, 0]; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.4]; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }
  if (ld >= 0) { M.sourire = 1; M.handL = [-40, -640]; M.poseL = 'poing'; R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .6 && ld < D[1] * .6 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 440, 1.22]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, ticket: 1, pop: .9, t }) }, (cc) => {
    if (lc >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['de quoi ai-je', clamp(u * 3)], ['besoin ?', clamp(u * 3 - .6)], ['quelle option', clamp(u * 3 - 1.4)], ['est là pour rien ?', clamp(u * 3 - 2)]], 1, -.04); }
  });
  c.restore();
}
