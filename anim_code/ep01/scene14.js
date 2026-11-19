// SCÈNE 14 — le renard remet la boîte du milieu sur un piédestal, sous une lumière chaude ; le mouton tend déjà la main. Renard s14a, s14b.
const DUREE = FIN(1.4);
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s14a', 's14b'], t), M = moutonBase(t), la = local('s14a', t), lb = local('s14b', t);
  const pied = ease(seg(lb, 0, .7)), lum = ease(seg(lb, .3, 1.1));
  if (la >= 0 && lb < 0) { R.lid = .6; R.sourcil = .7; R.handR = [130, -700]; R.poseR = 'pointe'; R.look = [1, 0]; R.tilt = -.05; M.look = [-.9, 0]; M.froncer = .6; }
  if (lb >= 0) { R.handR = [lerp(130, 300, pied), lerp(-700, -620, pied)]; R.poseR = 'ouverte'; R.look = [1, .4]; R.lean = .05; R.lid = .55;
    const k = ease(seg(lb, .9, 1.6)); M.handR = [lerp(104, 320, k), lerp(-366, -560, k)]; M.poseR = 'ouverte'; M.lean = .12 * k; M.look = [-1, .4]; M.froncer = 0; M.sourire = .9; M.oreille = .15; }
  c.save(); cam(c, t, [[0, 520, 410, 1.08], [L.s14a[0] + .2, 420, 390, 1.2], [L.s14b[0], 500, 430, 1.22], [DUREE, 560, 420, 1.16]]);
  dessineBoutique(c, t, R, M, (cc) => {
    if (lum > 0) { const g = cc.createLinearGradient(470, 0, 470, 560); g.addColorStop(0, `rgba(255,220,140,${.5 * lum})`); g.addColorStop(1, `rgba(255,220,140,${.15 * lum})`); cc.fillStyle = g; cc.beginPath(); cc.moveTo(440, 0); cc.lineTo(500, 0); cc.lineTo(580, 560); cc.lineTo(360, 560); cc.fill(); }
    const py = 560 - pied * 70; if (pied > 0) { F(cc, poly([[430, 560], [510, 560], [502, py], [438, py]]), '#c8964a', 4); F(cc, ell(470, py, 40, 9), '#e0b060', 3); }
    boite(cc, 350, 560, .82, t, 0); boite(cc, 590, 560, .82, t, 2); boite(cc, 470, py, .82, t, 1, 0, lum);
  });
  c.restore();
}
