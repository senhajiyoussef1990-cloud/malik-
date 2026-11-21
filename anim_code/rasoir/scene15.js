// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton : « Alors ma cousine peut faire ce qu’elle veut ? » ; s15b : le renard : « Bien sûr. L’important, c’est que ce soit son choix. »
// s15c : au carnet : « Qui m’a appris cette honte, et qui en profite ? » ; s15d : « Voilà. Un corps n’a pas besoin de ton approbation… ni de la leur. » — le mouton referme le magazine en souriant ; clin d’œil du renard.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.look = [-.6, 0]; M.handR = [-80, -560]; M.poseR = 'poing'; M.sourcil = .6;
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { R.handR = [200, -560]; R.poseR = 'ouverte'; R.sourire = .7; M.look = [-.9, 0]; M.sourire = .6; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.4]; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }
  if (ld >= 0) { M.sourire = 1; R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .6 && ld < D[1] * .6 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 440, 1.22]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, magazine: ld >= 0 ? 1 : 0, t }) }, (cc) => {
    if (ld < 0) { const a = mainScene(M, 1); magazineCouleur(cc, a[0] - 10, a[1] + 80, .6, -.1); }
    if (lc >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['qui m’a appris', clamp(u * 3)], ['cette honte ?', clamp(u * 3 - .6)], ['qui en', clamp(u * 3 - 1.4)], ['profite ?', clamp(u * 3 - 2)]], 1, -.04); }
  });
  c.restore();
}
