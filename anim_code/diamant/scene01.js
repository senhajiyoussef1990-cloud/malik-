// SCÈNE 01 — Plans 01-02 (salon). Le mouton, nerveux, ouvre un écrin rouge : la bague scintille. « Pour demander sa main, il faut une bague en diamant. C'est obligé. »
// Le renard, près de la table (sa tasse, un bouquet), lève un sourcil : « Obligé ? Par qui, au juste ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.handL = [-150, -520]; M.handR = [10, -520]; M.poseL = M.poseR = 'poing'; M.sourire = .5; M.look = [-.3, .5]; M.sourcil = .6; M.froncer = .3;
  if (la > A[1] * .5 && lb < 0) { M.look = [-.8, 0]; }
  R.x = 345; R.look = [.9, .3]; R.lid = .55;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.sourcil = .9 * k; R.look = [1, .1]; R.handL = [lerp(-104, -40, k), lerp(-440, -640, k)]; R.poseL = 'pointe'; R.tilt += .05 * k; }
  c.save(); cam(c, t, [[0, 560, 430, 1.38], [B[0], 520, 410, 1.38], [DUREE, 520, 410, 1.42]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { revueDiamant(cc, 965, 470, .45, .05); tablePetitDej(cc, { tasse: 1, fleurs: 1, t }); } }, (cc) => {
    const a = mainScene(M, -1), b = mainScene(M, 1); ecrin(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 30, .7, ease(seg(la, .3, .9)), t);
  });
  c.restore();
}
