// SCÈNE 06 — trois pots ; celui du milieu est mieux « habillé ». Narrateur s06a, client s06b.
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const lb = local('s06b', t);
    cam(cc, t, [[0, 540, 405, 1.0], [L.s06a[0] + 2.5, 560, 430, 1.16], [L.s06b[0] - .3, 700, 420, 1.2], [DUREE, 620, 410, 1.1]]);
    magasinNB(cc, t); comptoirNB(cc, 260, 820, 560);
    [[400, 'simple'], [540, 'luxe'], [680, 'simple']].forEach(([x, ty]) => pot(cc, x, 560, .9, ty, t));
    const V = vendeurBase(t, 170); V.handR = [170, -560]; V.poseR = 'ouverte'; V.look = [1, .3]; V.sourcil = .6; dessine(cc, V, drawVendeur);
    const C = clientBase(t, lerp(1100, 860, ease(seg(t, 1, 3))));
    if (t < 3) { C.walk = t * 8; C.bob = Math.abs(Math.sin(t * 8)) * 8; }
    if (lb >= 0) { voix(C, ['s06b'], t); const k = ease(seg(lb, 0, .4)); C.handR = [lerp(100, 300, k), lerp(-380, -520, k)]; C.poseR = 'ouverte'; C.handL = [-60, -560]; C.poseL = 'ouverte'; C.lean = .1 * k; C.look = [-1, .4]; C.sourcil = 1; C.bob += Math.abs(Math.sin(t * 10)) * 6; }
    dessine(cc, C, drawClient);
  });
  debutFlash(c, t);
}
