// SCÈNE 01 — Plans 01-02 (salon). Le mouton lève son grand verre de jus d'orange à paille : « Un grand verre de jus d'orange chaque matin : c'est bon pour la santé. »
// Le renard, près de la table (carafe, corbeille d'oranges, sa tasse de café), regarde l'horloge : « Chaque matin ? Depuis quand, au juste ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.handR = [-60, -560]; M.poseR = 'poing'; M.sourire = .8; M.look = [-.4, .3]; M.lid = .55;
  if (la > A[1] * .45 && lb < 0) { M.look = [-.8, 0]; M.sourcil = .5; }
  R.x = 345; R.look = [.9, .3]; R.lid = .55;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.sourcil = .9 * k; R.look = [lerp(.9, -.3, k), -.8 * k]; R.handL = [lerp(-104, -40, k), lerp(-440, -640, k)]; R.poseL = 'pointe'; }
  if (lb > B[1] * .6) R.look = [1, 0];
  c.save(); cam(c, t, [[0, 560, 430, 1.38], [B[0], 520, 410, 1.38], [DUREE, 520, 410, 1.42]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { briqueJus(cc, 970, 470, .4, .05); tablePetitDej(cc, { tasse: 1, carafe: .6, corbeille: 1, t }); } }, (cc) => {
    const a = mainScene(M, 1); verreJus(cc, a[0], a[1] + 30, .55, .9, { paille: 1, rondelle: 1 });
  });
  c.restore();
}
