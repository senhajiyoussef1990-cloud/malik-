// SCÈNE 07 — Plans 12-13 (salon). Le mouton, yeux écarquillés : « Et la familiarité ressemble à une preuve ? »
// Le renard ouvre un carnet marqué « source ? »… vide.
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s07b'], t), M = voix(moutonBase(t), ['s07a'], t), la = t - A[0], lb = t - B[0];
  M.x = 420; M.look = [-1, .2]; M.froncer = 1; M.sourire = -.1; M.oreille = .25;
  if (la >= 0) { M.handR = [180, -600]; M.poseR = 'ouverte'; M.look = [.8, -.1]; }
  R.x = 650; R.look = [-.9, 0];
  let cn = 0; if (lb >= 0) { cn = ease(seg(lb, 0, .4)); R.handR = [lerp(104, -40, cn), lerp(-440, -600, cn)]; R.handL = [lerp(-104, -150, cn), lerp(-440, -600, cn)]; R.poseL = R.poseR = 'poing'; R.sourcil = .7; R.lid = .55;
    if (lb > B[1] * .5) { R.handR = [-40, -600]; R.handL = [-200, -610]; R.poseL = 'pointe'; } }
  c.save(); cam(c, t, [[0, 330, 440, 1.5], [A[0] + A[1], 380, 400, 1.35], [B[0], 560, 380, 1.4], [DUREE, 580, 380, 1.45]]);
  dessineSalon(c, t, R, M, { tv: 1, ecran: (cc, tt) => rueKiosqueNB(cc, tt, { hp: true }) }, (cc) => {
    if (cn > 0) { const a = mainScene(R, 1), b = mainScene(R, -1); carnet(cc, (a[0] + b[0]) / 2 + 10, (a[1] + b[1]) / 2 - 20, .7 * cn, [['source ?', 1]], 1, -.05); }
  });
  c.restore();
}
