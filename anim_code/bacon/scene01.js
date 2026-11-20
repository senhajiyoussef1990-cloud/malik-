// SCÈNE 01 — Plans 01-02 (salon). Le mouton tient fièrement son assiette fumante d'œufs au bacon : « Des œufs et du bacon : voilà le vrai petit-déjeuner… »
// Le renard, tasse de café à la main, hausse un sourcil : « Ah oui ? Et qui t'a appris ça ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.handL = [-150, -500]; M.handR = [10, -500]; M.poseL = M.poseR = 'poing'; M.sourire = .8; M.look = [-.3, .5]; M.lid = .55;
  if (la > A[1] * .45 && lb < 0) { M.look = [-.8, 0]; M.sourcil = .6; }
  R.x = 345; R.look = [.9, .3]; R.lid = .55;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.sourcil = .9 * k; R.look = [1, .1]; R.handL = [lerp(-104, -40, k), lerp(-440, -640, k)]; R.poseL = 'pointe'; R.tilt += .05 * k; }
  c.save(); cam(c, t, [[0, 560, 420, 1.4], [B[0], 540, 410, 1.42], [DUREE, 540, 410, 1.45]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { paquetBacon(cc, 970, 470, .42, .05); tablePetitDej(cc, { tasse: 1, cafetiere: 1, t }); } }, (cc) => {
    const a = mainScene(M, -1), b = mainScene(M, 1); assiette(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 14, .5, { fumee: t });
  });
  c.restore();
}
