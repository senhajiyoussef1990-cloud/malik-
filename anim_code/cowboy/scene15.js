// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton, l’affiche à la main : « Alors quand une pub me montre un héros… » ; s15b : le renard : « Regarde ce qu’il tient dans la main, pas ce qu’il te fait rêver. »
// s15c : au carnet : « Qui joue ce rôle, et qu’est-ce qu’on me vend vraiment ? » ; s15d : « Voilà. Un héros d’affiche ne fume pas pour toi… il fume pour la marque. » — le mouton roule l’affiche et la range ; clin d’œil du renard.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.look = [-.6, 0]; M.handR = [-80, -560]; M.poseR = 'poing'; M.sourcil = .6;
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { R.handR = [200, -560]; R.poseR = 'pointe'; R.sourire = .7; M.look = [-.9, 0]; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.4]; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }
  if (ld >= 0) { M.sourire = 1; R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .6 && ld < D[1] * .6 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 440, 1.22]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, roulee: ld >= 0 ? 1 : 0, t }) }, (cc) => {
    if (ld < 0) { const a = mainScene(M, 1); afficheCowboy(cc, a[0] - 20, a[1] + 120, .7, -.08); }
    if (lc >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['qui joue', clamp(u * 3)], ['ce rôle ?', clamp(u * 3 - .6)], ['que me vend-', clamp(u * 3 - 1.4)], ['on vraiment ?', clamp(u * 3 - 2)]], 1, -.04); }
  });
  c.restore();
}
