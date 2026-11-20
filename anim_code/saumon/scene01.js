// SCÈNE 01 — Plans 01-02 (salon). Sur la table, un plateau de sushis au saumon ; le mouton en saisit un avec ses baguettes : « Des sushis au saumon : la vraie tradition japonaise. »
// Le renard, sa tasse posée, sourit en coin : « Une tradition ? Tu serais surpris de son âge. »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.handR = [-80, -560]; M.poseR = 'poing'; M.sourire = .8; M.look = [-.4, .2]; M.lid = .55;
  if (la > A[1] * .45 && lb < 0) { M.look = [-.8, 0]; M.sourcil = .5; }
  R.x = 345; R.look = [.9, .3]; R.lid = .55;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.sourcil = .8 * k; R.sourire = .7 * k; R.look = [1, .1]; R.handL = [lerp(-104, -40, k), lerp(-440, -620, k)]; R.poseL = 'pointe'; R.tilt += .05 * k; }
  c.save(); cam(c, t, [[0, 560, 430, 1.38], [B[0], 520, 410, 1.38], [DUREE, 520, 410, 1.42]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { barquetteSaumon(cc, 965, 480, .5, .05); tablePetitDej(cc, { tasse: 1, sushi: 1, t }); } }, (cc) => {
    const a = mainScene(M, 1); baguettes(cc, a[0] - 10, a[1] + 20, .5, 2.6); nigiri(cc, a[0] - 52, a[1] + 40, .5, -.2);
  });
  c.restore();
}
