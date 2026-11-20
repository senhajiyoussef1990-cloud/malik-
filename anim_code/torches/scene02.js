// SCÈNE 02 — Plans 03-04 (salon). Le mouton baisse l'affiche, perplexe : « Pourquoi un fabricant aurait inventé une chose pareille ? »
// Le renard tapote l'affiche puis montre le poste : « Pour doubler le nombre de ses clients. Allons voir. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.handL = [-170, -480]; M.handR = [40, -480]; M.poseL = M.poseR = 'poing'; M.look = [-.7, 0]; M.froncer = .6; M.sourcil = .4;
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0) { const k = ease(seg(lb, .1, .4)), k2 = ease(seg(lb, B[1] * .5, B[1] * .5 + .4)); R.handL = k2 > 0 ? [lerp(-60, -260, k2), lerp(-560, -620, k2)] : [lerp(-104, -60, k), lerp(-440, -560, k)]; R.poseL = k2 > 0 ? 'ouverte' : 'pointe'; R.look = [k2 > .5 ? -1 : .9, 0]; R.sourire = .5; if (k2 > .5) M.look = [-1, -.1]; }
  c.save(); cam(c, t, [[0, 600, 440, 1.3], [B[0], 520, 430, 1.28], [DUREE, 470, 430, 1.26]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, journaux: 1, t }) }, (cc) => { const a = mainScene(M, -1), b = mainScene(M, 1); afficheLiberte(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 20, .62, .05, t); });
  c.restore();
}
