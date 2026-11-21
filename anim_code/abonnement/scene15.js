// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton : « La prochaine fois, je mets un rappel avant la fin de l’essai. » ; s15b : le renard : « Ou tu résilies dès le premier jour. Tu gardes souvent l’essai quand même. »
// s15c : au carnet : « Que se passe-t-il si je ne fais rien, et qui y gagne ? » ; s15d : « Voilà. Le défaut est un choix, mais ce n’est pas le tien. » — le mouton déchire le relevé en riant ; clin d’œil du renard.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.look = [-.6, 0]; M.sourire = .6;
  if (la >= 0 && lb < 0) { M.handL = [-60, -720]; M.poseL = 'pointe'; }
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { R.handR = [200, -660]; R.poseR = 'pointe'; R.sourire = .7; M.look = [-.9, 0]; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.4]; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }
  if (ld >= 0) { M.sourire = 1; M.rire = ld > D[1] * .3 ? 1 : 0; R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .6 && ld < D[1] * .6 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 440, 1.22]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, releveT: ld < 0 ? 1 : 0, t }) }, (cc) => {
    if (ld >= 0) { const a = mainScene(M, 1); for (let k = 0; k < 6; k++) { const f = clamp((ld - .3) * 1.2), x = a[0] + (k - 2.5) * 18 * (1 + f * 2), y = a[1] + 20 + f * (80 + k * 30); cc.save(); cc.translate(x, y); cc.rotate(k * .7 + f * 2); F(cc, poly([[-12, -16], [12, -14], [10, 16], [-10, 14]]), '#fdfcf6', 1.5); cc.restore(); } }
    if (lc >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['si je ne fais', clamp(u * 3)], ['rien ?', clamp(u * 3 - .6)], ['qui y', clamp(u * 3 - 1.4)], ['gagne ?', clamp(u * 3 - 2)]], 1, -.04); }
  });
  c.restore();
}
