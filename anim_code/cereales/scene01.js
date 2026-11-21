// SCÈNE 01 — Plans 01-02 (salon). Le mouton, sa boîte « SOLEIL D'OR » sous le bras, verse des céréales dans son bol : « Le petit-déjeuner, c'est le repas le plus important de la journée. Tout le monde le sait. »
// Le renard, sa tasse sur la table, lève un sourcil : « Tout le monde le sait… mais qui l'a dit en premier ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  const verse = la >= 0 && lb < 0 ? clamp(la / 1.5) : 0;
  M.x = 718; M.handR = [-110, -560]; M.poseR = 'poing'; M.sourire = .8; M.look = [-.3, .5]; M.lid = .55;
  if (la > A[1] * .5 && lb < 0) M.look = [-.8, 0];
  R.x = 345; R.look = [.9, .2]; R.lid = .55;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.sourcil = .9 * k; R.handL = [lerp(-104, -40, k), lerp(-440, -640, k)]; R.poseL = 'pointe'; M.look = [-1, 0]; }
  c.save(); cam(c, t, [[0, 600, 430, 1.38], [B[0], 520, 410, 1.36], [DUREE, 520, 410, 1.4]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, bol: .3 + verse * .7, lait: 1, t }) }, (cc) => {
    const a = mainScene(M, 1); boiteCereales(cc, a[0] - 10, a[1] + 10, .42, -.6 * (verse > 0 && verse < 1 ? 1 : .2), t);
    if (verse > 0 && verse < 1) for (let k = 0; k < 8; k++) { const u = (t * 2 + k / 8) % 1; flocon(cc, a[0] - 60 - u * 40, a[1] + 20 + u * 90, 6, k); }
  });
  c.restore();
}
