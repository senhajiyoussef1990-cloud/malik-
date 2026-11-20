// SCÈNE 01 — Plans 01-02 (salon). Clac ! La lampe du salon grésille et s'éteint, la pièce s'assombrit ; le mouton dévisse l'ampoule grillée et la secoue : « Encore une ampoule grillée ! Elles ne durent jamais. »
// Le renard, sa tasse sur la table (et une boîte d'ampoules « 1 000 h »), sourit : « Il y en a une qui brille depuis plus de cent ans, tu sais. »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  const noir = t < .25 ? (hash(Math.floor(t * 30)) > .5 ? 1 : 0) : 1;
  M.x = 718; M.handR = [-70, -600]; M.poseR = 'poing'; M.froncer = .8; M.sourcil = .3; M.look = [-.3, -.6];
  if (la >= 0 && lb < 0) { M.handR[0] += Math.sin(t * 16) * 10; M.look = [-.8, 0]; }
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.handL = [lerp(-104, -60, k), lerp(-440, -660, k)]; R.poseL = 'pointe'; R.sourire = .6; R.sourcil = .4; M.look = [-1, 0]; M.froncer = .2; M.sourcil = 1; }
  c.save(); cam(c, t, [[0, 600, 420, 1.36], [B[0], 560, 410, 1.36], [DUREE, 560, 410, 1.4]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, boite: 1, t }) }, (cc) => { const a = mainScene(M, 1); ampouleC(cc, a[0] - 6, a[1] - 20, .55, .3, 0, 1); });
  obscurite(c, noir * .8);
  c.restore();
}
