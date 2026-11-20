// SCÈNE 08 — Plans 14-15 (TV + héros). s08a : le renard tient une ampoule d'un concurrent et la montre : « Oui. Et ils testaient même les ampoules de leurs concurrents. »
// s08b : au laboratoire de contrôle, des dizaines d'ampoules brûlent sur des racks ; leurs compteurs défilent ; à 1 000 heures, celles qui tiennent encore sont notées au carnet par des techniciens en blouse.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) {
    const [R, M] = herosTV(t, 360, 220); voix(R, ['s08a'], t); R.look = [-.8, 0]; M.look = [.8, 0];
    if (la >= 0) { R.handR = [120, -640]; R.poseR = 'poing'; R.sourire = .6; R.lid = .5; M.oreille = .3; }
    nbEtCouleur(c, t, [[0, 560, 420, 1.12]], (cc) => laboTestNB(cc, t, { heures: 400 }), (cc) => { heros(cc, R, M); const h = mainScene(R, 1); ampouleC(cc, h[0] + 6, h[1] - 30, .5, -.2, .4); });
  } else {
    enNoirEtBlanc(c, t, (cc) => {
      cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 560, 430, 1.1]]);
      const Te = [TECHNICIEN(t, 300, 0, { face: 1, look: [.4, -.6], handR: [80, -580], poseR: 'poing' }), TECHNICIEN(t, 780, 1, { face: -1, look: [-.4, -.6], handL: [-80, -580], poseL: 'poing' })];
      laboTestNB(cc, t, { heures: seg(lb, 0, B[1]) * 1700, derriere: (c2) => Te.forEach(p => dessine(c2, p)) });
      Te.forEach((p, k) => { const h = mainF(p, k ? -1 : 1); F(cc, poly([[h[0] - 24, h[1] - 30], [h[0] + 24, h[1] - 30], [h[0] + 24, h[1] + 10], [h[0] - 24, h[1] + 10]]), GRIS.blanc, 2); });
    });
  }
  debutFlash(c, t);
}
