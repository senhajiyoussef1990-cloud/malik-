// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton, triomphant : « Alors je vais faire mes courses après le repas ! » ; s15b : le renard : « Et avec une liste. Le nez a toujours faim, la liste jamais. »
// s15c : au carnet : « Qu’est-ce qui me donne envie, mon besoin ou l’ambiance ? » ; s15d : « Voilà. Une bonne odeur n’est pas une bonne affaire. » — le mouton croque un croissant ; clin d’œil du renard.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.look = [-.6, 0]; M.sourire = .8;
  if (la >= 0 && lb < 0) { M.handL = [-60, -720]; M.poseL = 'pointe'; }
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { R.handR = [200, -560]; R.poseR = 'ouverte'; R.sourire = .7; M.look = [-.9, 0]; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.4]; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }
  if (ld >= 0) { M.sourire = 1; M.handR = [-40, -640]; M.poseR = 'poing'; R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .6 && ld < D[1] * .6 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 440, 1.22]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, panier: 1, t }) }, (cc) => {
    if (ld >= 0) { const a = mainScene(M, 1); F(cc, smooth([[a[0] - 26, a[1] + 10], [a[0] - 14, a[1] - 16], [a[0] + 14, a[1] - 18], [a[0] + 28, a[1] + 6], [a[0], a[1] + 14]]), '#e8b060', 2); }
    if (lc >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['mon besoin', clamp(u * 3)], ['ou', clamp(u * 3 - .7)], ['l’ambiance ?', clamp(u * 3 - 1.4)]], 1, -.04); }
  });
  c.restore();
}
