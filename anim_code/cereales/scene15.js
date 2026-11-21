// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton regarde son bol, incertain : « Alors je peux sauter le petit-déjeuner ? »
// s15b : le renard, la main sur le ventre : « Écoute ton corps, pas la boîte. Chacun est différent. » ; s15c : les questions s'écrivent au carnet ;
// s15d : « Voilà. Un slogan n'est pas une étude. » — le mouton retourne la boîte, bandeau contre le mur, et mange tranquillement ; clin d'œil du renard.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.look = [-.5, .6]; M.froncer = .4; M.sourcil = .5;
  if (la >= 0 && lb < 0) { M.handR = [-120, -500]; M.poseR = 'ouverte'; }
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { R.handL = [10, -520]; R.poseL = 'ouverte'; R.sourire = .7; M.look = [-.9, 0]; M.froncer = 0; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.4]; M.sourire = .4; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }
  const mange = ld >= 0 ? Math.abs(Math.sin(ld * 3)) : 0;
  if (ld >= 0) { M.handR = [-60, lerp(-560, -680, mange)]; M.poseR = 'poing'; M.sourire = 1; M.lid = .5; M.look = [-.5, .4]; R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .55 && ld < D[1] * .55 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 440, 1.22]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { tablePetitDej(cc, { tasse: 1, bol: 1, t }); if (ld >= 0) { cc.save(); cc.translate(TABLE[0] + 60, TABLE[1] - 211); cc.scale(-1, 1); F(cc, poly([[-21, -31], [21, -31], [21, 31], [-21, 31]]), '#d8a020', 2); cc.restore(); } else boiteCereales(cc, TABLE[0] + 60, TABLE[1] - 211, .26, .08, t); } }, (cc) => {
    if (ld >= 0) { const h = mainScene(M, 1); cuillere(cc, h[0], h[1] - 10, .5, -.3); }
    if (lc >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['qui a lancé', clamp(u * 3)], ['la phrase ?', clamp(u * 3 - .6)], ['qu’est-ce', clamp(u * 3 - 1.4)], ['qu’il vend ?', clamp(u * 3 - 2)]], 1, -.04); }
  });
  c.restore();
}
