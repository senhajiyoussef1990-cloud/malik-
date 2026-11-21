// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton regarde son flacon, soulagé : « Alors je peux arrêter de me rincer la bouche trois fois par jour ? »
// s15b : le renard : « Garde de bonnes habitudes. Mais sans peur, ni excès. » ; s15c : les questions s'écrivent au carnet ;
// s15d : « Voilà. Une peur fabriquée est souvent un argument de vente. » — le mouton range le flacon et souffle dans sa main en riant ; clin d'œil du renard.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.look = [-.3, .5]; M.handR = [-80, -560]; M.poseR = 'poing'; M.sourire = .4;
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { R.handR = [200, -560]; R.poseR = 'ouverte'; R.sourire = .7; M.look = [-.9, 0]; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.4]; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }
  if (ld >= 0) { M.handR = [-40, -660]; M.poseR = 'ouverte'; M.rire = ld > D[1] * .4 ? 1 : 0; M.sourire = 1; R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .55 && ld < D[1] * .55 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 440, 1.22]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, verre: 1, flacon: ld >= 0 ? .6 : 0, t }) }, (cc) => {
    if (ld < 0) { const a = mainScene(M, 1); flaconBouche(cc, a[0] - 6, a[1] + 30, .45, -.1, .6); }
    if (lc >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['qui m’a', clamp(u * 3)], ['fait peur ?', clamp(u * 3 - .6)], ['que me', clamp(u * 3 - 1.4)], ['vend-il ?', clamp(u * 3 - 2)]], 1, -.04); }
  });
  c.restore();
}
