// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton regarde l'écrin, puis le bouquet : « Alors je peux offrir autre chose qu'un diamant ? »
// s15b : « Bien sûr. Offre ce qui a du sens pour vous deux. » ; s15c : les deux questions s'écrivent au carnet ;
// s15d : « Voilà. Une tradition peut aussi être un slogan. » — le mouton prend le bouquet dans ses bras, ravi ; clin d'œil du renard.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.look = [-.6, .6]; M.froncer = .4; M.sourcil = .6;
  if (la >= 0 && lb < 0) { M.handR = [-130, -520]; M.poseR = 'ouverte'; }
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { R.handR = [200, -560]; R.poseR = 'ouverte'; R.sourire = .8; M.look = [-.9, 0]; M.froncer = 0; M.sourire = .5; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.4]; M.sourire = .4; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }
  const prend = ld >= 0 ? ease(seg(ld, .2, 1)) : 0;
  if (ld >= 0) { M.handL = [-60, -560]; M.handR = [40, -560]; M.poseL = M.poseR = 'poing'; M.look = [-.6, .3]; M.sourire = 1.1; M.lid = .5; R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .55 && ld < D[1] * .55 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 440, 1.22]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { revueDiamant(cc, 965, 470, .45, .05); tablePetitDej(cc, { tasse: 1, fleurs: prend < .5 ? 1 : 0, ecrin: 0, t }); } }, (cc) => {
    if (lc >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['qui a fixé', clamp(u * 3)], ['la règle ?', clamp(u * 3 - .6)], ['qui y', clamp(u * 3 - 1.4)], ['gagne ?', clamp(u * 3 - 2)]], 1, -.04); }
    if (prend >= .5) { const a = mainScene(M, -1), b = mainScene(M, 1), x = (a[0] + b[0]) / 2, y = (a[1] + b[1]) / 2; for (let k = 0; k < 5; k++) { const an = -1 + k * .5; ink(cc, 3, '#4a8a2a'); cc.beginPath(); cc.moveTo(x, y + 40); cc.lineTo(x + Math.sin(an) * 40, y - 30 - Math.cos(an) * 16); cc.stroke(); F(cc, ell(x + Math.sin(an) * 40, y - 34 - Math.cos(an) * 16, 12, 12), ['#e8504a', '#f2c230', '#e888a8'][k % 3], 1.5); } F(cc, poly([[x - 16, y + 10], [x + 16, y + 10], [x + 8, y + 60], [x - 8, y + 60]]), '#f8f4ea', 2); }
  });
  c.restore();
}
