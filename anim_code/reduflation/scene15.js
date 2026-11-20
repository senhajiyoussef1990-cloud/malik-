// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton retourne son paquet et cherche la petite ligne au dos, loupe en main : « Je vais regarder le prix au kilo, maintenant. »
// s15b : le renard pose l'ancien paquet à côté : « Bonne idée. Et compare avec l'ancien paquet. » ; s15c : les questions s'écrivent au carnet ;
// s15d : « Voilà. Le prix affiché ne dit pas tout. » — le mouton croque un biscuit, ravi ; clin d'œil du renard.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.look = [-.4, .5]; M.handR = [-70, -560]; M.poseR = 'poing'; M.handL = [-160, -560]; M.poseL = 'poing'; M.froncer = .5;
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { R.handR = [210, -540]; R.poseR = 'poing'; R.sourire = .6; M.look = [-.9, .3]; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.4]; M.froncer = 0; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }
  const croque = ld >= 0 ? ease(seg(ld, .3, 1.1)) : 0;
  if (ld >= 0) { M.handL = [-104, -366]; M.poseL = 'repos'; M.handR = [lerp(-70, -30, croque), lerp(-560, -690, croque)]; M.sourire = 1; M.lid = .5; R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .55 && ld < D[1] * .55 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 440, 1.22]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, biscuits: 12 - Math.round(croque), t }) }, (cc) => {
    if (ld < 0) { const a = mainScene(M, 1); paquetBiscuits(cc, a[0] - 10, a[1] + 10, .5, { n: 12, rot: -.06 }); const b = mainScene(M, -1); loupe(cc, b[0], b[1] - 20, .7, -.4); }
    else { const a = mainScene(M, 1); if (croque < .9) biscuit(cc, a[0] - 6, a[1] - 6, 18); }
    if (lb >= 0 && lc < 0) { const r = mainScene(R, 1); paquetBiscuits(cc, r[0] + 10, r[1] + 10, .5, { n: 15 }); }
    if (lc >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['combien', clamp(u * 3)], ['dedans ?', clamp(u * 3 - .6)], ['combien', clamp(u * 3 - 1.4)], ['au kilo ?', clamp(u * 3 - 2)]], 1, -.04); }
  });
  c.restore();
}
