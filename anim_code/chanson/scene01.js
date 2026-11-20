// SCÈNE 01 — Plans 01-02 (salon). La radio du buffet joue, des notes s'envolent ; le mouton se dandine en fredonnant, la pochette « LE TUBE » à la main : « Cette chanson, je la détestais. Maintenant, je l'adore ! »
// Le renard, sa tasse sur la table près du tourne-disque, lève un sourcil : « Combien de fois l'as-tu entendue cette semaine ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.sourire = 1; M.lid = .5; M.look = [-.3, -.2]; M.tilt = (M.tilt || 0) + Math.sin(t * 5) * .06; M.bob += Math.abs(Math.sin(t * 5)) * 6; M.handR = [-60, -560]; M.poseR = 'poing'; M.handL = [-170, -520 + Math.sin(t * 5) * 20]; M.poseL = 'ouverte';
  R.x = 345; R.look = [.9, .1]; R.lid = .55;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.sourcil = .9 * k; R.handL = [lerp(-104, -40, k), lerp(-440, -640, k)]; R.poseL = 'pointe'; M.look = [-1, 0]; }
  c.save(); cam(c, t, [[0, 640, 420, 1.36], [B[0], 560, 410, 1.36], [DUREE, 560, 410, 1.4]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { radioJoue(cc, t, 1); tablePetitDej(cc, { tasse: 1, disque: 1, t }); } }, (cc) => { const a = mainScene(M, 1); pochette(cc, a[0] - 10, a[1] + 10, .45, -.1); });
  c.restore();
}
