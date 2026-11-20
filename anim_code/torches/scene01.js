// SCÈNE 01 — Plans 01-02 (salon). Le mouton déplie une vieille affiche Art déco « LA LIBERTÉ » (une femme en cloche lève sa cigarette comme une torche) : « Regarde cette vieille affiche… »
// Le renard, sa tasse sur la table, plisse les yeux : « Le symbole de la liberté… ou d'un fabricant de cigarettes ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  const dep = ease(seg(la, 0, .7));
  M.x = 718; M.handL = [-170, lerp(-366, -420, dep)]; M.handR = [40, lerp(-366, -420, dep)]; M.poseL = M.poseR = 'poing'; M.sourire = .9; M.look = [-.4, -.1]; M.sourcil = .6;
  if (la > A[1] * .5 && lb < 0) M.look = [-.9, 0];
  R.x = 345; R.look = [.9, -.1]; R.lid = .55;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.lid = .4; R.sourcil = .8 * k; R.handL = [lerp(-104, -40, k), lerp(-440, -640, k)]; R.poseL = 'pointe'; R.tilt += .05 * k; M.look = [-1, 0]; }
  c.save(); cam(c, t, [[0, 600, 420, 1.38], [B[0], 520, 410, 1.36], [DUREE, 520, 410, 1.4]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, journaux: 1, t }) }, (cc) => {
    const a = mainScene(M, -1), b = mainScene(M, 1); afficheLiberte(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 20, .3 + .25 * dep, -.03, t);
  });
  c.restore();
}
